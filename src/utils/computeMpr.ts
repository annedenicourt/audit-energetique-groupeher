import type { TypeTravauxMpr } from "@/types/mpr/listesMpr";
import type { CategorieMenage } from "@/types/mpr/baremesRfr";
import type { UniteTravauxMpr } from "@/types/mpr/travauxMpr";
import { BAREMES_RFR_HORS_IDF } from "@/types/mpr/baremesRfr";
import { TRAVAUX_MPR } from "@/types/mpr/travauxMpr";

export type MprInput = {
  nbPersonnes: number;
  rfr: number;
  ageLogement?:number;
  typeTravaux: TypeTravauxMpr;
  quantite?: number;
  cee?: number;
  mpr?: number;
  replaceFioul?: boolean;
};

export type MprOutput = {
  categorie: CategorieMenage;
  unite: UniteTravauxMpr;
  montantUnitaire: number;
  mprBrut: number;
  plafondEligibleUnitaire: number;
  plafondEligibleTotal: number;
  tauxEcretement?: number;
  capEcretement?: number;
  mpr?: number;
  mprFinal: number;
  mprApresPlafond?: number;
  isEligible: boolean;
  reasons?: string[];
};

const TAUX_ECRETEMENT: Record<Exclude<CategorieMenage, "SUPERIEUR">, number> = {
  TRES_MODESTE: 0.9,
  MODESTE: 0.75,
  INTERMEDIAIRE: 0.6,
};

function determinerCategorie(nbPersonnes: number, rfr: number): CategorieMenage {
  const categories = ["TRES_MODESTE", "MODESTE", "INTERMEDIAIRE"] as const;

  for (const cat of categories) {
    const bareme = BAREMES_RFR_HORS_IDF[cat];
    const plafond =
      nbPersonnes <= 5
        ? bareme.plafonds_1a5[nbPersonnes - 1]
        : bareme.plafonds_1a5[4] + (nbPersonnes - 5) * bareme.increment;

    if (rfr <= plafond) return cat;
  }

  return "SUPERIEUR";
}

export function computeMpr(input: MprInput): MprOutput {
  const { nbPersonnes, rfr, typeTravaux, quantite = 0, cee = 0, mpr = 0, replaceFioul = false } = input;

  const categorie = determinerCategorie(Math.max(1, nbPersonnes), rfr);
  const travail = TRAVAUX_MPR[typeTravaux];
  const unite = travail.unite;

  const plafondEligibleUnitaire = travail.plafondEligible;
  const plafondEligibleTotal =
    unite === "FORFAIT" ? plafondEligibleUnitaire : plafondEligibleUnitaire * quantite;

  const age = input.ageLogement ?? 0;

  // 1) Condition d'éligibilité âge logement
  if (age > 0 && age < 15 && !replaceFioul) {
    return {
      categorie, // ✅ on garde la vraie catégorie
      unite,
      montantUnitaire: 0,
      mprBrut: 0,
      plafondEligibleUnitaire,
      plafondEligibleTotal,
      tauxEcretement: categorie === "SUPERIEUR" ? undefined : TAUX_ECRETEMENT[categorie],
      capEcretement: categorie === "SUPERIEUR" ? undefined : (TAUX_ECRETEMENT[categorie] * plafondEligibleTotal),
       mpr: 0,
      mprApresPlafond: 0,
      mprFinal: 0,
      isEligible: false,
      reasons: ["Logement achevé depuis moins de 15 ans (non éligible MPR sauf PAC en remplacement de fioul)"],
    };
  }

  // 2) Non éligible si catégorie supérieure
  if (categorie === "SUPERIEUR") {
    return {
      categorie,
      unite,
      montantUnitaire: 0,
      mprBrut: 0,
      plafondEligibleUnitaire,
      plafondEligibleTotal,
      mpr: 0,
      mprApresPlafond: 0,
      mprFinal: 0,
      isEligible: false,
      reasons: ["Catégorie de revenus 'Supérieur' : non éligible à MaPrimeRénov'."],
    };
  }

  // Non éligible si isolation combles perdus
  if (typeTravaux === "Isolation combles perdus") {
    return {
      categorie,
      unite,
      montantUnitaire: 0,
      mprBrut: 0,
      plafondEligibleUnitaire,
      plafondEligibleTotal,
      mpr: 0,
      mprApresPlafond: 0,
      mprFinal: 0,
      isEligible: false,
      reasons: ["Les travaux d'isolation de combles perdus ne sont pas éligibles à MaPrimeRénov'"],
    };
  }

  // 3) Calcul brut + écrêtement
  const montantUnitaire = travail.montants[categorie];
  const mprBrut = unite === "FORFAIT" ? montantUnitaire : montantUnitaire * quantite;

  const tauxEcretement = TAUX_ECRETEMENT[categorie];
  const capEcretement = tauxEcretement * plafondEligibleTotal;
  const mprFinal = Math.max(0, Math.min(mprBrut, capEcretement - cee));
  const mprApresPlafond = Math.max(0, Math.min(mprFinal, 20000 - mpr));

  return {
    categorie,
    unite,
    montantUnitaire,
    mprBrut,
    plafondEligibleUnitaire,
    plafondEligibleTotal,
    tauxEcretement,
    capEcretement,
    mprFinal,
    mpr,
    mprApresPlafond,
    isEligible: true,
    reasons: [],
  };
}
