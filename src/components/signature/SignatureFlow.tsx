import { useState, useEffect, useCallback, useMemo } from "react";
import SignaturePadModal from "./SignaturePadModal";
import DocumentValidationModal from "./DocumentValidationModal";
import { SIGNABLE_DOCUMENTS, type SignableDocumentId } from "@/types/signableDocuments";
import { PdfFieldData } from "@/utils/pdf/buildPdfFieldData";

type FlowStep = "idle" | "capture" | "validation";

interface SignatureFlowProps {
  open: boolean;
  onClose: () => void;
  onComplete: (signedDocId: SignableDocumentId) => void;
  selectedDocumentId: SignableDocumentId | null;
  fieldData?: PdfFieldData;
  signatureDataUrl?: string;
  setSignatureDataUrl?: React.Dispatch<React.SetStateAction<string>>;
  commercialSignatureUrl?: string;
}

const SignatureFlow: React.FC<SignatureFlowProps> = ({ open, onClose, onComplete, fieldData, selectedDocumentId, signatureDataUrl, setSignatureDataUrl, commercialSignatureUrl }) => {
  const [step, setStep] = useState<FlowStep>("idle");

  const selectedDocument = useMemo(() => {
    if (!selectedDocumentId) return null;
    return SIGNABLE_DOCUMENTS.find((doc) => doc.id === selectedDocumentId) ?? null;
  }, [selectedDocumentId]);

  useEffect(() => {
    if (open && selectedDocument) {
      if (!signatureDataUrl) {
        setStep("capture");
      } else {
        setStep("validation"); // déjà signé → direct preview
      }
    } else {
      setStep("idle");
    }
  }, [open, selectedDocument, signatureDataUrl]);

  const handleSignatureConfirm = useCallback((dataUrl: string) => {
    setSignatureDataUrl(dataUrl);
    setStep("validation");
  }, []);

  const handleValidationComplete = useCallback(
    (signedDocId: SignableDocumentId) => {
      onComplete(signedDocId);
      onClose();
    },
    [onComplete, onClose],
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!selectedDocument) return null;

  return (
    <>
      <SignaturePadModal
        open={step === "capture"}
        onClose={handleClose}
        onConfirm={handleSignatureConfirm}
        title="Signature client"
      />

      <DocumentValidationModal
        open={step === "validation"}
        onClose={handleClose}
        signatureDataUrl={signatureDataUrl}
        commercialSignatureUrl={commercialSignatureUrl}
        document={selectedDocument}
        fieldData={fieldData}
        onComplete={handleValidationComplete}
      />
    </>
  );
};

export default SignatureFlow;
