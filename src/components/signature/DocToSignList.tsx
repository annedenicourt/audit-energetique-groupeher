import { useCallback, useState } from "react";
import { PenTool, FolderOpen, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SIGNABLE_DOCUMENTS, SignableDocumentConfig, SignableDocumentId } from "@/types/signableDocuments";
import SignatureFlow from "../signature/SignatureFlow";
import { useAuth } from "@/contexts/AuthContext";
import { getSignaturePublicUrl } from "@/utils/saveUserSignature";
import { defaultDossierFormData, DossierFormData } from "@/types/dossierFormData";
import { buildPdfFieldData } from "@/utils/pdf/buildPdfFieldData";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";


const DocToSignList = () => {
  const [showSignatureFlow, setShowSignatureFlow] = useState<boolean>(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<SignableDocumentId>();
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>("");
  const [signatureVersion, setSignatureVersion] = useState(0);
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [previewPath, setPreviewPath] = useState<string>("");
  const { profile } = useAuth()

  const signatureCommercialUrl = profile?.signature_path
    ? `${getSignaturePublicUrl(profile.signature_path)}?t=${signatureVersion}`
    : "";

  const [formDossier, setForm] = useState<DossierFormData>(() => {
    try {
      const stored = localStorage.getItem("dossier_form");
      if (stored) return { ...defaultDossierFormData, ...JSON.parse(stored) };
    } catch { /* ignore */ }
    return { ...defaultDossierFormData };
  });


  const handleSignatureComplete = useCallback((signedDocId: SignableDocumentId) => {
    setShowSignatureFlow(false);
  }, []);

  const listDocuments = SIGNABLE_DOCUMENTS.filter(
    (doc) => doc.enabled && (doc.context === "bibliotheque")
  );

  const handleOpenSignatureFlow = (doc: SignableDocumentConfig) => {
    setSelectedDocumentId(doc.id);
    setShowSignatureFlow(true)
  };

  const handlePreview = (doc: SignableDocumentConfig) => {
    setOpenPreview(true)
    setPreviewPath(doc.pdfPath)
  };

  return (
    <div className="h-[100vh] space-y-6 p-4 md:p-6 overflow-y-auto">
      <div className="space-y-2">
        <h1 className="text-lg font-bold tracking-tight">Bibliothèque de documents</h1>
        <p className="text-xs text-muted-foreground">
          Retrouvez les documents à remplir, faire signer ou télécharger selon le
          contexte commercial.
        </p>
      </div>

      {listDocuments.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-3 p-6 text-center">
            <FolderOpen className="h-10 w-10 text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium">Aucun document trouvé</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-1">
          {listDocuments.map((doc) => (
            <Card key={doc.id} className="rounded-2xl border">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div>
                      <CardTitle className="text-sm leading-snug">{doc.label}</CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {doc.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(doc)}
                    className="flex items-center gap-2 text-xs hover:bg-orange-500"
                  >
                    <Eye className="h-4 w-4" />
                    Voir / Télécharger
                  </Button>
                  <Dialog open={openPreview} onOpenChange={(value) => !value && setOpenPreview(false)}>
                    <DialogContent className="w-[95vw] max-w-5xl">
                      <DialogHeader>
                        <DialogTitle>Aperçu</DialogTitle>
                        <DialogDescription></DialogDescription>
                      </DialogHeader>

                      <div className="border border-input rounded-md bg-background min-h-[70vh] overflow-hidden">
                        <iframe
                          //src={`${previewPath}#toolbar=0&navpanes=0&scrollbar=0`}
                          src={`${previewPath}#&navpanes=0&scrollbar=0`}
                          className="w-full h-[70vh] border-0"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  {doc.signTarget !== "aucune" && (
                    <Button
                      size="sm"
                      onClick={() => handleOpenSignatureFlow(doc)}
                      className="flex items-center gap-2 text-xs"
                    >
                      <PenTool className="h-4 w-4" />
                      Remplir et signer
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Flow de signature manuscrite */}
      <SignatureFlow
        open={showSignatureFlow}
        onClose={() => {
          setShowSignatureFlow(false);
          setSelectedDocumentId(null);
        }}
        onComplete={handleSignatureComplete}
        selectedDocumentId={selectedDocumentId}
        signatureDataUrl={signatureDataUrl}
        setSignatureDataUrl={setSignatureDataUrl}
        commercialSignatureUrl={signatureCommercialUrl}
        fieldData={buildPdfFieldData(formDossier)}
      />
    </div>
  );
};

export default DocToSignList;