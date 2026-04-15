import { PDFDocument } from "pdf-lib";
import type { SignableDocumentConfig } from "@/types/signableDocuments";
import { DossierFormData } from "@/types/dossierFormData";
import { PdfFieldData } from "./buildPdfFieldData";

export type GenerateSignedPdfResult =
  | { success: true; pdfBytes: Uint8Array }
  | { success: false; error: string };

/**
 * Génère un PDF signé à partir d'un template, d'une signature et d'un mapping de données.
 *
 * Gère proprement les cas où le document n'est pas encore configuré :
 * - pdfPath manquant → erreur claire
 * - signaturePosition manquante → erreur claire
 * - pdfFieldMapping vide → les champs ne sont pas remplis (pas d'erreur)
 */
export async function generateSignedPdf(
  config: SignableDocumentConfig,
  signatureDataUrl: string,
  fieldData?: PdfFieldData,
  commercialSignatureUrl?: string,
): Promise<GenerateSignedPdfResult> {
  try {
    // Vérifications préalables
    if (!config.pdfPath) {
      return { success: false, error: `Document "${config.label}" : chemin PDF non configuré.` };
    }
    if (!config.signaturePosition) {
      return { success: false, error: `Document "${config.label}" : position de signature non configurée.` };
    }

    // Fetch du template PDF
    const pdfResponse = await fetch(config.pdfPath);
    if (!pdfResponse.ok) {
      return { success: false, error: `Impossible de charger le PDF : ${config.pdfPath} (${pdfResponse.status})` };
    }
    const pdfArrayBuffer = await pdfResponse.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

    // Embed de la signature client PNG
    const signatureImageBytes = await fetch(signatureDataUrl).then((r) => r.arrayBuffer());
    const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

    // Placement de la signature client
    const { pageIndex, x, y, width, height } = config.signaturePosition;
    const pages = pdfDoc.getPages();
    if (pageIndex >= pages.length) {
      return {
        success: false,
        error: `Page ${pageIndex} introuvable dans le PDF (${pages.length} pages).`,
      };
    }
    const page = pages[pageIndex];
    page.drawImage(signatureImage, { x, y, width, height });

    // Signature commerciale
    if (commercialSignatureUrl && config.commercialSignaturePosition) {
      // Embed de la signature commercial PNG
      const commercialSignatureBytes = await fetch(commercialSignatureUrl).then((r) => r.arrayBuffer());
      const commercialSignatureImage = await pdfDoc.embedPng(commercialSignatureBytes);
      // Placement de la signature commercial
      const { pageIndex:commercialPageIndex, x: commercialX, y: commercialY, width: commercialWidth, height: commercialHeight } = config.commercialSignaturePosition;
      const pages = pdfDoc.getPages();
      if (commercialPageIndex >= pages.length) {
        return {
          success: false,
          error: `Page ${commercialPageIndex} introuvable dans le PDF (${pages.length} pages).`,
        };
      }
      const page = pages[commercialPageIndex];
      page.drawImage(commercialSignatureImage, { x: commercialX, y:commercialY, width:commercialWidth, height:commercialHeight });
    }

    // Remplissage des champs PDF si mapping fourni
    if (config.pdfFieldMapping && fieldData) {
      const form = pdfDoc.getForm();
      for (const [pdfFieldName, dataKey] of Object.entries(config.pdfFieldMapping)) {
        const value = fieldData[dataKey as keyof DossierFormData];
        if (value !== undefined && value !== null) {
          try {
            const field = form.getTextField(pdfFieldName);
            field.setText(String(value));
          } catch {
            console.warn(`Champ PDF "${pdfFieldName}" introuvable, ignoré.`);
          }
        }
      }
    }

    const pdfBytes = await pdfDoc.save();
    return { success: true, pdfBytes };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Erreur lors de la génération du PDF signé : ${message}` };
  }
}

/**
 * Télécharge un PDF signé dans le navigateur.
 */
export function downloadPdfBytes(pdfBytes: Uint8Array, filename: string): void {
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
