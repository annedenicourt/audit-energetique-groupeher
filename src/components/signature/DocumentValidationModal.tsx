import React, { useState, useCallback, useEffect } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { SignableDocumentConfig, SignableDocumentId } from "@/types/signableDocuments";
import { generateSignedPdf, downloadPdfBytes } from "@/utils/pdf/generateSignedPdf";
import { PdfFieldData } from "@/utils/pdf/buildPdfFieldData";

interface DocumentValidationModalProps {
  open: boolean;
  onClose: () => void;
  signatureDataUrl: string;
  commercialSignatureUrl?: string;
  document: SignableDocumentConfig | null;
  fieldData?: PdfFieldData;
  onComplete: (signedDocId: SignableDocumentId) => void;
}

const DocumentValidationModal: React.FC<DocumentValidationModalProps> = ({
  open,
  onClose,
  signatureDataUrl,
  commercialSignatureUrl,
  document,
  fieldData,
  onComplete,
}) => {
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string>("");
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (!open || !document || !signatureDataUrl) {
      setLoadingPreview(false);
      setDownloading(false);
      setError("");
      setPdfBytes(null);
      setPreviewUrl("");
      return;
    }

    let objectUrl = "";

    const buildPreview = async () => {
      setLoadingPreview(true);
      setError("");
      setPdfBytes(null);
      setPreviewUrl("");

      const result = await generateSignedPdf(document, signatureDataUrl, fieldData, commercialSignatureUrl);
      if (result.success === true) {
        const pdfBytes = new Uint8Array(result.pdfBytes);
        setPdfBytes(pdfBytes);
        const blob = new Blob([pdfBytes.buffer], { type: "application/pdf" });
        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
      } else if (result.success === false) {
        setError(result.error);
      }

      setLoadingPreview(false);
    };

    buildPreview();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };

  }, [open, document, signatureDataUrl, fieldData])

  const handleConfirm = useCallback(async () => {
    if (!document || !pdfBytes) return;

    try {
      setDownloading(true);
      downloadPdfBytes(pdfBytes, `${document.id}_signe.pdf`);
      onComplete(document.id);
    } finally {
      setDownloading(false);
    }
  }, [document, pdfBytes, onComplete]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[95vw] max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            Validation du document
            {document ? ` — ${document.label}` : ""}
          </DialogTitle>
        </DialogHeader>

        {/* Aperçu signature */}
        <div className="flex items-center gap-3 p-3 border border-input rounded-md bg-muted/30">
          <span className="text-sm font-medium text-muted-foreground">Signature :</span>
          <img
            src={signatureDataUrl}
            alt="Signature du client"
            className="h-10 object-contain"
          />
        </div>
        {/* {commercialSignatureUrl && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Signature commercial :</span>
            <img
              src={commercialSignatureUrl}
              alt="Signature du commercial"
              className="h-10 object-contain"
            />
          </div>
        )} */}

        <div className="border border-input rounded-md bg-background min-h-[600px] overflow-hidden">
          {loadingPreview && (
            <div className="flex items-center justify-center h-[600px] text-sm text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Génération de l’aperçu...
            </div>
          )}

          {!loadingPreview && error && (
            <div className="flex items-center justify-center h-[600px] px-6 text-sm text-destructive gap-2 text-center">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loadingPreview && !error && previewUrl && (
            <iframe
              src={previewUrl}
              title="Aperçu du PDF signé"
              className="w-full h-[600px]"
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!pdfBytes || loadingPreview || downloading}
          >
            {downloading ? "Téléchargement..." : "Valider et télécharger"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentValidationModal;
