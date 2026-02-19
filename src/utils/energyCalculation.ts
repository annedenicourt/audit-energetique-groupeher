import { FormData } from "@/types/formData";

const toNumber = (v?: string): number => {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

/*Aide disponible MPR*/
export const computeDispoMPR = (
  client: FormData["client"]
): string => {
  const total =
    20000 - toNumber(client.aidesMaPrimeRenov);
  return Math.round(total).toString();
};
export const computeTotalAides = (
  client: FormData["client"]
): string => {
  const total =
    toNumber(client.aidesCEE) +toNumber(client.aidesMaPrimeRenov) +toNumber(client.aidesAutre);
  return Math.round(total).toString();
};

/*Addition facture énergétique globale avant travaux*/
export const computeNRJAnnuel = (
  client: FormData["client"]
): string => {
  const total =
    toNumber(client.coutAnnuelChauffage) + toNumber(client.coutAnnuelChauffageAppoint)+ toNumber(client.factureElecAnnuelle);
  return Math.round(total).toString();
};

/*Total facture énergie (€/an)*/
export const computeTotalChauffage = (
  client: FormData["client"],
): string => {
  const total =
    toNumber(client.coutAnnuelChauffage) + toNumber(client.coutAnnuelChauffageAppoint);
  return Math.round(total).toString();
};
export const computeTotalNrj = (
 montantChauffage:string, montantElecDomestique
): string => {
  const total =
    toNumber(montantChauffage) + toNumber(montantElecDomestique);
  return Math.round(total).toString();
};
/*Projection cout énergie avant travaux*/
export const computeCoutNrjMoins5ans = (
  evolution: FormData["evolution"]
): string => {
  const total =
    toNumber(evolution.coutNrjAujourdhui) * 0.659
  return Math.round(total).toString();
};
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

/*Facture NRJ apres travaux*/
export const computefactureApres = (
  percent: number, evolution: FormData["evolution"]
): string => {
  const base = toNumber(evolution.coutNrjAujourdhui);
  const total = Math.round(base * (1 - percent / 100));
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
    const updateFactureTotale10ans = toNumber(exponentiel.factureAujourdhui) * 14.97
    const total = toNumber(exponentiel.consommation10AnsSansTravaux) - updateFactureTotale10ans
  return Math.round(total).toString();
}
export const computeEcoAnnuellesMoy = (
    exponentiel:FormData["exponentiel"]
): string=> {
  const updateEcoTotale10ans= toNumber(exponentiel.consommation10AnsSansTravaux) - toNumber(exponentiel.consommation10AnsApresTravaux)
    const total = updateEcoTotale10ans / 10
  return Math.round(total).toString();
}
export const computeEcoMensuellesMoy = (
    exponentiel:FormData["exponentiel"]
): string=> {
    const total = toNumber(exponentiel.economiesAnnuellesMoyennes) / 12
  return Math.round(total).toString();
}

/*Section Aides*/
export const computeResteaChargeAvant = (
  aides: FormData["aides"]
): string => {
  const total =
    toNumber(aides.coutTotalInstallation) - toNumber(aides.primeCEE)
  return Math.round(total).toString();
};
export const computeResteaChargeApres = (
  aides: FormData["aides"]
): string => {
  const total =
    toNumber(aides.coutTotalInstallation) - toNumber(aides.primeCEE) - toNumber(aides.maPrimeRenov)
  return Math.round(total).toString();
};
export const computeGain10ans = (
  aides: FormData["aides"]
): string => {
  const updateResteACharge = toNumber(aides.coutTotalInstallation) - toNumber(aides.primeCEE) - toNumber(aides.maPrimeRenov)
  const total =
    toNumber(aides.economiesSur10Ans) - updateResteACharge
  return Math.round(total).toString();
};

/*Section Financement*/
export const computeEcoMoinsMensualite = (
  financement: FormData["financement"]
): string => {
  const total =
   toNumber(financement.economiesMoyennesMensuelles) - toNumber(financement.mensualiteConfort)
  return Math.round(total).toString();
};



