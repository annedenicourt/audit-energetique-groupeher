import { useCallback, useState } from "react";
import { PenTool, Download, FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SIGNABLE_DOCUMENTS, SignableDocumentConfig, SignableDocumentId } from "@/types/signableDocuments";
import SignatureFlow from "../signature/SignatureFlow";
import { useAuth } from "@/contexts/AuthContext";
import { getSignaturePublicUrl } from "@/utils/saveUserSignature";
import { defaultDossierFormData, DossierFormData } from "@/types/dossierFormData";
import { buildPdfFieldData } from "@/utils/pdf/buildPdfFieldData";


const DocToSignList = () => {
  const [showSignatureFlow, setShowSignatureFlow] = useState<boolean>(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<SignableDocumentId>();
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>("");
  const [signatureVersion, setSignatureVersion] = useState(0);
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
                  <a href={doc.pdfPath} download title="Télécharger" className="px-2 py-1 flex items-center gap-2 bg-background font-medium text-xs border rounded-md">
                    <Download className="h-4 w-4" />
                  </a>
                  {doc.signTarget !== "aucune" && (
                    <Button
                      size="sm"
                      onClick={() => handleOpenSignatureFlow(doc)}
                      className="flex items-center gap-2 text-xs"
                    >
                      <PenTool className="h-4 w-4" />
                      Signer
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