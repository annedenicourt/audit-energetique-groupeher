import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowUpDown, LayoutList, LayoutGrid, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";

type SortKey = "client_name_asc" | "client_name_desc" | "commercial_asc" | "commercial_desc" | "date_desc" | "date_asc";

interface Dossier {
  id: string;
  user_id: string;
  client_name: string | null;
  pdf_path: string | null;
  created_at: string;
}

interface Profile {
  id: string;
  display_name: string | null;
}

const AdminDossiersView: React.FC<{ dossiers: Dossier[]; profiles: Profile[]; loading: boolean }> = ({ dossiers, profiles, loading }) => {
  const [listView, setListView] = useState<"list" | "cards">("list");
  const [search, setSearch] = useState("");
  const [filterCommercial, setFilterCommercial] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("date_desc");

  const profileMap = useMemo(() => {
    const map = new Map<string, string>();
    profiles.forEach((p) => map.set(p.id, p.display_name ?? "—"));
    return map;
  }, [profiles]);

  const commercials = useMemo(
    () => profiles.filter((p) => dossiers.some((s) => s.user_id === p.id)),
    [profiles, dossiers]
  );

  const filtered = useMemo(() => {
    let result = dossiers;
    if (search) {
      const v = search.toLowerCase();
      result = result.filter((s) => s.client_name?.toLowerCase().includes(v));
    }
    if (filterCommercial !== "all") {
      result = result.filter((s) => s.user_id === filterCommercial);
    }
    const gc = (uid: string) => (profileMap.get(uid) ?? "").toLowerCase();
    return [...result].sort((a, b) => {
      switch (sortKey) {
        case "client_name_asc": return (a.client_name ?? "").localeCompare(b.client_name ?? "");
        case "client_name_desc": return (b.client_name ?? "").localeCompare(a.client_name ?? "");
        case "commercial_asc": return gc(a.user_id).localeCompare(gc(b.user_id));
        case "commercial_desc": return gc(b.user_id).localeCompare(gc(a.user_id));
        case "date_asc": return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "date_desc":
        default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [dossiers, search, filterCommercial, sortKey, profileMap]);

  const handleOpenPdf = async (pdfPath: string | null) => {
    if (!pdfPath) { toast.error("Aucun PDF disponible pour cette étude."); return; }
    const { data, error } = await supabase.storage.from("pdfs").createSignedUrl(pdfPath, 60);
    if (error || !data?.signedUrl) { toast.error("Impossible de générer le lien PDF."); return; }
    window.open(data.signedUrl, "_blank");
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dossiers de liaison</h1>
        <p className="text-sm text-muted-foreground mt-1">Toutes les dossiers de liaison et leurs PDF</p>
      </div>
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un client…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
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
        <div className="rounded-lg border border-border p-12 text-center text-muted-foreground">Aucun dossier trouvé.</div>
      )}

      {!loading && filtered.length > 0 && listView === "list" && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Commercial</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">PDF</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.client_name ?? "—"}</TableCell>
                  <TableCell>{profileMap.get(s.user_id) ?? "—"}</TableCell>
                  <TableCell>{formatDate(s.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenPdf(s.pdf_path)}
                      disabled={!s.pdf_path}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Ouvrir
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
          {filtered.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-5 space-y-3">
                <p className="font-semibold text-foreground truncate">{s.client_name ?? "—"}</p>
                <p className="text-sm text-muted-foreground">Commercial : {profileMap.get(s.user_id) ?? "—"}</p>
                <p className="text-sm text-muted-foreground">{formatDate(s.created_at)}</p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => handleOpenPdf(s.pdf_path)} disabled={!s.pdf_path}>
                  <FileText className="h-4 w-4 mr-1" />Ouvrir PDF
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDossiersView;