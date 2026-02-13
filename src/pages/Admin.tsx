import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutList, LayoutGrid, FileText, Search, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

interface Study {
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

type SortKey = "client_name_asc" | "client_name_desc" | "commercial_asc" | "commercial_desc" | "date_desc" | "date_asc";

const Admin: React.FC = () => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "cards">("list");
  const [search, setSearch] = useState("");
  const [filterCommercial, setFilterCommercial] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("date_desc");

  const profileMap = useMemo(() => {
    const map = new Map<string, string>();
    profiles.forEach((profile) => map.set(profile.id, profile.display_name ?? "—"));
    return map;
  }, [profiles]);

  const getUserName = (userId) => {
    console.log(profiles)
    const result = profiles.find((profile) => profile.id === userId)
    return result?.display_name
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [studiesRes, profilesRes] = await Promise.all([
        supabase.from("etudes_energetiques").select("id, user_id, client_name, pdf_path, created_at"),
        supabase.from("profiles").select("id, display_name"),
      ]);

      if (studiesRes.error) {
        toast.error("Erreur chargement études: " + studiesRes.error.message);
      } else {
        setStudies(studiesRes.data ?? []);
      }

      if (profilesRes.error) {
        toast.error("Erreur chargement profils: " + profilesRes.error.message);
      } else {
        setProfiles(profilesRes.data ?? []);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  const handleOpenPdf = async (pdfPath: string | null) => {
    if (!pdfPath) {
      toast.error("Aucun PDF disponible pour cette étude.");
      return;
    }
    const { data, error } = await supabase.storage.from("pdfs").createSignedUrl(pdfPath, 60);
    if (error || !data?.signedUrl) {
      toast.error("Impossible de générer le lien PDF.");
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  const filtered = useMemo(() => {
    let result = studies;

    if (search) {
      const value = search.toLowerCase();
      result = result.filter((item) => item.client_name?.toLowerCase().includes(value));
    }

    if (filterCommercial && filterCommercial !== "all") {
      result = result.filter((item) => item.user_id === filterCommercial);
    }

    const getCommercial = (uid: string) => (profileMap.get(uid) ?? "").toLowerCase();

    result = [...result].sort((a, b) => {
      switch (sortKey) {
        case "client_name_asc":
          return (a.client_name ?? "").localeCompare(b.client_name ?? "");
        case "client_name_desc":
          return (b.client_name ?? "").localeCompare(a.client_name ?? "");
        case "commercial_asc":
          return getCommercial(a.user_id).localeCompare(getCommercial(b.user_id));
        case "commercial_desc":
          return getCommercial(b.user_id).localeCompare(getCommercial(a.user_id));
        case "date_asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "date_desc":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return result;
  }, [studies, search, filterCommercial, sortKey, profileMap]);

  const commercials = useMemo(
    () => profiles.filter((profile) => studies.some((study) => study.user_id === profile.id)),
    [profiles, studies]
  );

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Administration – Études</h1>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un client…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={filterCommercial} onValueChange={setFilterCommercial}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tous les commerciaux" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les commerciaux</SelectItem>
              {commercials.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.display_name ?? c.id}
                </SelectItem>
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
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setView("list")}
              aria-label="Vue liste"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "cards" ? "default" : "ghost"}
              size="icon"
              onClick={() => setView("cards")}
              aria-label="Vue cartes"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-md" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="rounded-lg border border-border p-12 text-center text-muted-foreground">
            Aucune étude trouvée.
          </div>
        )}

        {/* List view */}
        {!loading && filtered.length > 0 && view === "list" && (
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
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.client_name ?? "—"}</TableCell>
                    <TableCell>{profileMap.get(item.user_id) ?? "—"}</TableCell>
                    <TableCell>{getUserName(item.user_id)}</TableCell>
                    <TableCell>{formatDate(item.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenPdf(item.pdf_path)}
                        disabled={!item.pdf_path}
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

        {/* Cards view */}
        {!loading && filtered.length > 0 && view === "cards" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s) => (
              <Card key={s.id}>
                <CardContent className="p-5 space-y-3">
                  <p className="font-semibold text-foreground truncate">{s.client_name ?? "—"}</p>
                  <p className="text-sm text-muted-foreground">
                    Commercial : {profileMap.get(s.user_id) ?? "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">{formatDate(s.created_at)}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleOpenPdf(s.pdf_path)}
                    disabled={!s.pdf_path}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Ouvrir PDF
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
