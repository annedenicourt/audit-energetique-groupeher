export const TYPES_TRAVAUX_MPR = [
  "PAC Air/Eau",
  "PAC Géothermie / Solarothermie",
  "Chauffe-eau thermodynamique (CET)",
  "Chauffe-eau solaire individuel (CESI)",
  "Chauffage solaire combiné",
  "PVT eau chaude (PVT eau thermique)",
  "Poêle à bûches",
  "Poêle à granulés",
  "Insert / Foyer fermé",
  "Isolation rampants / plafonds combles",
  "Isolation toiture terrasse",
  "Fenêtres simple vitrage → performant",
  "Raccordement réseau de chaleur",
  "Dépose cuve fioul",
  "VMC double flux",
  "Audit énergétique (hors obligation)",
] as const;

export type TypeTravauxMpr = (typeof TYPES_TRAVAUX_MPR)[number];
