import { ScenarioData } from "@/types/formData";

export interface MissingField {
  step: number;
  stepLabel: string;
  fieldKey: string;
  fieldLabel: string;
}

const REQUIRED_FIELDS: { step: number; stepLabel: string; fields: { key: string; path: string; label: string }[] }[] = [
  {
    step: 2,
    stepLabel: "Client",
    fields: [
      { key: "accompagnateur", path: "client.accompagnateur", label: "Accompagnateur" },
      { key: "nom", path: "client.nom", label: "Nom" },
      { key: "telephone", path: "client.telephone", label: "Téléphone" },
      { key: "adresseFiscale", path: "client.adresseFiscale", label: "Adresse fiscale" },
      { key: "codePostalFiscal", path: "client.codePostalFiscal", label: "Code postal fiscal" },
      { key: "villeFiscale", path: "client.villeFiscale", label: "Ville fiscale" },
      { key: "adresse", path: "client.adresse", label: "Adresse" },
      { key: "codePostal", path: "client.codePostal", label: "Code postal" },
      { key: "ville", path: "client.ville", label: "Ville" },
      { key: "anneeConstruction", path: "client.anneeConstruction", label: "Année de construction" },
      { key: "surfaceHabitable", path: "client.surfaceHabitable", label: "Surface habitable" },
      { key: "aidesMaPrimeRenov", path: "client.aidesMaPrimeRenov", label: "Aides MaPrimeRénov" },
    ],
  },
  {
    step: 4,
    stepLabel: "Évolution Énergie",
    fields: [
      { key: "coutNrjAujourdhui", path: "evolution.coutNrjAujourdhui", label: "Coût Énergie aujourd'hui" },
    ],
  },
  {
  step: 5,
  stepLabel: "Scénarios",
  fields: [
    { key: "scenarios", path: "scenarios", label: "Renseigner au moins un scénario" }
  ],
  },
  {
  step: 6,
  stepLabel: "Dimensionnement",
  fields: [
    {
      key: "selectedSections",
      path: "dimensionnement.selectedSections",
      label: "Au moins un produit sélectionné"
    }
  ],
},
  {
    step: 7,
    stepLabel: "Exponentiel",
    fields: [
      { key: "factureAujourdhui", path: "exponentiel.factureAujourdhui", label: "Facture aujourd'hui" },
    ],
  },
  {
    step: 8,
    stepLabel: "Aides",
    fields: [
      { key: "coutTotalInstallation", path: "aides.coutTotalInstallation", label: "Coût total installation" },
      { key: "primeCEE", path: "aides.primeCEE", label: "Prime CEE" },
      { key: "maPrimeRenov", path: "aides.maPrimeRenov", label: "MaPrimeRénov" },
    ],
  }
];

const getValue = (obj, path: string) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

const hasAtLeastOneScenario = (scenarios): boolean => {
  if (!scenarios || typeof scenarios !== "object") return false;

  return Object.values(scenarios).some((scenario: ScenarioData) =>
    scenario &&
    (scenario.nom !== "" ||
      scenario.lettreApres !== "" ||
      scenario.economieAnnuelle !== "")
  );
};

export const validateSimulationForm = (): MissingField[] => {
  const stored = localStorage.getItem("simulation_form");

  let data = {};
  try {
    data = stored ? JSON.parse(stored) : {};
  } catch {
    data = {};
  }

  return REQUIRED_FIELDS.flatMap(section =>
    section.fields
      .filter(field => {
        const val = getValue(data, field.path);

        // cas spécial scenarios
        if (field.key === "scenarios") {
          return !hasAtLeastOneScenario(val);
        }

        return val === undefined || val === null || val === "";
      })
      .map(field => ({
        step: section.step,
        stepLabel: section.stepLabel,
        fieldKey: field.key,
        fieldLabel: field.label
      }))
  );
};