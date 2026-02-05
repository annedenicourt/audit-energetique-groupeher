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
 }
 
 export interface HabitationData {
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
 }
 
 export interface FacturesData {
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
   
   // Répartition facture
   montantChauffage: string;
   montantECS: string;
   montantElecDomestique: string;
   
   // Énergie actuelle
   energieActuelle: string;
   
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
   
   // Dimensionnement thermique
   puissanceThermique: string;
   
   // Dimensionnement solaire
   consommationElecAnnuelle: string;
   puissancePVRecommandee: string;
   productionPVEstimee: string;
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
   resteACharger: string;
   economiesSur10Ans: string;
   gainSur10Ans: string;
 }
 
 export interface FinancementData {
   // Écofinancement
   mensualiteConfort: string;
   economiesMoyennesMensuelles: string;
   mensualiteMoinsEconomies: string;
   
   // Projection
   factureAujourdhui: string;
   facture5Ans: string;
   facture10Ans: string;
   
   // Après travaux
   factureApresTravaux: string;
   consommation10AnsSansTravaux: string;
   consommation10AnsApresTravaux: string;
   economiesRealisees10Ans: string;
   economiesAnnuellesMoyennes: string;
   economiesMensuellesMoyennes: string;
 }
 
 export interface FormData {
   client: ClientData;
   habitation: HabitationData;
   factures: FacturesData;
   bilan: BilanData;
   scenarios: ScenariosData;
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
   },
   habitation: {
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
   },
   factures: {
     factureElecAnnuelle: "",
     factureElecMensuelle: "",
     factureEnergieAnnuelle: "",
     factureEnergieMensuelle: "",
     travauxRealises: "",
     montantTravaux: "",
     aidesMaPrimeRenov: "",
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
     montantChauffage: "",
     montantECS: "",
     montantElecDomestique: "",
     energieActuelle: "",
     notes: "",
   },
   scenarios: {
     scenario1: { nom: "", economieAnnuelle: "", plusValueLogement: "", factureApres: "", lettreApres: "" },
     scenario2: { nom: "", economieAnnuelle: "", plusValueLogement: "", factureApres: "", lettreApres: "" },
     scenario3: { nom: "", economieAnnuelle: "", plusValueLogement: "", factureApres: "", lettreApres: "" },
     puissanceThermique: "",
     consommationElecAnnuelle: "",
     puissancePVRecommandee: "",
     productionPVEstimee: "",
   },
   aides: {
     nbrePersonnesFoyer: "",
     dernierRFR: "",
     categorieRevenus: "",
     coutTotalInstallation: "",
     primeCEE: "",
     maPrimeRenov: "",
     resteACharger: "",
     economiesSur10Ans: "",
     gainSur10Ans: "",
   },
   financement: {
     mensualiteConfort: "",
     economiesMoyennesMensuelles: "",
     mensualiteMoinsEconomies: "",
     factureAujourdhui: "",
     facture5Ans: "",
     facture10Ans: "",
     factureApresTravaux: "",
     consommation10AnsSansTravaux: "",
     consommation10AnsApresTravaux: "",
     economiesRealisees10Ans: "",
     economiesAnnuellesMoyennes: "",
     economiesMensuellesMoyennes: "",
   },
 };