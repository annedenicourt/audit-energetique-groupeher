import { PdfFieldData } from "@/utils/pdf/buildPdfFieldData";

export type DocumentCategory =
  | "juridique"
  | "commercial"
  | "administratif"
  | "remise"
  | "technique";

export type DocumentContext = "dossier" | "bibliotheque" | "both";

export type SignTarget = "client" | "commercial" | "client_et_commercial" | "aucune";

export type SignableDocumentId =
  | "devisSigne"
  | "mandatMaPrimeRenov"
  | "attestationIndivisionnaire"
  | "attestationProprietaireBailleur"
  | "attestationFioul"
  | "pouvoir"
  | "attestationRenonciation"
  | "formulaireAccompagnateur"
  | "formulaireAmbassadeur"
  | "formulairePanneauChantier"
  | "formulaireParrainage"
  | "formulaireRegroupement"
  | "formulaireAchatGroupe";

export type SignaturePosition = {
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CommercialSignaturePosition = {
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SignableDocumentConfig = {
  id: SignableDocumentId;
  label: string;
  pdfPath?: string;
  signaturePosition?: SignaturePosition;
  commercialSignaturePosition?: CommercialSignaturePosition;
  pdfFieldMapping?: Record<string, keyof PdfFieldData>;

  enabled?: boolean;
  description?: string;
  category?: DocumentCategory;
  context?: DocumentContext;
  signTarget?: SignTarget;
  prefilled?: boolean;
  tags?: string[];
};

export const SIGNABLE_DOCUMENTS: SignableDocumentConfig[] = [
  {
    id: "mandatMaPrimeRenov",
    label: "Mandat MaPrimeRénov",
    description: "Mandat à faire signer au client, prérempli avec les données du dossier.",
    category: "administratif",
    context: "both",
    signTarget: "client",
    prefilled: true,
    enabled: true,
    tags: ["MPR", "mandat"],

    pdfPath: "/pdf/mandat_mpr_prerempli.pdf",
    signaturePosition: { pageIndex: 1, x: 10, y: 70, width: 180, height: 60 },
    pdfFieldMapping: {
      "Nom": "nomClient",
      "Prénom": "prenomClient",
      "Adresse postale du logement à rénover": "adresseInstallation",
      "Code postal du logement à rénover": "codePostal",
      "Commune du logement à rénover": "ville",
      "Téléphone mobile ou fixe": "telephone",
      "Nom et Prénom du demandeur": "fullNameClient",
      "Fait à": "villeFiscale",
      "le, jour": "currentDay",
      "mois": "currentMonth",
      "année": "currentYear",
    }
  },
  {
    id: "attestationIndivisionnaire",
    label: "Attestation indivisionnaire MPR",
    description: "Attestation à faire signer dans certains cas spécifiques MPR.",
    category: "juridique",
    context: "both",
    signTarget: "client",
    prefilled: true,
    enabled: true,
    tags: ["MPR", "indivision"],

    pdfPath: "/pdf/attestation_indivision.pdf",
    signaturePosition: { pageIndex: 0, x: 350, y: 60, width: 150, height: 60 },
    pdfFieldMapping: {
      "nom, prénom et date de naissance": "fullNameClient",
      "lieu de résidence principale": "fullAdresseFiscale",
      "lieu": "villeFiscale",
      "date": "date",
      "Nom, prénom": "fullNameClient"
    }
  },
  {
    id: "attestationProprietaireBailleur",
    label: "Attestation propriétaire bailleur MPR",
    description: "Attestation à faire signer dans le cadre d’un dossier bailleur.",
    category: "juridique",
    context: "both",
    signTarget: "client",
    prefilled: true,
    enabled: true,
    tags: ["MPR", "bailleur"],

    pdfPath: "/pdf/attestation_bailleur.pdf",
    signaturePosition: { pageIndex: 0, x: 20, y: 20, width: 200, height: 80 },
    pdfFieldMapping: {
      "Nom et prénom": "fullNameClient",
      "Prénom": "prenomClient",
      "l’adresse complète avec le numéro de l’appartement le cas échéant)": "fullAdresseInstallation",
      "Fait à": "villeFiscale",
      "Date": "date"
    }
  },
  {
    id: "attestationFioul",
    label: "Attestation fioul",
    description: "Attestation liée au remplacement d’un système fioul, à faire signer par le client.",
    category: "juridique",
    context: "both",
    signTarget: "client",
    prefilled: true,
    enabled: true,
    tags: ["fioul", "MPR"],

    pdfPath: "/pdf/attestation_fioul.pdf",
    signaturePosition: { pageIndex: 0, x: 20, y: 70, width: 300, height: 100 },
    commercialSignaturePosition: { pageIndex: 0, x: 320, y: 80, width: 200, height: 80 },
    pdfFieldMapping: {
      "nomClient": "fullNameClient",
      "adresse": "fullAdresseFiscale",
      "fait à": "villeFiscale",
      "date": "date"
    }
  },
  {
    id: "pouvoir",
    label: "Pouvoir",
    description: "Pouvoir à faire signer pour certaines démarches mairie / Enedis.",
    category: "administratif",
    context: "both",
    signTarget: "client",
    prefilled: true,
    enabled: true,
    tags: ["mairie", "enedis"],

    pdfPath: "/pdf/pouvoir_mairie_enedis.pdf",
    signaturePosition: { pageIndex: 0, x: 0, y: 70, width: 200, height: 80 },
    pdfFieldMapping: {
      "nomClient": "fullNameClient",
      "adresse": "fullAdresseFiscale",
      "fait à": "villeFiscale",
      "date": "date"
    }
  },
  {
    id: "attestationRenonciation",
    label: "Attestation de renonciation au délai de rétractation",
    description: "Document attestant l'accord du client à renoncer au délai légal de 14 jours",
    category: "juridique",
    context: "bibliotheque",
    signTarget: "client",
    prefilled: true,
    enabled: true,
    tags: ["retractation", "renonciation"],

    pdfPath: "/pdf/attestation_renonciation.pdf",
    signaturePosition: { pageIndex: 0, x: 320, y: 30, width: 200, height: 80 },
    pdfFieldMapping: {
      "nomClient": "fullNameClient",
      "adresse": "adresseInstallation",
      "code postal et ville": "codePostalVille",
      "nom du client": "fullNameClient",
      "ville": "ville",
      "date": "date"
    }
  },
  {
    id: "formulaireAccompagnateur",
    label: "Formulaire accompagnateur",
    description: "Charte de convention pour encadrer l'accompagnement",
    category: "juridique",
    context: "bibliotheque",
    signTarget: "client",
    prefilled: true,
    enabled: true,
    tags: ["accompagnement", "protocole"],

    pdfPath: "/pdf/formulaire_accompagnateur.pdf",
    signaturePosition: { pageIndex: 0, x: 320, y: 100, width: 200, height: 80 },
    //commercialSignaturePosition: { pageIndex: 0, x: 40, y: 100, width: 200, height: 80 },
    pdfFieldMapping: {
      "nom_accompagnateur_her": "conseiller",
      "nom_client": "fullNameClient",
      "telephone_client": "telephone",
      "nom_accompagnateur_her 2": "conseiller",
      "date": "date"
    }
  },
  {
    id: "formulaireAmbassadeur",
    label: "Formulaire Ambassadeur HER",
    description: "Formulaire pour devenir ambassadeur HER et obtenir des avantages",
    category: "remise",
    context: "bibliotheque",
    signTarget: "client",
    prefilled: true,
    enabled: true,
    tags: ["reunion", "remise", "ambassadeur"],

    pdfPath: "/pdf/formulaire_reunion_v2.pdf",
    signaturePosition: { pageIndex: 0, x: 380, y: 8, width: 150, height: 60 },
    pdfFieldMapping: {
      "Nom_accompagnateur 1": "conseiller",
      "Nom_hote 1": "fullNameClient",
      "date": "date"
    }
  },
  {
    id: "formulairePanneauChantier",
    label: "Formulaire panneau de chantier",
    description: "Formulaire pour obtenir des avantages en acceptant d'apposer un panneau de chantier",
    category: "remise",
    context: "bibliotheque",
    signTarget: "client",
    prefilled: true,
    enabled: true,
    tags: ["remise", "panneau", "chantier"],

    pdfPath: "/pdf/formulaire_panneau.pdf",
    signaturePosition: { pageIndex: 0, x: 380, y: 55, width: 150, height: 60 },
    pdfFieldMapping: {
      "Nom_client": "fullNameClient",
      "ville": "ville",
      "date": "date"
    }
  },
  {
    id: "formulaireRegroupement",
    label: "Formulaire regroupement de chantier",
    description: "Formulaire pour obtenir des avantages en choisissant une date flexible",
    category: "remise",
    context: "bibliotheque",
    signTarget: "client",
    prefilled: true,
    enabled: true,
    tags: ["flexible", "remise", "regroupement"],

    pdfPath: "/pdf/formulaire_regroupement_chantier.pdf",
    signaturePosition: { pageIndex: 0, x: 380, y: 55, width: 150, height: 60 },
    pdfFieldMapping: {
      "Nom_client": "fullNameClient",
      "ville": "ville",
      "date": "date"
    }
  },
  {
    id: "formulaireAchatGroupe",
    label: "Formulaire achat groupé",
    description: "Formulaire pour obtenir des avantages en choisissant l'achat groupé",
    category: "remise",
    context: "bibliotheque",
    signTarget: "client",
    prefilled: true,
    enabled: true,
    tags: ["remise", "achat", "groupé"],

    pdfPath: "/pdf/formulaire_achats_groupes.pdf",
    signaturePosition: { pageIndex: 0, x: 380, y: 55, width: 150, height: 60 },
    pdfFieldMapping: {
      "Nom_client": "fullNameClient",
      "ville": "ville",
      "date": "date"
    }
  },
  {
    id: "formulaireParrainage",
    label: "Formulaire Parrainage HER",
    description: "Formulaire pour parrainer un proche et gagner des chèques-cadeaux",
    category: "remise",
    context: "bibliotheque",
    signTarget: "aucune",
    prefilled: true,
    enabled: true,
    tags: ["parrainage", "remise"],

    pdfPath: "/pdf/formulaire_parrainage.pdf",
    signaturePosition: { pageIndex: 0, x: 380, y: 8, width: 150, height: 60 },
    pdfFieldMapping: {
      "Nom_accompagnateur 1": "conseiller",
      "Nom_hote 1": "fullNameClient",
      "date": "date"
    }
  },
];
