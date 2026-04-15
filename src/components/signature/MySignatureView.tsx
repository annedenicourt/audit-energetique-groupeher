import { useCallback, useEffect, useState } from "react";
import { saveUserSignature } from "@/utils/saveUserSignature";
import { toast } from "../ui/sonner";
import { Button } from "../ui/button";
import SignaturePadModal from "../signature/SignaturePadModal";
import { useAuth } from "@/contexts/AuthContext";

interface SignatureProps {
  signatureUrl?: string;
  setSignatureVersion: React.Dispatch<React.SetStateAction<number>>;
}

const MySignatureView: React.FC<SignatureProps> = ({ signatureUrl, setSignatureVersion }) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { profile } = useAuth()

  const handleConfirm = useCallback(async (dataUrl: string) => {
    try {
      setSaving(true);
      await saveUserSignature(dataUrl);
      setSignatureVersion(Date.now());//pour forcer le render et mettre à jour le preview de la signature
      toast.success("Votre signature a bien été sauvegardée");
      setOpen(false);
    } catch (error) {
      toast.error("Impossible d’enregistrer la signature");
    } finally {
      setSaving(false);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ma signature</h1>
      </div>
      <div className="space-y-3">
        {profile?.signature_path ?
          <img src={signatureUrl} className="w-56 border" />
          :
          <div>Vous n'avez pas encore de signature</div>
        }
        <Button onClick={() => setOpen(true)} disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer ma signature"}
        </Button>

        <SignaturePadModal
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={handleConfirm}
          title={"Ma signature"}
        />
      </div>
    </div>
  );
};
export default MySignatureView;