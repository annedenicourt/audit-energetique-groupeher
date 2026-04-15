import { ArrowUpDown, LayoutGrid, LayoutList, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useMemo, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  id: string;
  display_name: string | null;
  role: string;
  created_at: string;
  signature_path: string | null;
}

type SortKey = "display_name_asc" | "display_name_desc" | "date_desc" | "date_asc";

const AdminUsersView: React.FC<{
  profiles: Profile[];
  loading: boolean;
  emailMap: Record<string, string>;
  onDeleteProfile: (id: string) => void;
  onAddProfile: (profile: Profile, email?: string) => void;
  onUpdateProfile: (id: string, data: { display_name?: string | null; role?: string }) => void;
}> = ({ profiles, loading, emailMap, onDeleteProfile, onAddProfile, onUpdateProfile }) => {
  const [view, setView] = useState<"list" | "cards">("cards");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("display_name_asc");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Create user dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newRole, setNewRole] = useState<"commercial" | "admin">("commercial");

  // Edit user dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editRole, setEditRole] = useState<"commercial" | "admin">("commercial");

  const openEdit = (profile: Profile) => {
    setEditId(profile.id);
    setEditDisplayName(profile.display_name ?? "");
    setEditRole(profile.role as "commercial" | "admin");
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editId) return;
    setEditing(true);
    try {
      const res = await supabase.functions.invoke("update-user", {
        body: { userId: editId, display_name: editDisplayName.trim() || null, role: editRole },
      });
      if (res.error) throw new Error(res.error.message);
      if (res.data?.error) throw new Error(res.data.error);
      onUpdateProfile(editId, { display_name: editDisplayName.trim() || null, role: editRole });
      toast.success("Utilisateur mis à jour.");
      setEditOpen(false);
    } catch (err) {
      toast.error("Erreur : " + err.message);
    } finally {
      setEditing(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

  const filtered = useMemo(() => {
    let result = profiles;
    if (search) {
      const v = search.toLowerCase();
      result = result.filter((s) => s.display_name?.toLowerCase().includes(v));
    }
    return [...result].sort((a, b) => {
      switch (sortKey) {
        case "display_name_asc": return (a.display_name ?? "").localeCompare(b.display_name ?? "");
        case "display_name_desc": return (b.display_name ?? "").localeCompare(a.display_name ?? "");
        case "date_asc": return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [profiles, search, sortKey]);

  const confirmProfile = profiles.find((p) => p.id === confirmId);

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      const res = await supabase.functions.invoke("delete-user", {
        body: { userId: confirmId },
      });
      if (res.error) throw new Error(res.error.message);
      onDeleteProfile(confirmId);
      toast.success("Utilisateur supprimé avec succès.");
    } catch (err) {
      toast.error("Erreur : " + err.message);
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  };

  const handleCreate = async () => {
    if (!newEmail.trim()) {
      toast.error("L'email est requis.");
      return;
    }
    setCreating(true);
    try {
      const res = await supabase.functions.invoke("create-user", {
        body: { email: newEmail.trim(), display_name: newDisplayName.trim() || null, role: newRole },
      });
      if (res.error) throw new Error(res.error.message);
      if (res.data?.error) throw new Error(res.data.error);

      const newProfile: Profile = {
        id: res.data.userId,
        display_name: newDisplayName.trim() || null,
        role: newRole,
        created_at: new Date().toISOString(),
        signature_path: null
      };
      onAddProfile(newProfile, newEmail.trim());
      toast.success("Utilisateur créé avec succès.");
      setCreateOpen(false);
      setNewEmail("");
      setNewDisplayName("");
      setNewRole("commercial");
    } catch (err) {
      toast.error("Erreur : " + err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Utilisateurs</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestion des comptes commerciaux</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel utilisateur
        </Button>
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
            <SelectItem value="display_name_asc">Nom A→Z</SelectItem>
            <SelectItem value="display_name_desc">Nom Z→A</SelectItem>
            <SelectItem value="date_desc">Plus récent</SelectItem>
            <SelectItem value="date_asc">Plus ancien</SelectItem>
            <SelectItem value="role_admin">Rôle Administrateur</SelectItem>
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
        <div className="rounded-lg border border-border p-12 text-center text-muted-foreground">Aucun utilisateur trouvé.</div>
      )}

      {!loading && filtered.length > 0 && view === "list" && (
        <div className="rounded-lg border table_users">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id} className={`${s.role === "admin" && "bg-orange-100/60"}`}>
                  <TableCell className="font-medium">{s.display_name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{emailMap[s.id] ?? "—"}</TableCell>
                  <TableCell className="capitalize">{s.role ?? "—"}</TableCell>
                  <TableCell>{formatDate(s.created_at)}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => openEdit(s)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setConfirmId(s.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && filtered.length > 0 && view === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <Card key={s.id} className={`${s.role === "admin" && "ring-2 ring-orange-500 ring-offset-2"}`}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <p className="font-semibold text-foreground truncate">{s.display_name ?? "—"}</p>
                  <div className="flex gap-1 -mt-1 -mr-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => openEdit(s)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setConfirmId(s.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground truncate">{emailMap[s.id] ?? ""}</p>
                <p className="text-sm text-muted-foreground capitalize">Rôle : {s.role}</p>
                <p className="text-sm text-muted-foreground">Créé le : {formatDate(s.created_at)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Confirmation suppression */}
      <AlertDialog open={!!confirmId} onOpenChange={(open) => { if (!open) setConfirmId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de supprimer <strong>{confirmProfile?.display_name ?? confirmId}</strong>. Cette action est irréversible et supprimera également toutes ses données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog création utilisateur */}
      <Dialog open={createOpen} onOpenChange={(open) => { if (!open && !creating) setCreateOpen(false); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nouvel utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="new-email">Email <span className="text-destructive">*</span></Label>
              <Input
                id="new-email"
                type="email"
                placeholder="prenom.nom@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={creating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-display-name">Nom d'affichage</Label>
              <Input
                id="new-display-name"
                placeholder="Prénom Nom"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                disabled={creating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-role">Rôle</Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as "commercial" | "admin")} disabled={creating}>
                <SelectTrigger id="new-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={creating}>Annuler</Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog édition utilisateur */}
      <Dialog open={editOpen} onOpenChange={(open) => { if (!open && !editing) setEditOpen(false); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-display-name">Nom d'affichage</Label>
              <Input
                id="edit-display-name"
                placeholder="Prénom Nom"
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                disabled={editing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Rôle</Label>
              <Select value={editRole} onValueChange={(v) => setEditRole(v as "commercial" | "admin")} disabled={editing}>
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={editing}>Annuler</Button>
            <Button onClick={handleEdit} disabled={editing}>
              {editing ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersView;
