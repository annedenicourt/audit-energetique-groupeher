// Types pour le Dossier de Liaison

export interface SplitData {
  nomPiece: string;
  puissanceKw: string;
  dosADos: string;
  pompeRelevage: string;
}

export interface RadiateurData {
  materiau: string;
  hauteur: string;
  largeur: string;
  epaisseur: string;
}

export interface DossierFormData {
  // 1) DOSSIER DE LIAISON
  conseiller: string;
  perso: boolean;
  parrain: boolean;
  t1: boolean;
  t2: boolean;
  t3: boolean;
  lead: boolean;
  nomClient: string;
  telephone: string;
  adresseFiscale: string;
  adresseInstallation: string;
  codePostal: string;
  ville: string;
  codePostalFiscal: string;
  villeFiscale: string;

  // 2) RÈGLEMENT
  reglementCheque: boolean;
  reglementFinancement: boolean;
  reglementPTZ: boolean;

  // 3) DOSSIER DE PRIME
  proprietaireOccupant: boolean;
  proprietaireBailleur: boolean;
  residSecondaire: boolean;
  sci: boolean;
  // Pièces / checklist
  devisNonSigne: boolean;
  devisSigne: boolean;
  carteIdentite: boolean;
  deuxDerniersAvisImpots: boolean;
  taxeFonciereActeNotarie: boolean;
  mandatMaPrimeRenov: boolean;
  idNumerique: boolean;
  rib: boolean;
  attestationFioul: boolean;
  attestationIndivisionnaire: boolean;
  attestationProprietaireBailleur: boolean;
  noteDimensionnement: boolean;
  revolt: boolean;
  pouvoir: boolean;
  // Prime EDF
  primeCeeDeduite: boolean;
  compteCeeEdf: boolean;
  montantPrimeEDF: string;
  mailPrimeEDF: string;
  mdpPrimeEDF: string;
  // Prime Rénov
  nonEligibleMpr: boolean;
  compteMPR: boolean;
  montantPrimeRenov: string;
  mailPrimeRenov: string;
  mdpPrimeRenov: string;
  //Compte email
  gmailCree: string;
  mdpGmail: string;
  // 4) DOSSIER DE FINANCEMENT
  justificatifDomicile: boolean;
  bulletinsSalaires: boolean;
  bilanEntrepreneur: boolean;

  // 5) MAISON
  anneeConstruction: string;
  plainPied: boolean;
  etages: boolean;
  nbEtages: string;
  sousSol: boolean;
  videSanitaire: boolean;
  videSanitaireAccessible: boolean;
  typeMur: string;
  epaisseurMur: string;
  // Combles
  comblePerdu: boolean;
  comblePerduAccessible: boolean;
  comblePerduTrappe: boolean;
  comblePerduToit: boolean;
  comblePerduAutre: boolean;
  comblePerduAutreTexte: string;
  combleAmenage: boolean;
  // Type de plancher
  plancherBois: boolean;
  plancherPlaco: boolean;
  plancherHourdis: boolean;
  // Chauffage actuel
  chauffageFioul: boolean;
  chauffageGaz: boolean;
  chauffageRadiateursElec: boolean;
  chauffageBois: boolean;
  chauffageAutre: boolean;
  chauffageAutreTexte: string;
  // Circuit hydraulique
  circuitHydraulique: string;
  // Type radiateurs
  radiateurAcier: boolean;
  radiateurAlu: boolean;
  radiateurFonte: boolean;
  nombreRadiateurs: string;
  plancherChauffant: boolean;
  // Thermostats
  thermostatBiZone: boolean;
  thermostatFilaire: boolean;
  thermostatNonFilaire: boolean;
  pasDeThermostat: boolean;
  quantiteFenetres: string;
  matiereFenetres: string;
  quantiteVolets: string;

  // 6) ÉLECTRICITÉ
  monophase: boolean;
  triphase: boolean;
  installationAuxNormes: string;
  amperageDisjoncteur: string;
  amperageMax: string;
  emplacementTableauPrincipal: string;
  linky: string;
  abonnementKva: string;

  // 7) PAC AIR EAU
  pacMonoblocHybea: boolean;
  pacBiBloc: boolean;
  emplacementUniteExterieure: string;
  emplacementUniteInterieure: string;
  distanceEntreModules: string;
  distancePacTableau: string;
  difficultePasaggeTableaux: string;
  chapeAFairePac: string;
  passageLiaisonsComble: boolean;
  passageLiaisonsDirect: boolean;
  passageLiaisonsInterieur: boolean;
  passageLiaisonsAutres: boolean;
  passageLiaisonsAutresTexte: string;
  trancheeAFairePac: string;
  typePosePacSol: boolean;
  typePosePacMur: boolean;
  hauteurLocalPac: string;
  leveGroupePac: boolean;
  nacellePac: boolean;

