import { useMemo } from "react";
import { DossierFormData } from "@/types/dossierFormData";

/**
 * Configuration d'un groupe de checkboxes requis.
 * Pour ajouter un nouveau groupe, il suffit d'ajouter une entrée ici.
 */
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

export interface DossierGroupErrors {
  [groupKey: string]: boolean; // true = erreur (aucune case cochée)
}

export function useDossierValidation(formDossier: DossierFormData) {
  const { groupErrors, isStepDossierValid } = useMemo(() => {
    const errors: DossierGroupErrors = {};

    for (const group of REQUIRED_GROUPS) {
      const hasAtLeastOne = group.fields.some(
        (field) => formDossier[field] === true
      );
      errors[group.key] = !hasAtLeastOne;
    }

    const isValid = Object.values(errors).every((hasError) => !hasError);

    return { groupErrors: errors, isStepDossierValid: isValid };
  }, [formDossier]);

  return { groupErrors, isStepDossierValid };
}
