// Définition des étapes du formulaire
export const STEPS = [
  { id: 1, label: "Présentation", shortLabel: "Présentation" },
  { id: 2, label: "Fiche Découverte", shortLabel: "Client" },
  { id: 3, label: "Bilan Énergétique", shortLabel: "Bilan" },
  { id: 4, label: "Evolution de la facture énergétique", shortLabel: "Evolution" },
  { id: 5, label: "Scénarios", shortLabel: "Scénarios" },
  { id: 6, label: "Dimensionnement", shortLabel: "Dimensionnement" },
  { id: 7, label: "Projection", shortLabel: "Projection" },
  { id: 8, label: "Aides", shortLabel: "Aides" },
  { id: 9, label: "Financement", shortLabel: "Financement" },
  { id: 10, label: "Dossier", shortLabel: "Dossier" },
];

export const situationOptions = [
  { value: "salarie", label: "Salarié(e)" },
  { value: "independant", label: "Indépendant(e)" },
  { value: "retraite", label: "Retraité(e)" },
  { value: "chomage", label: "Demandeur d'emploi" },
  { value: "etudiant", label: "Étudiant(e)" },
  { value: "autre", label: "Autre" },
];
export const typeChauffageOptions = [
  { value: "electrique", label: "Électrique" },
  { value: "gaz", label: "Gaz" },
  { value: "fioul", label: "Fioul" },
  { value: "bois", label: "Bois / Granulés" },
  { value: "pompe_chaleur", label: "Pompe à chaleur" },
  { value: "autre", label: "Autre" },
];

export const typeEauChaudeOptions = [
  { value: "electrique", label: "Électrique (cumulus)" },
  { value: "gaz", label: "Chauffe-eau gaz" },
  { value: "thermodynamique", label: "Thermodynamique" },
  { value: "solaire", label: "Solaire" },
  { value: "chaudiere", label: "Lié à la chaudière" },
  { value: "autre", label: "Autre" },
];

export const typeAerationOptions = [
  { value: "naturelle", label: "Naturelle" },
  { value: "vmc_simple", label: "VMC simple flux" },
  { value: "vmc_double", label: "VMC double flux" },
  { value: "aucune", label: "Aucune" },
];

export const classeOptions = [
  { value: "A", label: "A - Très performant" },
  { value: "B", label: "B - Performant" },
  { value: "C", label: "C - Assez performant" },
  { value: "D", label: "D - Moyennement performant" },
  { value: "E", label: "E - Peu performant" },
  { value: "F", label: "F - Passoire énergétique" },
  { value: "G", label: "G - Passoire énergétique" },
];

export const etatOptions = [
  { value: "bon", label: "Bon état" },
  { value: "moyen", label: "État moyen" },
  { value: "mauvais", label: "Mauvais état" },
  { value: "a_renover", label: "À rénover" },
  { value: "non_existant", label: "Non existant" },
];

export const energieOptions = [
  { value: "electricite", label: "Électricité" },
  { value: "fioul", label: "Fioul" },
  { value: "gaz_ville", label: "Gaz de ville" },
  { value: "propane", label: "Propane" },
  { value: "bois", label: "Bois" },
  { value: "autre", label: "Autre" },
];

export const lettreOptions = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "E", label: "E" },
];

export const categorieOptions = [
  { value: "tres_modestes", label: "Très modestes (bleu)" },
  { value: "modestes", label: "Modestes (jaune)" },
  { value: "intermediaires", label: "Intermédiaires (violet)" },
  { value: "superieurs", label: "Supérieurs (rose)" },
];

export const nbrePersonnesOptions = [
  { value: "1", label: "1 personne" },
  { value: "2", label: "2 personnes" },
  { value: "3", label: "3 personnes" },
  { value: "4", label: "4 personnes" },
  { value: "5", label: "5 personnes" },
  { value: "6", label: "6 personnes ou plus" },
];

// Tableau des plafonds de ressources (à titre indicatif)
export const plafondsData = [
  { personnes: "1", tresModestes: "17 363 €", modestes: "22 259 €", intermediaires: "31 185 €", superieurs: "31 185 €" },
  { personnes: "2", tresModestes: "25 393 €", modestes: "32 553 €", intermediaires: "45 842 €", superieurs: "45 842 €" },
  { personnes: "3", tresModestes: "30 540 €", modestes: "39 148 €", intermediaires: "55 196 €", superieurs: "55 196 €" },
  { personnes: "4", tresModestes: "35 676 €", modestes: "45 735 €", intermediaires: "64 550 €", superieurs: "64 550 €" },
  { personnes: "5", tresModestes: "40 835 €", modestes: "52 348 €", intermediaires: "73 907 €", superieurs: "73 907 €" },
  { personnes: "Par personne supplémentaire", tresModestes: "+ 5 151 €", modestes: "+ 6 598 €", intermediaires: "+ 9 357 €", superieurs: "+ 9 357 €" },
];

export const fenetreTypeOptions = [
  {value:"fenetre", label:"Fenêtre"},
  {value:"portefenetre", label:"Porte-fenêtre"},
];

export const fenetreOuvrantOptions = [
  {value:"fixe", label:"Fixe"},
  {value:"battant", label:"Battante"},
  {value:"coulissante", label:"Coulissante"},
];

export const fenetreMatiereOptions = [
  {value:"pvc", label:"PVC"},
  {value:"alu", label:"Aluminium"},
];