  // 8) BTD
  btdMonobloc: boolean;
  btdBiBloc: boolean;
  btdEmplacementLocalTech: boolean;
  btdEmplacementGarage: boolean;
  btdEmplacementCellier: boolean;
  btdEmplacementAutre: boolean;
  btdEmplacementAutreTexte: string;
  btdGroupeExtSol: boolean;
  btdGroupeExtMur: boolean;
  btdGroupeExtHauteur: string;
  btdDalleExiste: string;
  btdAccessible: string;

  // 9) PAC AIR AIR
  pacAirAirMonoSplit: boolean;
  pacAirAirMultiSplit: boolean;
  pacAirAirConsole: boolean;
  pacAirAirGainable: boolean;
  splits: SplitData[];
  pacAirAirGroupeExtSol: boolean;
  pacAirAirGroupeExtMur: boolean;
  pacAirAirLeveGroupe: boolean;
  pacAirAirNacelle: boolean;
  pacAirAirDistance: string;
  pacAirAirNatureSol: string;
  pacAirAirHauteur: string;
  pacAirAirTypeMur: string;
  pacAirAirTranchee: string;
  pacAirAirChapeExistante: boolean;
  pacAirAirChapeAFaire: boolean;

  // 10) PV ou SSC
  pvTypePoseAuSol: boolean;
  pvTypePoseToiture: boolean;
  pvTypePoseMuraleSsc: boolean;
  pvFormatPortrait: boolean;
  pvFormatPaysage: boolean;
  pvToitureBacAcier: boolean;
  pvToitureEverite: boolean;
  pvToitureTuile: boolean;
  pvRaccordementEnterre: boolean;
  pvRaccordementAerien: boolean;
  pvDocDevisSigne: boolean;
  pvDocPouvoir: boolean;
  pvDocTaxeFonciere: boolean;
  pvDocFactureEdf: boolean;
  pvDocParcelle: boolean;
  pvNacellePlus4m: boolean;
  pvSscTaille: string;

  // 11) COMMENTAIRES
  commentaires: string;

  // 12) RADIATEURS
  radiateurs: RadiateurData[];

// PHOTOS CHECKLIST
  photoCompteur: boolean;
  photoChaudiere: boolean;
  photoGroupeExt: boolean;
  photoMaison: boolean;
  photoCombles: boolean;
  photoECS: boolean;
  photoDisjoncteur: boolean;
  photoTuyauterie: boolean;
  photoRadiateurs: boolean;
  photoPlafonds: boolean;
  photoSousSol: boolean;
  photoTableauElec: boolean;
  photoVentilation: boolean;
  photoUniteInt: boolean;
  photoPlancher: boolean;
  photoRDC: boolean;
  photoFenetres: boolean;
  photoPorteFenetre: boolean;
  photoFacade: boolean;
  photoPorte: boolean;
}

export const defaultSplit: SplitData = {
  nomPiece: "",
  puissanceKw: "",
  dosADos: "",
  pompeRelevage: "",
};

export const defaultRadiateur: RadiateurData = {
  materiau: "",
  hauteur: "",
  largeur: "",
  epaisseur: "",
};

