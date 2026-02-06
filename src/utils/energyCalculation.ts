import { FormData } from "@/types/formData";

const toNumber = (v?: string): number => {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

/*Total facture énergie (€/an)*/
export const computeTotalNrj = (
  evolution: FormData["evolution"]
): string => {
  const total =
    toNumber(evolution.montantChauffage) +
    toNumber(evolution.montantECS) +
    toNumber(evolution.montantElecDomestique);

  return Math.round(total).toString();
};
/*Projection cout énergie avant travaux*/
export const computeCoutNrj5ans = (
  evolution: FormData["evolution"]
): string => {
  const total =
    toNumber(evolution.coutNrjAujourdhui) * 1.34
  return Math.round(total).toString();
};
export const computeCoutNrj10ans = (
  evolution: FormData["evolution"]
): string => {
  const total =
    toNumber(evolution.coutNrjAujourdhui) * 1.79
  return Math.round(total).toString();
};
export const computeDepenseTotale10ans = (
  evolution: FormData["evolution"]
): string => {
  const total =
    toNumber(evolution.coutNrjAujourdhui) * 14.97
  return Math.round(total).toString();
};


/*Projection cout énergie apres travaux*/
export const computefacture5Ans = (
  exponentiel: FormData["exponentiel"]
): string => {
  const total =
    toNumber(exponentiel.factureAujourdhui) * 1.34
  return Math.round(total).toString();
};
export const computefacture10Ans = (
  exponentiel: FormData["exponentiel"]
): string => {
  const total =
    toNumber(exponentiel.factureAujourdhui) * 1.79
  return Math.round(total).toString();
};
export const computeFactureTotale10ans = (
  exponentiel: FormData["exponentiel"]
): string => {
  const total =
    toNumber(exponentiel.factureAujourdhui) * 14.97
  return Math.round(total).toString();
};
export const computeEcoTotal10ans = (
    exponentiel:FormData["exponentiel"]
): string=> {
    const total = toNumber(exponentiel.consommation10AnsSansTravaux) - toNumber(exponentiel.consommation10AnsApresTravaux)
  return Math.round(total).toString();
}
export const computeEcoAnnuellesMoy = (
    exponentiel:FormData["exponentiel"]
): string=> {
    const total = toNumber(exponentiel.economiesRealisees10Ans) / 10
  return Math.round(total).toString();
}
export const computeEcoMensuellesMoy = (
    exponentiel:FormData["exponentiel"]
): string=> {
    const total = toNumber(exponentiel.economiesAnnuellesMoyennes) / 12
  return Math.round(total).toString();
}

