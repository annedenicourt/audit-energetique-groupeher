import { DossierFormData } from "@/types/dossierFormData";

export type PdfFieldData = {
  fullNameClient: string;
  nomClient: string;
  prenomClient: string;
  conseiller: string;
  adresseInstallation: string;
  codePostal: string;
  ville: string;
  fullAdresseInstallation: string;
  fullAdresseFiscale: string;
  codePostalVille: string;
  telephone: string;
  villeFiscale: string;
  currentDay: string;
  currentMonth: string;
  currentYear: string;
  date: string;
};

export const buildPdfFieldData = (formData: DossierFormData): PdfFieldData => {
  const fullName = formData.nomClient ?? "";

  const parts = fullName.trim().split(/\s+/);

  const prenomClient = parts.shift() ?? "";
  const nomClient = parts.join(" ");

  const now = new Date();

  return {
    fullNameClient: fullName,
    nomClient,
    prenomClient,
    conseiller: formData.conseiller,
    adresseInstallation: formData.adresseInstallation ?? "",
    codePostal: formData.codePostal ?? "",
    ville: formData.ville ?? "",
    fullAdresseInstallation: `${formData.adresseInstallation ?? ""} ${formData.codePostal ?? ""} ${formData.ville ?? ""}`.trim(),
    fullAdresseFiscale: `${formData.adresseFiscale ?? ""} ${formData.codePostalFiscal ?? ""} ${formData.villeFiscale ?? ""}`.trim(),
    codePostalVille: `${formData.codePostal ?? ""} ${formData.ville ?? ""}`.trim(),
    telephone: formData.telephone ?? "",
    villeFiscale: formData.villeFiscale ?? "",
    currentDay: String(now.getDate()),
    currentMonth: String(now.getMonth() + 1).padStart(2, "0"),
    currentYear: String(now.getFullYear()),
    date: String(new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" }))
  };
};