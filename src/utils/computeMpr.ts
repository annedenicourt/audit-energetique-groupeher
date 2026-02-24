import type { TypeTravauxMpr } from "@/types/mpr/listesMpr";
import type { CategorieMenage } from "@/types/mpr/baremesRfr";
import type { UniteTravauxMpr } from "@/types/mpr/travauxMpr";
import { BAREMES_RFR_HORS_IDF } from "@/types/mpr/baremesRfr";
import { TRAVAUX_MPR } from "@/types/mpr/travauxMpr";

export type MprInput = {
  nbPersonnes: number;
  rfr: number;
  typeTravaux: TypeTravauxMpr;
  quantite?: number;
  cee?: number;
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
  mprFinal: number;
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
  const { nbPersonnes, rfr, typeTravaux, quantite = 0, cee = 0 } = input;
  const categorie = determinerCategorie(nbPersonnes, rfr);
  const travail = TRAVAUX_MPR[typeTravaux];
  const unite = travail.unite;
  const plafondEligibleUnitaire = travail.plafondEligible;

  if (categorie === "SUPERIEUR") {
    return {
      categorie,
      unite,
      montantUnitaire: 0,
      mprBrut: 0,
      plafondEligibleUnitaire,
      plafondEligibleTotal: unite === "FORFAIT" ? plafondEligibleUnitaire : plafondEligibleUnitaire * quantite,
      mprFinal: 0,
    };
  }

  const montantUnitaire = travail.montants[categorie];
  const mprBrut = unite === "FORFAIT" ? montantUnitaire : montantUnitaire * quantite;
  const plafondEligibleTotal = unite === "FORFAIT" ? plafondEligibleUnitaire : plafondEligibleUnitaire * quantite;
  const tauxEcretement = TAUX_ECRETEMENT[categorie];
  const capEcretement = tauxEcretement * plafondEligibleTotal;
  const mprFinal = Math.max(0, Math.min(mprBrut, capEcretement - cee));

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
  };
}
