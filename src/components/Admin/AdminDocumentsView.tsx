import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowUpDown, LayoutList, LayoutGrid, FileText, RotateCcw, FolderOpen, ArrowRightLeft, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

type SortKey = "client_name_asc" | "client_name_desc" | "commercial_asc" | "commercial_desc" | "date_desc" | "date_asc";

interface Study {
  id: string;
  user_id: string;
  client_name: string | null;
  pdf_path: string | null;
  created_at: string;
}

interface Dossier {
  id: string;
  user_id: string;
  client_name: string | null;
  pdf_path: string | null;
  created_at: string;
  study_id: string | null;
}

interface Profile {
  id: string;
  display_name: string | null;
}

/** A grouped row: one study with its linked dossier (if any) */
interface ClientRow {
  study: Study;
  dossier: Dossier | null;
  /** Most recent date between study and dossier */
  latestDate: string;
}

const AdminDocumentsView: React.FC<{
  studies: Study[];
  dossiers: Dossier[];
  profiles: Profile[];
  loading: boolean;
  showCommercialFilter?: boolean;
}> = ({ studies, dossiers, profiles, loading, showCommercialFilter = true }) => {
  const { role } = useUserRole();
  const isAdmin = role === "admin";
  const navigate = useNavigate();
  const [listView, setListView] = useState<"list" | "cards">("list");
  const [search, setSearch] = useState("");
  const [filterCommercial, setFilterCommercial] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("date_desc");
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  const profileMap = useMemo(() => {
    const map = new Map<string, string>();
    profiles.forEach((p) => map.set(p.id, p.display_name ?? "—"));
    return map;
  }, [profiles]);

  const commercials = useMemo(
    () => profiles.filter((p) => studies.some((s) => s.user_id === p.id)),
    [profiles, studies]
  );

  /** Build grouped rows: each study gets its linked dossier */
  const rows: ClientRow[] = useMemo(() => {
    const dossierByStudy = new Map<string, Dossier>();
    dossiers.forEach((d) => {
      if (d.study_id) dossierByStudy.set(d.study_id, d);
    });

    return studies.map((study) => {
      const dossier = dossierByStudy.get(study.id) ?? null;
      const latestDate = dossier && new Date(dossier.created_at) > new Date(study.created_at)
        ? dossier.created_at
        : study.created_at;
      return { study, dossier, latestDate };
    });
  }, [studies, dossiers]);

  const filtered = useMemo(() => {
    let result = rows;
    if (search) {
      const v = search.toLowerCase();
      result = result.filter((r) => r.study.client_name?.toLowerCase().includes(v));
    }
    if (filterCommercial !== "all") {
      result = result.filter((r) => r.study.user_id === filterCommercial);
    }
    const gc = (uid: string) => (profileMap.get(uid) ?? "").toLowerCase();
    return [...result].sort((a, b) => {
      switch (sortKey) {
        case "client_name_asc": return (a.study.client_name ?? "").localeCompare(b.study.client_name ?? "");
        case "client_name_desc": return (b.study.client_name ?? "").localeCompare(a.study.client_name ?? "");
        case "commercial_asc": return gc(a.study.user_id).localeCompare(gc(b.study.user_id));
        case "commercial_desc": return gc(b.study.user_id).localeCompare(gc(a.study.user_id));
        case "date_asc": return new Date(a.latestDate).getTime() - new Date(b.latestDate).getTime();
        case "date_desc":
        default: return new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime();
      }
    });
  }, [rows, search, filterCommercial, sortKey, profileMap]);

  const handleOpenPdf = async (pdfPath: string | null, label: string) => {
    if (!pdfPath) { toast.error(`Aucun PDF ${label} disponible.`); return; }
    const { data, error } = await supabase.storage.from("pdfs").createSignedUrl(pdfPath, 60);
    if (error || !data?.signedUrl) { toast.error("Impossible de générer le lien PDF."); return; }
    window.open(data.signedUrl, "_blank");
  };

  const handleRestore = async (row: ClientRow) => {
    setRestoringId(row.study.id);
    try {
      // Fetch study payload
      const { data: studyData, error: studyErr } = await supabase
        .from("etudes_energetiques")
        .select("id, payload")
        .eq("id", row.study.id)
        .single();

      if (studyErr || !studyData) {
        toast.error("Impossible de récupérer les données de l'étude.");
        return;
      }

      localStorage.setItem("simulation_form", JSON.stringify(studyData.payload));
      localStorage.setItem("current_study_id", studyData.id);

      // Fetch dossier payload if linked
      if (row.dossier) {
        const { data: dossierData, error: dossierErr } = await supabase
          .from("dossiers")
          .select("id, payload")
          .eq("id", row.dossier.id)
          .single();

        if (!dossierErr && dossierData) {
          localStorage.setItem("dossier_form", JSON.stringify(dossierData.payload));
          localStorage.setItem("current_dossier_id", dossierData.id);
        }
      }

      toast.success(row.dossier ? "Étude et dossier restaurés" : "Étude restaurée (pas de dossier lié)");
      navigate("/");
    } catch {
      toast.error("Erreur lors de la restauration");
    } finally {
      setRestoringId(null);
    }
  };

  const handleRegeneratePdf = async (type: "etude" | "dossier", id: string) => {
    setRegeneratingId(`${type}-${id}`);
    try {
      const { data, error } = await supabase.functions.invoke("generate-pdf", {
        body: { type, id },
      });
      if (error) {
        toast.error(`Erreur régénération PDF : ${error.message}`);
        return;
      }
      if (data?.signed_url) {
        window.open(data.signed_url, "_blank");
        toast.success("PDF régénéré et téléchargé !");
      } else if (data?.success) {
        toast.success("PDF régénéré avec succès !");
      } else {
        toast.error(data?.error || "Erreur inconnue");
      }
    } catch {
      toast.error("Erreur lors de la régénération du PDF");
    } finally {
      setRegeneratingId(null);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Documents clients</h1>
        <p className="text-sm text-muted-foreground mt-1">Études énergétiques et dossiers de liaison regroupés par client</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un client…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {showCommercialFilter && (
          <Select value={filterCommercial} onValueChange={setFilterCommercial}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tous les commerciaux" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les commerciaux</SelectItem>
              {commercials.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.display_name ?? c.id}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
          <SelectTrigger className="w-[220px]">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date_desc">Date ↓ récente</SelectItem>
            <SelectItem value="date_asc">Date ↑ ancienne</SelectItem>
            <SelectItem value="client_name_asc">Client A→Z</SelectItem>
            <SelectItem value="client_name_desc">Client Z→A</SelectItem>
            <SelectItem value="commercial_asc">Commercial A→Z</SelectItem>
            <SelectItem value="commercial_desc">Commercial Z→A</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1 border rounded-md p-1">
          <Button variant={listView === "list" ? "default" : "ghost"} size="icon" onClick={() => setListView("list")} aria-label="Vue liste">
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button variant={listView === "cards" ? "default" : "ghost"} size="icon" onClick={() => setListView("cards")} aria-label="Vue cartes">
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-md" />)}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="rounded-lg border border-border p-12 text-center text-muted-foreground">Aucun document trouvé.</div>
      )}

      {!loading && filtered.length > 0 && listView === "list" && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                {showCommercialFilter && <TableHead>Commercial</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.study.id}>
                  <TableCell className="font-medium">{row.study.client_name ?? "—"}</TableCell>
                  {showCommercialFilter && <TableCell>{profileMap.get(row.study.user_id) ?? "—"}</TableCell>}
                  <TableCell>{formatDate(row.latestDate)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="gap-1 cursor-pointer hover:bg-muted" onClick={() => handleOpenPdf(row.study.pdf_path, "étude")}>
                        <FolderOpen className="h-3 w-3" /> Étude
                      </Badge>
                      {row.dossier ? (
                        <Badge variant="outline" className="gap-1 cursor-pointer hover:bg-muted" onClick={() => handleOpenPdf(row.dossier!.pdf_path, "dossier")}>
                          <ArrowRightLeft className="h-3 w-3" /> Dossier
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1 opacity-50">
                          <ArrowRightLeft className="h-3 w-3" /> Pas de dossier
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {isAdmin && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRegeneratePdf("etude", row.study.id)}
                          disabled={regeneratingId === `etude-${row.study.id}`}
                        >
                          <RefreshCw className={`h-4 w-4 mr-1 ${regeneratingId === `etude-${row.study.id}` ? "animate-spin" : ""}`} />
                          {regeneratingId === `etude-${row.study.id}` ? "…" : "Regen Étude"}
                        </Button>
                        {row.dossier && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRegeneratePdf("dossier", row.dossier!.id)}
                            disabled={regeneratingId === `dossier-${row.dossier!.id}`}
                          >
                            <RefreshCw className={`h-4 w-4 mr-1 ${regeneratingId === `dossier-${row.dossier!.id}` ? "animate-spin" : ""}`} />
                            {regeneratingId === `dossier-${row.dossier!.id}` ? "…" : "Regen Dossier"}
                          </Button>
                        )}
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(row)}
                      disabled={restoringId === row.study.id}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Restaurer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && filtered.length > 0 && listView === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((row) => (
            <Card key={row.study.id}>
              <CardContent className="p-5 space-y-3">
                <p className="font-semibold text-foreground truncate">{row.study.client_name ?? "—"}</p>
                {showCommercialFilter && <p className="text-sm text-muted-foreground">Commercial : {profileMap.get(row.study.user_id) ?? "—"}</p>}
                <p className="text-sm text-muted-foreground">{formatDate(row.latestDate)}</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="gap-1 cursor-pointer hover:bg-muted" onClick={() => handleOpenPdf(row.study.pdf_path, "étude")}>
                    <FolderOpen className="h-3 w-3" /> Étude PDF
                  </Badge>
                  {row.dossier ? (
                    <Badge variant="outline" className="gap-1 cursor-pointer hover:bg-muted" onClick={() => handleOpenPdf(row.dossier!.pdf_path, "dossier")}>
                      <ArrowRightLeft className="h-3 w-3" /> Dossier PDF
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1 opacity-50">
                      <ArrowRightLeft className="h-3 w-3" /> Pas de dossier
                    </Badge>
                  )}
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => handleRestore(row)} disabled={restoringId === row.study.id}>
                  <RotateCcw className="h-4 w-4 mr-1" /> Restaurer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDocumentsView;
