import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FormLayoutAdmin, { AdminView } from "@/components/Admin/FormLayoutAdmin";
import AdminDashboardView from "@/components/Admin/AdminDashboardView";
import AdminPdfView from "@/components/Admin/AdminPdfView";
import AdminUsersView from "@/components/Admin/AdminUsersView";
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
  role: string;
  created_at: string;
}

const Admin: React.FC = () => {
  const [view, setView] = useState<AdminView>("dashboard");

  const [studies, setStudies] = useState<Study[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [studiesRes, profilesRes] = await Promise.all([
        supabase.from("etudes_energetiques").select("id, user_id, client_name, pdf_path, created_at"),
        supabase.from("profiles").select("id, display_name, role, created_at"),
      ]);
      if (studiesRes.error) toast.error("Erreur chargement études: " + studiesRes.error.message);
      else setStudies(studiesRes.data ?? []);
      if (profilesRes.error) toast.error("Erreur chargement profils: " + profilesRes.error.message);
      else setProfiles(profilesRes.data ?? []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const recentStudies = useMemo(
    () => [...studies].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5),
    [studies]
  );

  return (
    <FormLayoutAdmin currentView={view} onViewChange={setView}>
      {view === "dashboard" && (
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
      {view === "users" && (
        <AdminUsersView
          profiles={profiles}
          loading={loading}
          onDeleteProfile={(id) => setProfiles((prev) => prev.filter((p) => p.id !== id))}
          onAddProfile={(profile) => setProfiles((prev) => [...prev, profile])}
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

