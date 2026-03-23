import { useMemo } from "react";
import { DossierFormData } from "@/types/dossierFormData";
import { FormData } from "@/types/formData";

// ── Groupes de checkboxes (au moins une cochée) ──

interface RequiredGroup {
  key: string;
  label: string;
  fields: (keyof DossierFormData)[];
  message: string;
}

export const REQUIRED_GROUPS: RequiredGroup[] = [
  {
    key: "reglement",
    label: "Règlement",
    fields: ["reglementCheque", "reglementFinancement", "reglementPTZ"],
    message: "Veuillez sélectionner au moins un mode de règlement.",
  },
  {
    key: "dossierPrime",
    label: "Dossier de prime",
    fields: ["proprietaireOccupant", "proprietaireBailleur", "residSecondaire", "sci"],
    message: "Veuillez sélectionner au moins un statut de propriétaire.",
  },
];

// ── Champs individuels conditionnels ──

export interface ConditionalField {
  key: keyof DossierFormData;
  label: string;
  isRequired: (form: DossierFormData, simul: FormData | null) => boolean;
}

const isMprNotEmpty = (form: DossierFormData) => {
  const v = form.montantPrimeRenov;
  return v !== "" && v !== null && v !== undefined;
};

const isMprNotEmptyAndNotZero = (form: DossierFormData) => {
  return isMprNotEmpty(form) && form.montantPrimeRenov !== "0" && Number(form.montantPrimeRenov) !== 0;
};

export const CONDITIONAL_FIELDS: ConditionalField[] = [
  { key: "devisNonSigne", label: "Devis non signé", isRequired: () => true },
  { key: "devisSigne", label: "Devis signé", isRequired: () => true },
  { key: "carteIdentite", label: "Carte d'identité", isRequired: () => true },
  {
    key: "deuxDerniersAvisImpots",
    label: "2 derniers avis d'impôts",
    isRequired: (form) => isMprNotEmptyAndNotZero(form),
  },
  {
    key: "taxeFonciereActeNotarie",
    label: "Taxe foncière / acte notarié",
    isRequired: (form) => isMprNotEmpty(form),
  },
  {
    key: "mandatMaPrimeRenov",
    label: "Mandat MaPrimeRénov'",
    isRequired: (form) => isMprNotEmpty(form),
  },
  {
    key: "rib",
    label: "RIB",
    isRequired: (form) => isMprNotEmpty(form),
  },
  {
    key: "attestationProprietaireBailleur",
    label: "Attestation propriétaire bailleur",
    isRequired: (form) => form.proprietaireBailleur === true && isMprNotEmpty(form),
  },
  {
    key: "attestationFioul",
    label: "Attestation fioul",
    isRequired: (_form, simul) => simul?.client?.typeChauffage === "fioul",
  },
  {
    key: "noteDimensionnement",
    label: "Note de dimensionnement",
    isRequired: (_form, simul) => simul?.dimensionnement?.selectedSections?.pacAirEau === true,
  },
  {
    key: "revolt",
    label: "Revolt",
    isRequired: (_form, simul) => simul?.dimensionnement?.selectedSections?.photovoltaique === true,
  },
  {
    key: "pouvoir",
    label: "Pouvoir",
    isRequired: (_form, simul) =>
      simul?.dimensionnement?.selectedSections?.photovoltaique === true ||
      simul?.dimensionnement?.selectedSections?.ssc === true,
  },
];

// ── Types de retour ──

export interface DossierGroupErrors {
  [groupKey: string]: boolean; // true = erreur
}

export interface DossierFieldErrors {
  [fieldKey: string]: boolean; // true = erreur
}

// ── Hook ──

export function useDossierValidation(
  formDossier: DossierFormData,
  simulData?: FormData | null
) {
  const { groupErrors, fieldErrors, isStepDossierValid } = useMemo(() => {
    // Groupes
    const gErrors: DossierGroupErrors = {};
    for (const group of REQUIRED_GROUPS) {
      const hasAtLeastOne = group.fields.some((f) => formDossier[f] === true);
      gErrors[group.key] = !hasAtLeastOne;
    }

    // Champs conditionnels
    const fErrors: DossierFieldErrors = {};
    for (const cf of CONDITIONAL_FIELDS) {
      if (cf.isRequired(formDossier, simulData ?? null)) {
        fErrors[cf.key] = formDossier[cf.key] !== true;
      }
    }

    const groupsValid = Object.values(gErrors).every((e) => !e);
    const fieldsValid = Object.values(fErrors).every((e) => !e);

    return {
      groupErrors: gErrors,
      fieldErrors: fErrors,
      isStepDossierValid: groupsValid && fieldsValid,
    };
  }, [formDossier, simulData]);

  return { groupErrors, fieldErrors, isStepDossierValid };
}
