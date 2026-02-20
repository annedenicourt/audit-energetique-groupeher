import { ArrowUpDown, Database, FileText, LayoutGrid, LayoutList, Search } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useMemo, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "@/components/ui/button";
import { formatDate } from "date-fns";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Profile {
  id: string;
  display_name: string | null;
  role: string;
  created_at: string;
}

type SortKey = "display_name_asc" | "display_name_desc" | "commercial_asc" | "commercial_desc" | "date_desc" | "date_asc";

const AdminUsersView: React.FC<{ profiles: Profile[], loading: boolean }> = ({ profiles, loading }) => {
  const [view, setView] = useState<"list" | "cards">("list");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("display_name_asc");


  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

  const profileMap = useMemo(() => {
    const map = new Map<string, string>();
    profiles.forEach((p) => map.set(p.id, p.display_name ?? "—"));
    return map;
  }, [profiles]);

  const filtered = useMemo(() => {
    let result = profiles;
    if (search) {
      const v = search.toLowerCase();
      result = result.filter((s) => s.display_name?.toLowerCase().includes(v));
    }

    const gc = (uid: string) => (profileMap.get(uid) ?? "").toLowerCase();
    return [...result].sort((a, b) => {
      switch (sortKey) {
        case "display_name_asc": return (a.display_name ?? "").localeCompare(b.display_name ?? "");
        case "display_name_desc": return (b.display_name ?? "").localeCompare(a.display_name ?? "");
        default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [profiles, search, profileMap, sortKey]);



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Utilisateurs</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestion des comptes commerciaux.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un commercial..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
          <SelectTrigger className="w-[220px]">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="display_name_asc">Client A→Z</SelectItem>
            <SelectItem value="display_name_desc">Client Z→A</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1 border rounded-md p-1">
          <Button variant={view === "list" ? "default" : "ghost"} size="icon" onClick={() => setView("list")} aria-label="Vue liste">
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button variant={view === "cards" ? "default" : "ghost"} size="icon" onClick={() => setView("cards")} aria-label="Vue cartes">
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
        <div className="rounded-lg border border-border p-12 text-center text-muted-foreground">Aucune étude trouvée.</div>
      )}

      {!loading && filtered.length > 0 && view === "list" && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Créé le</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.display_name ?? "—"}</TableCell>
                  <TableCell className="font-medium capitalize">{s.role ?? "—"}</TableCell>
                  <TableCell>{formatDate(s.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && filtered.length > 0 && view === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-5 space-y-3">
                <p className="font-semibold text-foreground truncate">{s.display_name ?? "—"}</p>
                <p className="text-sm text-muted-foreground">Role : {s.role}</p>
                <p className="text-sm text-muted-foreground">Créé le : {formatDate(s.created_at)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminUsersView;
