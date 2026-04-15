import React, { useRef, useCallback } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SignaturePadModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (signatureDataUrl: string) => void;
  title?: string;
}

const SignaturePadModal: React.FC<SignaturePadModalProps> = ({ open, onClose, onConfirm, title }) => {
  const sigRef = useRef<SignatureCanvas | null>(null);

  const handleClear = useCallback(() => {
    sigRef.current?.clear();
  }, []);

  const handleConfirm = useCallback(() => {
    if (!sigRef.current || sigRef.current.isEmpty()) return;
    const dataUrl = sigRef.current.toDataURL("image/png");
    onConfirm(dataUrl);
  }, [onConfirm]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="border border-input rounded-md bg-white touch-none">
          <SignatureCanvas
            ref={sigRef}
            penColor="black"
            canvasProps={{
              className: "w-full h-48 sm:h-56",
              style: { width: "100%", height: "auto", minHeight: "200px" },
            }}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClear}>
            Effacer
          </Button>
          <Button onClick={handleConfirm}>Valider la signature</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignaturePadModal;
