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
    key: "infosRDV",
    label: "Perso, parrainage, lead...",
    fields: ["perso", "parrain", "t1", "t2", "t3", "lead"],
    message: "Veuillez sélectionner au moins une option",
  },
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
  { 
    key: "structure", 
    label: "Structure Maison", 
    fields: ["plainPied", "etages", "sousSol", "videSanitaire"], 
    message: "Veuillez choisir au moins une option", 
  }, 
  { 
    key: "combles", 
    label: "Combles", 
    fields: ["comblePerdu", "combleAmenage"], 
    message: "Veuillez choisir au moins une option", 
  }, 
  { 
    key: "planchers",
    label: "Planchers", 
    fields: ["plancherBois", "plancherPlaco", "plancherHourdis"], 
    message: "Veuillez choisir au moins une option", 
  }, 
  { 
    key: "chauffage", 
    label: "Chauffage", 
    fields: ["chauffageFioul", "chauffageGaz", "chauffageRadiateursElec", "chauffageBois","chauffageAutre"], 
    message: "Veuillez choisir au moins une option", 
  }, 
  {
    key: "dossierFinancement", 
    label: "Dossier de financement", 
    fields: ["justificatifDomicile", "bulletinsSalaires", "bilanEntrepreneur"],
    message: "Veuillez choisir au moins une option", 
  }
];

/* Champs individuels conditionnels */
export interface ConditionalField {
  key: keyof DossierFormData;
  label: string;
  isRequired: (form: DossierFormData, simul: FormData | null) => boolean;
}

const isMprNotEmpty = (form: DossierFormData) => {
  const v = form?.montantPrimeRenov;
  return v !== "" && v !== null && v !== undefined;
};

