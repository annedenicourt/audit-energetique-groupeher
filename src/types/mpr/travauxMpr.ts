/**
 * Table des travaux MPR 2026 monogeste – Hors IDF
 * Source : feuille 3 (BARÈME) du xlsx
 *
 * Unité :
 *   FORFAIT  → montant fixe
 *   M2       → €/m²
 *   EQ       → €/équipement
 */
export type UniteTravauxMpr = "FORFAIT" | "M2" | "EQ";

export const TRAVAUX_MPR = {
  "PAC Air/Eau": {
    unite: "FORFAIT" as const,
    plafondEligible: 12000,
    montants: { TRES_MODESTE: 5000, MODESTE: 4000, INTERMEDIAIRE: 3000 },
  },
  "PAC Géothermie / Solarothermie": {
    unite: "FORFAIT" as const,
    plafondEligible: 18000,
    montants: { TRES_MODESTE: 11000, MODESTE: 9000, INTERMEDIAIRE: 6000 },
  },
  "Chauffe-eau thermodynamique (CET)": {
    unite: "FORFAIT" as const,
    plafondEligible: 3500,
    montants: { TRES_MODESTE: 1200, MODESTE: 800, INTERMEDIAIRE: 400 },
  },
  "Chauffe-eau solaire individuel (CESI)": {
    unite: "FORFAIT" as const,
    plafondEligible: 7000,
    montants: { TRES_MODESTE: 4000, MODESTE: 3000, INTERMEDIAIRE: 2000 },
  },
  "Chauffage solaire combiné": {
    unite: "FORFAIT" as const,
    plafondEligible: 16000,
    montants: { TRES_MODESTE: 10000, MODESTE: 8000, INTERMEDIAIRE: 4000 },
  },
  "PVT eau chaude (PVT eau thermique)": {
    unite: "FORFAIT" as const,
    plafondEligible: 4000,
    montants: { TRES_MODESTE: 2500, MODESTE: 2000, INTERMEDIAIRE: 1000 },
  },
  "Poêle à bûches": {
    unite: "FORFAIT" as const,
    plafondEligible: 4000,
    montants: { TRES_MODESTE: 1250, MODESTE: 1000, INTERMEDIAIRE: 500 },
  },
  "Poêle à granulés": {
    unite: "FORFAIT" as const,
    plafondEligible: 5000,
    montants: { TRES_MODESTE: 1250, MODESTE: 1000, INTERMEDIAIRE: 750 },
  },
  "Insert / Foyer fermé": {
    unite: "FORFAIT" as const,
    plafondEligible: 4000,
    montants: { TRES_MODESTE: 1250, MODESTE: 750, INTERMEDIAIRE: 500 },
  },
  "Isolation rampants / plafonds combles": {
    unite: "M2" as const,
    plafondEligible: 75,
    montants: { TRES_MODESTE: 25, MODESTE: 20, INTERMEDIAIRE: 15 },
  },
  "Isolation combles perdus": {
    unite: "M2" as const,
    plafondEligible: 75,
    montants: { TRES_MODESTE: 25, MODESTE: 20, INTERMEDIAIRE: 15 },
    condition: "Non éligible MPR",
  },
  "Isolation toiture terrasse": {
    unite: "M2" as const,
    plafondEligible: 180,
    montants: { TRES_MODESTE: 75, MODESTE: 60, INTERMEDIAIRE: 40 },
  },
  "Fenêtres simple vitrage → performant": {
    unite: "EQ" as const,
    plafondEligible: 1000,
    montants: { TRES_MODESTE: 100, MODESTE: 80, INTERMEDIAIRE: 40 },
  },
  "Raccordement réseau de chaleur": {
    unite: "FORFAIT" as const,
    plafondEligible: 1800,
    montants: { TRES_MODESTE: 1200, MODESTE: 800, INTERMEDIAIRE: 400 },
  },
  "Dépose cuve fioul": {
    unite: "FORFAIT" as const,
    plafondEligible: 4000,
    montants: { TRES_MODESTE: 1200, MODESTE: 800, INTERMEDIAIRE: 400 },
  },
  "VMC double flux": {
    unite: "FORFAIT" as const,
    plafondEligible: 6000,
    montants: { TRES_MODESTE: 2500, MODESTE: 2000, INTERMEDIAIRE: 1500 },
    condition: "Conditionné à 1 geste d'isolation thermique (menuiserie , sous-rampant)",
  },
  "Audit énergétique (hors obligation)": {
    unite: "FORFAIT" as const,
    plafondEligible: 800,
    montants: { TRES_MODESTE: 500, MODESTE: 400, INTERMEDIAIRE: 300 },
  },
} as const;
