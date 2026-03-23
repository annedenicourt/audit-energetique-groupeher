 // Types pour l'état global du formulaire d'audit énergétique
 
 export interface ClientData {
   // Coordonnées
   nom: string;
   telephone: string;
   adresse: string;
   codePostal: string;
   ville: string;
   adresseFiscale: string;
   codePostalFiscal: string;
   villeFiscale: string;
   
   // Situation professionnelle
   situationConjoint1: string;
   situationConjoint2: string;
   ageConjoint1: string;
   ageConjoint2: string;
   
   // Accompagnateur
   accompagnateur: string;
   departement: string;

   // Habitation
   anneeConstruction: string;
   proprietaireDepuis: string;
   surfaceHabitable: string;
   nbrePiecesChaufees: string;
   nbrePersonnes: string;
   dontEnfants: string;
   
   // Chauffage
   typeChauffage: string;
   ageChauffage: string;
   coutAnnuelChauffage: string;
   temperatureJour: string;
   temperatureNuit: string;

   // Chauffage d'appoint
   typeChauffageAppoint: string;
   ageChauffageAppoint: string;
   coutAnnuelChauffageAppoint: string;

   montantChauffage: string;
   
   // Eau chaude
   typeEauChaude: string;
   ageEauChaude: string;
   
   // Aération
   typeAeration: string;
   ageAeration: string;

   // Facture électricité
   factureElecAnnuelle: string;
   factureElecMensuelle: string;
   
   // Facture énergétique globale
   factureEnergieAnnuelle: string;
   factureEnergieMensuelle: string;
   
   // Travaux réalisés
   travauxRealises: string;
   montantTravaux: string;
   
   // Aides perçues
   aidesMaPrimeRenov: string;
   dispoMaPrimeRenov: string;
   aidesCEE: string;
   aidesAutre: string;
   montantAides: string;
 }
 export interface BilanData {
   // Situation actuelle
   classeEnergetique: string;
   consommationActuelle: string;
   factureAnnuelle: string;
   
   // Analyse des postes
   isolationCombles: string;
   isolationComblesCommentaire: string;
   isolationMurs: string;
   isolationMursCommentaire: string;
   menuiseries: string;
   menuiseriesCommentaire: string;
   chauffagePrincipal: string;
   chauffagePrincipalCommentaire: string;
   chauffageAppoint: string;
   chauffageAppointCommentaire: string;
   eauChaudeSanitaire: string;
   eauChaudeSanitaireCommentaire: string;
   ventilation: string;
   ventilationCommentaire: string;
   
   // Notes
   notes: string;
 }
 export interface EvolutionData {
  // Répartition facture
   montantECS: string;
   montantElecDomestique: string;
   totalFactureNRJ: string;
   // Énergie actuelle
   energieActuelle: string;
   // Projection cout NRJ
     coutNrjMoins5ans:string;
     coutNrjAujourdhui: string,
     coutNrj5Ans: string,
     coutNrj10Ans: string,
     depenseTotal10ans: string,
   // Notes
   notes: string;
 }
 
 export interface ScenarioData {
   nom: string;
   economieAnnuelle: string;
   plusValueLogement: string;
   factureApres: string;
   lettreApres: string;
 }

 export interface FenetreData {
   quantite:string;
   type: string;
   ouverture: string;
   matiere: string;
 }
 
 export interface ScenariosData {
   scenario1: ScenarioData;
   scenario2: ScenarioData;
   scenario3: ScenarioData;
 }

 export type DimensionnementSectionKey =
  | "pacAirEau"
  | "pacAirAir"
  | "multiplus"
  | "poele"
  | "thermodynamique"
  | "ecsSolaire"
  | "ssc"
  | "photovoltaique"
  | "isolation"
  | "ite"
  | "menuiseries"
  | "vmc"
  | "autreProduit";

 export type SelectedDimensionnementSections = Record<DimensionnementSectionKey, boolean>;

 export interface DimensionnementData {
  selectedSections: SelectedDimensionnementSections;

  // Chauffage / ECS
  dimensionnementPACaireau: string;
  dimensionnementPACairair: string;
  dimensionnementMultiplus: string;
  dimensionnementPoele: string;
  dimensionnementThermodynamique: string;
  dimensionnementECSSolaire: string;
  dimensionnementSSC: string;
  // Photovoltaïque
  resultatRevolt: string;
  consommationPVElecAnnuelle: string;
  puissancePVRecommandee: string;
  productionPVEstimee: string;
  batteriePhysiqueReco: string;
  batterieVirtuelleReco: string;
  // Isolation
  dimensionnementComblesPerdus: string;
  dimensionnementRampants: string;
  dimensionnementPlancherBas: string;
  // Fenêtres / Menuiseries
  dimensionnementFenetres: FenetreData[];
  quantiteVolets: string;
  // VMC
  dimensionnementVMC: string,
  // Autre produit
  dimmensionnementAutreProduit: string;
}
 export interface ExponentielData {
   consommation10AnsSansTravaux: string;
   consommation10AnsApresTravaux: string;
   economiesRealisees10Ans: string;
   economiesAnnuellesMoyennes: string;
   economiesPremiereAnne: string;
   economiesMensuellesMoyennes: string;
   economies10eAnnee: string;
   // Projection
   factureAujourdhui: string;
   facture5Ans: string;
   facture10Ans: string;
 }
 
 export interface AidesData {
   // Plafonds
   nbrePersonnesFoyer: string;
   dernierRFR: string;
   categorieRevenus: string;
   
   // Synthèse financière
   coutTotalInstallation: string;
   primeCEE: string;
   maPrimeRenov: string;
   resteAChargeAvantMpr: string;
   resteAChargeApresMpr: string;
   economiesSur10Ans: string;
   gainSur10Ans: string;
 }
 
 export interface FinancementData {
   // Écofinancement
   mensualite1: string;
   mensualiteConfort: string;
   economiesMoyennesMensuelles: string;
   mensualiteMoinsEconomies: string;
   mois1:string,
   mois2:string,
   mois3:string,
   mois4:string,
   mois5:string,
 }
 
 export interface FormData {
   client: ClientData;
   bilan: BilanData;
   evolution: EvolutionData;
   scenarios: ScenariosData;
   dimensionnement: DimensionnementData,
   exponentiel: ExponentielData,
   aides: AidesData;
   financement: FinancementData;
 }
 
 // Valeurs initiales
 export const initialFormData: FormData = {
   client: {
     nom: "",
     telephone: "",
     adresseFiscale:"",
     adresse: "",
     codePostal: "",
     ville: "",
     codePostalFiscal: "",
     villeFiscale: "",
     situationConjoint1: "",
     situationConjoint2: "",
     ageConjoint1: "",
     ageConjoint2: "",
     accompagnateur: "",
     departement: "",
     anneeConstruction: "",
     proprietaireDepuis: "",
     surfaceHabitable: "",
     nbrePiecesChaufees: "",
     nbrePersonnes: "",
     dontEnfants: "",
     typeChauffage: "",
     ageChauffage: "",
     coutAnnuelChauffage: "",
     typeChauffageAppoint: "",
     ageChauffageAppoint: "",
     coutAnnuelChauffageAppoint: "",
     montantChauffage:"",
     temperatureJour: "",
     temperatureNuit: "",
     typeEauChaude: "",
     ageEauChaude: "",
     typeAeration: "",
     ageAeration: "",
     factureElecAnnuelle: "",
     factureElecMensuelle: "",
     factureEnergieAnnuelle: "",
     factureEnergieMensuelle: "",
     travauxRealises: "",
     montantTravaux: "",
     aidesMaPrimeRenov: "",
     dispoMaPrimeRenov:"",
     aidesCEE: "",
     aidesAutre: "",
     montantAides: "",
   },
   bilan: {
     classeEnergetique: "",
     consommationActuelle: "",
     factureAnnuelle: "",
     isolationCombles: "",
     isolationComblesCommentaire: "",
     isolationMurs: "",
     isolationMursCommentaire: "",
     menuiseries: "",
     menuiseriesCommentaire: "",
     chauffagePrincipal: "",
     chauffagePrincipalCommentaire: "",
     chauffageAppoint: "",
     chauffageAppointCommentaire: "",
     eauChaudeSanitaire: "",
     eauChaudeSanitaireCommentaire: "",
     ventilation: "",
     ventilationCommentaire: "",  
     notes: "",
   },
   evolution: {
     montantECS: "",
     montantElecDomestique: "",
    totalFactureNRJ: "",
     energieActuelle: "",
     // Projection cout NRJ
     coutNrjMoins5ans:"",
     coutNrjAujourdhui: "",
     coutNrj5Ans: "",
     coutNrj10Ans: "",
     depenseTotal10ans: "",
     notes: "",
   },
   scenarios: {
     scenario1: { nom: "", economieAnnuelle: "", plusValueLogement: "", factureApres: "", lettreApres: "" },
     scenario2: { nom: "", economieAnnuelle: "", plusValueLogement: "", factureApres: "", lettreApres: "" },
     scenario3: { nom: "", economieAnnuelle: "", plusValueLogement: "", factureApres: "", lettreApres: "" },
   },
   dimensionnement: {
    selectedSections:{
      pacAirEau: false,
      pacAirAir: false,
      multiplus: false,
      poele: false,
      thermodynamique: false,
      ecsSolaire: false,
      ssc: false,
      photovoltaique: false,
      isolation: false,
      ite: false,
      menuiseries: false,
      vmc: false,
      autreProduit: false,
    },

  dimensionnementPACaireau: "",
  dimensionnementPACairair: "",
  dimensionnementMultiplus: "",
  dimensionnementPoele: "",
  dimensionnementThermodynamique: "",
  dimensionnementECSSolaire: "",
  dimensionnementSSC: "",

  resultatRevolt: "",
  consommationPVElecAnnuelle: "",
  puissancePVRecommandee: "",
  productionPVEstimee: "",
  batteriePhysiqueReco: "",
  batterieVirtuelleReco: "",

  dimensionnementComblesPerdus: "",
  dimensionnementRampants: "",
  dimensionnementPlancherBas:"",

  dimensionnementFenetres: [{ quantite: "", type: "", ouverture: "", matiere: "" }],
  quantiteVolets:"",

  dimensionnementVMC: "",
  dimmensionnementAutreProduit: "",
},

   exponentiel: {
     consommation10AnsSansTravaux: "",
     consommation10AnsApresTravaux: "",
     economiesRealisees10Ans: "",
     economiesAnnuellesMoyennes: "",
     economiesPremiereAnne: "",
     economiesMensuellesMoyennes: "",
     economies10eAnnee:"",     
   
   // Projection après travaux
     factureAujourdhui: "",
     facture5Ans: "",
     facture10Ans: "",  
   },
   aides: {
     nbrePersonnesFoyer: "",
     dernierRFR: "",
     categorieRevenus: "",
     coutTotalInstallation: "",
     primeCEE: "",
     maPrimeRenov: "",
     resteAChargeAvantMpr: "",
     resteAChargeApresMpr: "",
     economiesSur10Ans: "",
     gainSur10Ans: "",
   },
   financement: {
    mensualite1:"",
     mensualiteConfort: "",
     economiesMoyennesMensuelles: "",
     mensualiteMoinsEconomies: "",
     mois1:"",
     mois2:"",
     mois3:"",
     mois4:"",
     mois5:"",
   },
 };