const isMprNotEmptyAndNotZero = (form: DossierFormData) => {
  return isMprNotEmpty(form) && form?.montantPrimeRenov !== "0" && Number(form?.montantPrimeRenov) !== 0;
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
    isRequired: (form) => isMprNotEmptyAndNotZero(form),
  },
  {
    key: "mandatMaPrimeRenov",
    label: "Mandat MaPrimeRénov'",
    isRequired: (form) => isMprNotEmptyAndNotZero(form),
  },
  {
    key: "rib",
    label: "RIB",
    isRequired: (form) => isMprNotEmptyAndNotZero(form),
  },
  {
    key: "attestationProprietaireBailleur",
    label: "Attestation propriétaire bailleur",
    isRequired: (form) => form?.proprietaireBailleur === true && isMprNotEmptyAndNotZero(form),
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
  {
    key: "photoCompteur",
    label: "Photo compteur",
    isRequired: (_form, simul) =>
      simul?.dimensionnement?.selectedSections?.photovoltaique === true ||
      simul?.dimensionnement?.selectedSections?.ssc === true ||
      simul?.dimensionnement?.selectedSections?.ecsSolaire === true ||
      simul?.dimensionnement?.selectedSections?.vmc === true ||
      simul?.dimensionnement?.selectedSections?.thermodynamique === true ||
      simul?.dimensionnement?.selectedSections?.poele === true ||
      simul?.dimensionnement?.selectedSections?.multiplus === true ||
      simul?.dimensionnement?.selectedSections?.pacAirEau === true ||
      simul?.dimensionnement?.selectedSections?.pacAirAir === true
  },
  {
    key: "photoChaudiere",
    label: "Chaudière à remplacer",
    isRequired: (_form, simul) => simul?.dimensionnement?.selectedSections?.pacAirEau === true,
  },
  {
    key: "photoGroupeExt",
    label: "Emplacement groupe extérieur",
    isRequired: (_form, simul) => simul?.dimensionnement?.selectedSections?.pacAirEau === true,
  },
    { key: "photoMaison", label: "Maison vue de la rue", isRequired: () => true },
  {
    key: "photoCombles",
    label: "Combles",
    isRequired: (_form, simul) => simul?.dimensionnement?.dimensionnementComblesPerdus !== "",
  },
  {
    key: "photoECS",
    label: "Système ECS",
    isRequired: (_form, simul) =>
      simul?.dimensionnement?.selectedSections?.ssc === true ||
      simul?.dimensionnement?.selectedSections?.ecsSolaire === true ||
      simul?.dimensionnement?.selectedSections?.thermodynamique === true ||
      simul?.dimensionnement?.selectedSections?.pacAirEau === true
  },
  {
    key: "photoDisjoncteur",
    label: "Photo disjoncteur",
    isRequired: (_form, simul) =>
      simul?.dimensionnement?.selectedSections?.photovoltaique === true ||
      simul?.dimensionnement?.selectedSections?.ssc === true ||
      simul?.dimensionnement?.selectedSections?.ecsSolaire === true ||
      simul?.dimensionnement?.selectedSections?.vmc === true ||
      simul?.dimensionnement?.selectedSections?.thermodynamique === true ||
      simul?.dimensionnement?.selectedSections?.poele === true ||
      simul?.dimensionnement?.selectedSections?.multiplus === true ||
      simul?.dimensionnement?.selectedSections?.pacAirEau === true ||
      simul?.dimensionnement?.selectedSections?.pacAirAir === true
  },
  {
    key: "photoTuyauterie",
    label: "Tuyauterie chaudière",
    isRequired: (_form, simul) =>
      simul?.dimensionnement?.selectedSections?.ssc === true ||
      simul?.dimensionnement?.selectedSections?.pacAirEau === true
  },
  {
    key: "photoRadiateurs",
    label: "Radiateurs",
    isRequired: (_form, simul) => simul?.dimensionnement?.selectedSections?.pacAirEau === true,
  },
  {
    key: "photoPlafonds",
    label: "Plafonds",
    isRequired: (_form, simul) => simul?.dimensionnement?.dimensionnementRampants !== "",
  },
  {
    key: "photoSousSol",
    label: "Sous-sol",
    isRequired: (_form, simul) => simul?.dimensionnement?.dimensionnementPlancherBas !== "",
  },
  {
    key: "photoTableauElec",
    label: "Tableau électrique",
    isRequired: (_form, simul) =>
      simul?.dimensionnement?.selectedSections?.photovoltaique === true ||
      simul?.dimensionnement?.selectedSections?.ssc === true ||
      simul?.dimensionnement?.selectedSections?.ecsSolaire === true ||
      simul?.dimensionnement?.selectedSections?.vmc === true ||
      simul?.dimensionnement?.selectedSections?.thermodynamique === true ||
      simul?.dimensionnement?.selectedSections?.poele === true ||
      simul?.dimensionnement?.selectedSections?.multiplus === true ||
      simul?.dimensionnement?.selectedSections?.pacAirEau === true ||
      simul?.dimensionnement?.selectedSections?.pacAirAir === true  },
  {
    key: "photoVentilation",
    label: "Ventilation",
    isRequired: (_form, simul) => simul?.dimensionnement?.selectedSections?.vmc === true && simul?.dimensionnement?.dimensionnementVMC==="remplacement",
  },
  {
    key: "photoUniteInt",
    label: "Emplacement unité intérieure",
    isRequired: (_form, simul) => simul?.dimensionnement?.dimensionnementPlancherBas !== "",
  },
  {
    key: "photoFenetres",
    label: "Fenêtres",
    isRequired: (_form, simul) => simul?.dimensionnement?.selectedSections?.ite === true,
  },
  {
    key: "photoFacade",
    label: "Façade",
    isRequired: (_form, simul) => simul?.dimensionnement?.selectedSections?.ite === true,
  },
  {
    key: "photoPorte",
    label: "Porte",
    isRequired: (_form, simul) => simul?.dimensionnement?.selectedSections?.ite === true,
  },
  {
    key: "commentaires",
    label: "Détails dossier & chantier",
    isRequired: (_form, simul) => _form?.commentaires.length <= 15
  },
];
/* Types de retour */
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
    REQUIRED_GROUPS?.forEach((group)=> {
      const hasAtLeastOne = group.fields.some((f) => formDossier?.[f] === true);
      gErrors[group.key] = !hasAtLeastOne;
    })
    

    // Champs conditionnels
    const fErrors: DossierFieldErrors = {};
    CONDITIONAL_FIELDS?.forEach((field)=> {
       if (field.isRequired(formDossier, simulData ?? null)) {
        fErrors[field.key] = formDossier?.[field.key] !== true;
      }
    })

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
