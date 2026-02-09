 // Types pour l'état global du formulaire d'audit énergétique
 
 export interface ClientData {
   // Coordonnées
   nom: string;
   telephone: string;
   adresse: string;
   codePostal: string;
   ville: string;
   
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
   eauChaudeSanitaire: string;
   eauChaudeSanitaireCommentaire: string;
   ventilation: string;
   ventilationCommentaire: string;
   
   // Notes
   notes: string;
 }

 export interface EvolutionData {
  // Répartition facture
   montantChauffage: string;
   montantECS: string;
   montantElecDomestique: string;
   totalFactureNRJ: string;
   // Énergie actuelle
   energieActuelle: string;
   // Projection cout NRJ
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
 
 export interface ScenariosData {
   scenario1: ScenarioData;
   scenario2: ScenarioData;
   scenario3: ScenarioData;
 }

 export interface DimensionnementData {
   // Dimensionnement thermique
   puissanceThermique: string;
   // Dimensionnement solaire
   consommationElecAnnuelle: string;
   puissancePVRecommandee: string;
   productionPVEstimee: string;
 }

 export interface ExponentielData {
   consommation10AnsSansTravaux: string;
   consommation10AnsApresTravaux: string;
   economiesRealisees10Ans: string;
   economiesAnnuellesMoyennes: string;
   economiesMensuellesMoyennes: string;
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
   resteACharge: string;
   economiesSur10Ans: string;
   gainSur10Ans: string;
 }
 
 export interface FinancementData {
   // Écofinancement
   mensualiteConfort: string;
   economiesMoyennesMensuelles: string;
   mensualiteMoinsEconomies: string;
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
     adresse: "",
     codePostal: "",
     ville: "",
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
     eauChaudeSanitaire: "",
     eauChaudeSanitaireCommentaire: "",
     ventilation: "",
     ventilationCommentaire: "",  
     notes: "",
   },
   evolution: {
     montantChauffage: "",
     montantECS: "",
     montantElecDomestique: "",
    totalFactureNRJ: "",
     energieActuelle: "",
     // Projection cout NRJ
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
    puissanceThermique: "",
     consommationElecAnnuelle: "",
     puissancePVRecommandee: "",
     productionPVEstimee: "",
   },
   exponentiel: {
     consommation10AnsSansTravaux: "",
     consommation10AnsApresTravaux: "",
     economiesRealisees10Ans: "",
     economiesAnnuellesMoyennes: "",
     economiesMensuellesMoyennes: "",
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
     resteACharge: "",
     economiesSur10Ans: "",
     gainSur10Ans: "",
   },
   financement: {
     mensualiteConfort: "",
     economiesMoyennesMensuelles: "",
     mensualiteMoinsEconomies: "",
   },
 };