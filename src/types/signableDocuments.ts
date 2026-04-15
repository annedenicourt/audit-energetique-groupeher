import { PdfFieldData } from "@/utils/pdf/buildPdfFieldData";

export type DocumentCategory =
  | "juridique"
  | "commercial"
  | "administratif"
  | "parrainage"
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
  | "formulaireAccompagnateur";

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

    pdfPath: "/pdf/mandat_mpr.pdf",
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
      "fait à": "villeFiscale",
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
    tags: ["retractation", "renonciation"],

    pdfPath: "/pdf/formulaire_accompagnateur.pdf",
    signaturePosition: { pageIndex: 0, x: 320, y: 100, width: 200, height: 80 },
    commercialSignaturePosition: { pageIndex: 0, x: 40, y: 100, width: 200, height: 80 },
    pdfFieldMapping: {
      "nom_client": "fullNameClient",
      "date": "date"
    }
  },
];
