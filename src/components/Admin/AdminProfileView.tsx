import { Activity, Clock, FileText, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import AdminActivityChart from "./AdminActivityChart";
import { useCallback, useEffect, useState } from "react";
import { getSignaturePublicUrl, saveUserSignature } from "@/utils/saveUserSignature";
import { toast } from "../ui/sonner";
import { Button } from "../ui/button";
import SignaturePadModal from "../signature/SignaturePadModal";

interface Study {
  id: string;
  user_id: string;
  client_name: string | null;
  created_at: string;
}

interface Profile {
  id: string;
  display_name: string | null;
  role: string;
  signature_path: string | null;
}

interface Props {
  profiles: Profile[];
}

const AdminProfileView: React.FC<Props> = ({ profiles }) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [myProfile, setMyProfile] = useState(profiles[0] || null);
  const [signatureVersion, setSignatureVersion] = useState(0);

  const signatureUrl = myProfile?.signature_path
    ? `${getSignaturePublicUrl(myProfile.signature_path)}?t=${signatureVersion}`
    : "";

  const handleConfirm = useCallback(async (dataUrl: string) => {
    try {
      setSaving(true);
      const updatedProfile = await saveUserSignature(dataUrl);
      setMyProfile(updatedProfile);
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
        {myProfile?.signature_path ?
          <img src={signatureUrl} className="w-56 border" />
          :
          <div>Pas de signature</div>
        }
        <Button onClick={() => setOpen(true)} disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer ma signature"}
        </Button>

        <SignaturePadModal
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
};
export default AdminProfileView;