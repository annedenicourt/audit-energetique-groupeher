// Définition des étapes du formulaire
export const STEPS = [
  { id: 1, label: "Fiche Découverte", shortLabel: "Client" },
  { id: 2, label: "Bilan Énergétique", shortLabel: "Bilan" },
  { id: 3, label: "Evolution de la facture énergétique", shortLabel: "Evolution" },
  { id: 4, label: "Scénarios", shortLabel: "Scénarios" },
  { id: 5, label: "Dimensionnement", shortLabel: "Dimensionnement" },
  { id: 6, label: "Projection", shortLabel: "Projection" },
  { id: 7, label: "Aides", shortLabel: "Aides" },
  { id: 8, label: "Financement", shortLabel: "Financement" },
  { id: 9, label: "Synthèse", shortLabel: "Synthèse" },
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