import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import FormLayoutAdmin, { AdminView, NAV_ITEMS } from "@/components/Admin/FormLayoutAdmin";
import AdminDashboardView from "@/components/Admin/AdminDashboardView";
import AdminPdfView from "@/components/Admin/AdminPdfView";
import AdminUsersView from "@/components/Admin/AdminUsersView";
import AdminDossiersView from "@/components/Admin/AdminDossiersView";

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
}

interface Profile {
  id: string;
  display_name: string | null;
  role: string;
  created_at: string;
}

const COMMERCIAL_VIEWS: AdminView[] = ["pdf", "dossiers"];

const Admin: React.FC = () => {
  const { user } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const isAdmin = role === "admin";

  const allowedNavItems = useMemo(
    () => isAdmin ? NAV_ITEMS : NAV_ITEMS.filter((item) => COMMERCIAL_VIEWS.includes(item.view)),
    [isAdmin]
  );

  const defaultView = isAdmin ? "dashboard" : "pdf";
  const [view, setView] = useState<AdminView>(defaultView);

  // Reset view if role changes and current view is not allowed
  useEffect(() => {
    if (!roleLoading && !isAdmin && !COMMERCIAL_VIEWS.includes(view)) {
      setView("pdf");
    }
  }, [roleLoading, isAdmin, view]);

  const [studies, setStudies] = useState<Study[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [emailMap, setEmailMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roleLoading || !user) return;

    const fetchData = async () => {
      setLoading(true);

      if (isAdmin) {
        const [studiesRes, profilesRes, emailsRes, dossiersRes] = await Promise.all([
          supabase.from("etudes_energetiques").select("id, user_id, client_name, pdf_path, created_at"),
          supabase.from("profiles").select("id, display_name, role, created_at"),
          supabase.functions.invoke("list-users"),
          supabase.from("dossiers").select("id, user_id, client_name, pdf_path, created_at"),
        ]);
        if (studiesRes.error) toast.error("Erreur chargement études: " + studiesRes.error.message);
        else setStudies(studiesRes.data ?? []);
        if (profilesRes.error) toast.error("Erreur chargement profils: " + profilesRes.error.message);
        else setProfiles(profilesRes.data ?? []);
        if (dossiersRes.error) toast.error("Erreur chargement dossiers: " + dossiersRes.error.message);
        else setDossiers(dossiersRes.data ?? []);
        if (!emailsRes.error && emailsRes.data?.emails) setEmailMap(emailsRes.data.emails);
      } else {
        // Commercial: RLS already filters to own data
        const [studiesRes, dossiersRes] = await Promise.all([
          supabase.from("etudes_energetiques").select("id, user_id, client_name, pdf_path, created_at"),
          supabase.from("dossiers").select("id, user_id, client_name, pdf_path, created_at"),
        ]);
        if (studiesRes.error) toast.error("Erreur chargement études: " + studiesRes.error.message);
        else setStudies(studiesRes.data ?? []);
        if (dossiersRes.error) toast.error("Erreur chargement dossiers: " + dossiersRes.error.message);
        else setDossiers(dossiersRes.data ?? []);
      }

      setLoading(false);
    };
    fetchData();
  }, [roleLoading, isAdmin, user]);

  const recentStudies = useMemo(
    () => [...studies].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5),
    [studies]
  );

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const sidebarTitle = isAdmin ? "Espace admin" : "Mes documents";

  return (
    <FormLayoutAdmin currentView={view} onViewChange={setView} navItems={allowedNavItems} title={sidebarTitle}>
      {view === "dashboard" && isAdmin && (
        <AdminDashboardView
          studyCount={studies.length}
          profileCount={profiles.length}
          recentStudies={recentStudies}
          profiles={profiles}
          allStudies={studies}
          setView={setView}
        />
      )}
      {view === "pdf" && (
        <AdminPdfView studies={studies} profiles={profiles} loading={loading} />
      )}
      {view === "dossiers" && (
        <AdminDossiersView dossiers={dossiers} profiles={profiles} loading={loading} />
      )}
      {view === "users" && isAdmin && (
        <AdminUsersView
          profiles={profiles}
          loading={loading}
          emailMap={emailMap}
          onDeleteProfile={(id) => setProfiles((prev) => prev.filter((p) => p.id !== id))}
          onAddProfile={(profile, email) => {
            setProfiles((prev) => [...prev, profile]);
            if (email) setEmailMap((prev) => ({ ...prev, [profile.id]: email }));
          }}
          onUpdateProfile={(id, data) =>
            setProfiles((prev) =>
              prev.map((p) => (p.id === id ? { ...p, ...data } : p))
            )
          }
        />
      )}
    </FormLayoutAdmin>
  );
};

export default Admin;
