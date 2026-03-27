import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowUpDown, LayoutList, LayoutGrid, FileText, RotateCcw, FolderOpen, Printer, Download, Eye } from "lucide-react";
import { downloadPdfFromDb } from "@/utils/pdf/generatePdfFromPayload";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import PdfContentDossier from "@/components/PdfContentDossier";
import { DossierFormData } from "@/types/dossierFormData";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { useUserRole } from "@/hooks/useUserRole";


type SortKey = "client_name_asc" | "client_name_desc" | "commercial_asc" | "commercial_desc" | "date_desc" | "date_asc";

interface Study {
  id: string;
  user_id: string;
  client_name: string | null;
  pdf_path: string | null;
  created_at: string;
  updated_at: string;
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
}

const AdminDocumentsView: React.FC<{
  studies: Study[];
  dossiers: Dossier[];
  profiles: Profile[];
  loading: boolean;
  showCommercialFilter?: boolean;
}> = ({ studies, dossiers, profiles, loading, showCommercialFilter = true }) => {
  const navigate = useNavigate();
  const [listView, setListView] = useState<"list" | "cards">("list");
  const [search, setSearch] = useState("");
  const [filterCommercial, setFilterCommercial] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("date_desc");
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [printPayload, setPrintPayload] = useState(null);
  const [printSimulData, setPrintSimulData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { role, loading: roleLoading } = useUserRole();
  const isAdmin = role === "admin";

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
      return { study, dossier };
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
        case "date_asc": return new Date(a.study.updated_at).getTime() - new Date(b.study.updated_at).getTime();
        case "date_desc":
        default: return new Date(b.study.updated_at).getTime() - new Date(a.study.updated_at).getTime();
      }
    });
  }, [rows, search, filterCommercial, sortKey, profileMap]);


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

  const handleDownloadPdf = async (type: "etude" | "dossier", id: string) => {
    setRegeneratingId(`${type}-${id}`);
    try {
      await downloadPdfFromDb(type, id);
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
              <SelectItem value="all" className="focus:bg-orange-500/80 data-[highlighted]:bg-orange-500/80 data-[highlighted]:text-white"
              >Tous les commerciaux</SelectItem>
              {commercials.map((c) => (
                <SelectItem key={c.id} value={c.id} className="focus:bg-orange-500/80 data-[highlighted]:bg-orange-500/80 data-[highlighted]:text-white"
                >{c.display_name ?? c.id}</SelectItem>
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
            <SelectItem value="date_desc" className="focus:bg-orange-500/80 data-[highlighted]:bg-orange-500/80 data-[highlighted]:text-white">Date ↓ récente</SelectItem>
            <SelectItem value="date_asc" className="focus:bg-orange-500/80 data-[highlighted]:bg-orange-500/80 data-[highlighted]:text-white">Date ↑ ancienne</SelectItem>
            <SelectItem value="client_name_asc" className="focus:bg-orange-500/80 data-[highlighted]:bg-orange-500/80 data-[highlighted]:text-white">Client A→Z</SelectItem>
            <SelectItem value="client_name_desc" className="focus:bg-orange-500/80 data-[highlighted]:bg-orange-500/80 data-[highlighted]:text-white">Client Z→A</SelectItem>
            <SelectItem value="commercial_asc" className="focus:bg-orange-500/80 data-[highlighted]:bg-orange-500/80 data-[highlighted]:text-white">Commercial A→Z</SelectItem>
            <SelectItem value="commercial_desc" className="focus:bg-orange-500/80 data-[highlighted]:bg-orange-500/80 data-[highlighted]:text-white">Commercial Z→A</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1 border rounded-md p-1">
          <Button variant={listView === "list" ? "default" : "ghost"} size="icon" className="hover:bg-orange-500/80" onClick={() => setListView("list")} aria-label="Vue liste">
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button variant={listView === "cards" ? "default" : "ghost"} size="icon" className="hover:bg-orange-500/80" onClick={() => setListView("cards")} aria-label="Vue cartes">
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
                {showCommercialFilter && <TableHead className="text-center">Commercial</TableHead>}
                <TableHead className="text-center">Créé le</TableHead>
                <TableHead className="text-center">Modifié le</TableHead>
                <TableHead className="text-center">Documents</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.study.id}>
                  <TableCell className="font-medium">{row.study.client_name ?? "—"}</TableCell>
                  {showCommercialFilter && <TableCell className="text-center">{profileMap.get(row.study.user_id) ?? "—"}</TableCell>}
                  <TableCell className="text-center">{formatDate(row.study.created_at)}</TableCell>
                  <TableCell className="text-center">{formatDate(row.study.updated_at)}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      {/* {isAdmin &&
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadPdf("etude", row.study.id)}
                          disabled={regeneratingId === `etude-${row.study.id}`}
                          className="hover:bg-orange-500/80"
                        >
                          <Download className={`h-4 w-4 mr-1 ${regeneratingId === `etude-${row.study.id}` ? "animate-spin" : ""}`} />
                          {regeneratingId === `etude-${row.study.id}` ? "…" : "PDF Étude"}
                        </Button>
                      } */}
                      {isAdmin &&
                        <Button
                          variant="outline"
                          size="sm"
                          //onClick={() => handleDownloadPdf("etude", row.study.id)}
                          onClick={() => window.open(`/print/etude/${row.study.id}`, "_blank")}
                          disabled={regeneratingId === `etude-${row.study.id}`}
                          className="hover:bg-orange-500/80"
                        >
                          <Download className={`h-4 w-4 mr-1 ${regeneratingId === `etude-${row.study.id}` ? "animate-spin" : ""}`} />
                          {regeneratingId === `etude-${row.study.id}` ? "…" : "PDF Étude"}
                        </Button>
                      }
                      {/* {row.dossier && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadPdf("dossier", row.dossier!.id)}
                          disabled={regeneratingId === `dossier-${row.dossier!.id}`}
                          className="hover:bg-orange-500/80"
                        >
                          <Download className={`h-4 w-4 mr-1 ${regeneratingId === `dossier-${row.dossier!.id}` ? "animate-spin" : ""}`} />
                          {regeneratingId === `dossier-${row.dossier!.id}` ? "…" : "PDF Liaison"}
                        </Button>
                      )} */}
                      {row.dossier && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/print/dossier/${row.dossier!.id}`, "_blank")}
                          className="hover:bg-orange-500/80"
                        >
                          <Printer className={`h-4 w-4 mr-1 ${regeneratingId === `dossier-${row.dossier!.id}` ? "animate-spin" : ""}`} />
                          {regeneratingId === `dossier-${row.dossier!.id}` ? "…" : "PDF Liaison"}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(row)}
                      disabled={restoringId === row.study.id}
                      className="hover:bg-orange-500/80"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Accès étude
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
                <p className="text-xs text-muted-foreground">Créé le : {formatDate(row.study.created_at)}</p>
                <p className="text-xs text-muted-foreground">Modifié le : {formatDate(row.study.updated_at)}</p>
                <div className="flex gap-2 flex-wrap">
                  {isAdmin &&
                    <Button variant="outline" size="sm" className="flex-1 hover:bg-orange-500/80" onClick={() => handleDownloadPdf("etude", row.study.id)} disabled={regeneratingId === `etude-${row.study.id}`} >
                      <Download className={`h-4 w-4 mr-1 ${regeneratingId === `etude-${row.study.id}` ? "animate-spin" : ""}`} />
                      {regeneratingId === `etude-${row.study.id}` ? "…" : "PDF Étude"}
                    </Button>
                  }
                  {row.dossier && (
                    <Button variant="outline" size="sm" className="flex-1 hover:bg-orange-500/80" onClick={() => handleDownloadPdf("dossier", row.dossier!.id)} disabled={regeneratingId === `dossier-${row.dossier!.id}`}>
                      <Download className={`h-4 w-4 mr-1 ${regeneratingId === `dossier-${row.dossier!.id}` ? "animate-spin" : ""}`} />
                      {regeneratingId === `dossier-${row.dossier!.id}` ? "…" : "PDF Dossier"}
                    </Button>
                  )}
                </div>
                <Button variant="outline" size="sm" className="w-full hover:bg-orange-500/80" onClick={() => handleRestore(row)} disabled={restoringId === row.study.id}>
                  <RotateCcw className="h-4 w-4 mr-1" /> Restaurer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Hidden print container */}
      {printPayload && (
        <div className="print-only">
          <PdfContentDossier data={printPayload} simulData={printSimulData} />
        </div>
      )}

      {/* <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)} >
        <DialogTrigger asChild>
        </DialogTrigger>
        <DialogContent className="h-[90vh] w-[90vw]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="w-full rounded-md border">
            <PdfContentDossier data={printPayload} simulData={printSimulData} />
          </ScrollArea>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default AdminDocumentsView;
