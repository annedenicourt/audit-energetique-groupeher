import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, PenTool, Download, Eye, Filter, FolderOpen, User, Users, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SIGNABLE_DOCUMENTS, SignableDocumentConfig, SignableDocumentId } from "@/types/signableDocuments";
import MySignatureView from "../signature/MySignatureView";
import SignatureFlow from "../signature/SignatureFlow";
import { useAuth } from "@/contexts/AuthContext";
import { getSignaturePublicUrl } from "@/utils/saveUserSignature";

type DocumentCategory =
  | "juridique"
  | "commercial"
  | "administratif"
  | "parrainage"
  | "technique";

type SignTarget = "client" | "commercial" | "aucune" | "client_et_commercial";


interface Profile {
  id: string;
  display_name: string | null;
  role: string;
  signature_path: string | null;
}

interface Props {
  profiles: Profile[];
}

const AdminLibraryView = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  //const [contextFilter, setContextFilter] = useState<string>("all");
  //const [signFilter, setSignFilter] = useState<string>("all");
  const [showSignatureFlow, setShowSignatureFlow] = useState<boolean>(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<SignableDocumentId>();
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>("");
  const [signatureVersion, setSignatureVersion] = useState(0);
  const { profile } = useAuth()

  const signatureCommercialUrl = profile?.signature_path
    ? `${getSignaturePublicUrl(profile.signature_path)}?t=${signatureVersion}`
    : "";


  const categoryLabels: Record<DocumentCategory, string> = {
    juridique: "Juridique",
    commercial: "Commercial",
    administratif: "Administratif",
    parrainage: "Parrainage",
    technique: "Technique",
  };

  const getSignLabel = (signTarget: SignTarget) => {
    switch (signTarget) {
      case "client":
        return "Signature client";
      case "commercial":
        return "Signature commercial";
      case "client_et_commercial":
        return "Client + commercial";
      default:
        return "Sans signature";
    }
  }

  const getSignIcon = (signTarget: SignTarget) => {
    switch (signTarget) {
      case "client":
        return <User className="h-4 w-4" />;
      case "commercial":
        return <PenTool className="h-4 w-4" />;
      case "client_et_commercial":
        return <Users className="h-4 w-4" />;
      default:
        return <ShieldCheck className="h-4 w-4" />;
    }
  }

  const handleSignatureComplete = useCallback((signedDocId: SignableDocumentId) => {
/*       update(signedDocId as keyof DossierFormData, true as DossierFormData[keyof DossierFormData]);
 */      setShowSignatureFlow(false);
  }, []);

  const libraryDocuments = SIGNABLE_DOCUMENTS.filter(
    (doc) => doc.enabled && (doc.context === "bibliotheque" || doc.context === "both")
  );

  const filteredDocuments = useMemo(() => {
    return libraryDocuments.filter((doc) => {
      const matchesSearch =
        !search.trim() ||
        doc.label.toLowerCase().includes(search.toLowerCase()) ||
        doc.description.toLowerCase().includes(search.toLowerCase()) ||
        doc.tags.some((item) => item.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        categoryFilter === "all" || doc.category === categoryFilter;

      /* const matchesContext =
        contextFilter === "all" || doc.context === contextFilter; */

      /* const matchesSign =
        signFilter === "all" || doc.signTarget === signFilter; */

      return matchesSearch && matchesCategory /* && matchesContext && matchesSign; */
    });
  }, [libraryDocuments, search, categoryFilter]);

  /* const handlePreview = (doc: SignableDocumentConfig) => {
    setOpenPreview(true)
    setPreviewPath(doc.pdfPath)
    console.log("Preview document:", doc.id);
  }; */

  const handleOpenSignatureFlow = (doc: SignableDocumentConfig) => {
    setSelectedDocumentId(doc.id);
    setShowSignatureFlow(true)
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Bibliothèque de documents</h1>
        <p className="text-sm text-muted-foreground">
          Retrouvez les documents à remplir, faire signer ou télécharger selon le
          contexte commercial.
        </p>
      </div>

      <div className="rounded-2xl">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="relative md:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un document..."
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              <SelectItem value="juridique">Juridique</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="administratif">Administratif</SelectItem>
              <SelectItem value="parrainage">Parrainage</SelectItem>
              <SelectItem value="technique">Technique</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>{filteredDocuments.length} document(s) trouvé(s)</span>
      </div>

      {filteredDocuments.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-3 p-6 text-center">
            <FolderOpen className="h-10 w-10 text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium">Aucun document trouvé</p>
              <p className="text-sm text-muted-foreground">
                Essayez de modifier les filtres ou la recherche.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="rounded-2xl border">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div>
                      <CardTitle className="text-base leading-snug">{doc.label}</CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {doc.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{categoryLabels[doc.category]}</Badge>
                  {/* <Badge variant="outline">{contextLabels[doc.context]}</Badge> */}
                  {/* <Badge variant={doc.prefilled ? "default" : "secondary"}>
                    {doc.prefilled ? "Prérempli" : "Vierge"}
                  </Badge> */}
                  {/*  <Badge variant="outline" className="flex items-center gap-1">
                    {getSignIcon(doc.signTarget)}
                    {getSignLabel(doc.signTarget)}
                  </Badge> */}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(doc)}
                    className="flex items-center gap-2 text-xs"
                  >
                    <Eye className="h-4 w-4" />
                    Aperçu
                  </Button> */}
                  {/* <Dialog open={openPreview} onOpenChange={(value) => !value && setOpenPreview(false)}>
                    <DialogContent className="w-[95vw] max-w-5xl">
                      <DialogHeader>
                        <DialogTitle>Aperçu</DialogTitle>
                        <DialogDescription></DialogDescription>
                      </DialogHeader>

                      <div className="border border-input rounded-md bg-background min-h-[70vh] overflow-hidden">
                        <iframe
                          src={`${previewPath}#toolbar=0&navpanes=0&scrollbar=0`}
                          //title={""}
                          className="w-full h-[70vh] border-0"
                        />
                      </div>
                    </DialogContent>
                  </Dialog> */}
                  <a href={doc.pdfPath} download title="Télécharger" className="px-2 py-1 flex items-center gap-2 bg-background font-medium text-xs border rounded-md">
                    <Download className="h-4 w-4" />
                    Télécharger
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

      <div>
        <MySignatureView signatureUrl={signatureCommercialUrl} setSignatureVersion={setSignatureVersion} />
      </div>


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
      //fieldData={buildPdfFieldData(formDossier)}
      />
    </div>
  );
};

export default AdminLibraryView;