export const defaultDossierFormData: DossierFormData = {
  conseiller: "",
  perso: false,
  parrain: false,
  t1: false,
  t2: false,
  t3: false,
  lead: false,
  nomClient: "",
  telephone: "",
  adresseFiscale: "",
  adresseInstallation: "",
  codePostal:"",
  ville:"",
  codePostalFiscal:"",
  villeFiscale:"",

  reglementCheque: false,
  reglementFinancement: false,
  reglementPTZ: false,

  proprietaireOccupant: false,
  proprietaireBailleur: false,
  residSecondaire: false,
  sci: false,
  devisNonSigne: false,
  devisSigne: false,
  carteIdentite: false,
  deuxDerniersAvisImpots: false,
  taxeFonciereActeNotarie: false,
  mandatMaPrimeRenov: false,
  idNumerique: false,
  rib: false,
  attestationFioul: false,
  attestationIndivisionnaire: false,
  attestationProprietaireBailleur: false,
  noteDimensionnement: false,
  revolt: false,
  pouvoir: false,
  primeCeeDeduite: false,
  compteCeeEdf: false,
  montantPrimeEDF: "",
  mailPrimeEDF: "",
  mdpPrimeEDF: "",
  nonEligibleMpr: false,
  compteMPR: false,
  montantPrimeRenov: "",
  mailPrimeRenov: "",
  mdpPrimeRenov: "",
  gmailCree: "",
  mdpGmail: "",

  justificatifDomicile: false,
  bulletinsSalaires: false,
  bilanEntrepreneur: false,

  anneeConstruction: "",
  plainPied: false,
  etages: false,
  nbEtages: "",
  sousSol: false,
  videSanitaire: false,
  videSanitaireAccessible: false,
  typeMur: "",
  epaisseurMur: "",
  comblePerdu: false,
  comblePerduAccessible: false,
  comblePerduTrappe: false,
  comblePerduToit: false,
  comblePerduAutre: false,
  comblePerduAutreTexte: "",
  combleAmenage: false,
  plancherBois: false,
  plancherPlaco: false,
  plancherHourdis: false,
  chauffageFioul: false,
  chauffageGaz: false,
  chauffageRadiateursElec: false,
  chauffageBois: false,
  chauffageAutre: false,
  chauffageAutreTexte: "",
  circuitHydraulique: "",
  radiateurAcier: false,
  radiateurAlu: false,
  radiateurFonte: false,
  nombreRadiateurs: "",
  plancherChauffant: false,
  thermostatBiZone: false,
  thermostatFilaire: false,
  thermostatNonFilaire: false,
  pasDeThermostat: false,
  quantiteFenetres: "",
  matiereFenetres: "",
  quantiteVolets: "",

  monophase: false,
  triphase: false,
  installationAuxNormes: "",
  amperageDisjoncteur: "",
  amperageMax: "",
  emplacementTableauPrincipal: "",
  linky: "",
  abonnementKva: "",

  pacMonoblocHybea: false,
  pacBiBloc: false,
  emplacementUniteExterieure: "",
  emplacementUniteInterieure: "",
  distanceEntreModules: "",
  distancePacTableau: "",
  difficultePasaggeTableaux: "",
  chapeAFairePac: "",
  passageLiaisonsComble: false,
  passageLiaisonsDirect: false,
  passageLiaisonsInterieur: false,
  passageLiaisonsAutres: false,
  passageLiaisonsAutresTexte: "",
  trancheeAFairePac: "",
  typePosePacSol: false,
  typePosePacMur: false,
  hauteurLocalPac: "",
  leveGroupePac: false,
  nacellePac: false,

  btdMonobloc: false,
  btdBiBloc: false,
  btdEmplacementLocalTech: false,
  btdEmplacementGarage: false,
  btdEmplacementCellier: false,
  btdEmplacementAutre: false,
  btdEmplacementAutreTexte: "",
  btdGroupeExtSol: false,
  btdGroupeExtMur: false,
  btdGroupeExtHauteur: "",
  btdDalleExiste: "",
  btdAccessible: "",

  pacAirAirMonoSplit: false,
  pacAirAirMultiSplit: false,
  pacAirAirConsole: false,
  pacAirAirGainable: false,
  splits: Array.from({ length: 1 }, () => ({ ...defaultSplit })),
  pacAirAirGroupeExtSol: false,
  pacAirAirGroupeExtMur: false,
  pacAirAirLeveGroupe: false,
  pacAirAirNacelle: false,
  pacAirAirDistance: "",
  pacAirAirNatureSol: "",
  pacAirAirHauteur: "",
  pacAirAirTypeMur: "",
  pacAirAirTranchee: "",
  pacAirAirChapeExistante: false,
  pacAirAirChapeAFaire: false,

  pvTypePoseAuSol: false,
  pvTypePoseToiture: false,
  pvTypePoseMuraleSsc: false,
  pvFormatPortrait: false,
  pvFormatPaysage: false,
  pvToitureBacAcier: false,
  pvToitureEverite: false,
  pvToitureTuile: false,
  pvRaccordementEnterre: false,
  pvRaccordementAerien: false,
  pvDocDevisSigne: false,
  pvDocPouvoir: false,
  pvDocTaxeFonciere: false,
  pvDocFactureEdf: false,
  pvDocParcelle: false,
  pvNacellePlus4m: false,
  pvSscTaille: "",

  commentaires: "",

  radiateurs: Array.from({ length: 1 }, () => ({ ...defaultRadiateur })),

  photoCompteur: false,
  photoChaudiere: false,
  photoGroupeExt: false,
  photoMaison: false,
  photoCombles: false,
  photoECS: false,
  photoDisjoncteur: false,
  photoTuyauterie: false,
  photoRadiateurs: false,
  photoPlafonds: false,
  photoSousSol: false,
  photoTableauElec: false,
  photoVentilation: false,
  photoUniteInt: false,
  photoPlancher: false,
  photoRDC: false,
  photoFenetres: false,
  photoPorteFenetre: false,
  photoFacade: false,
  photoPorte: false,
};