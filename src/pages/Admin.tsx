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
  const session = supabase.auth.getSession()
    .then((response) => {
      /* console.log(response.data.session.access_token)
      console.log("session?", !!data.session);
      console.log("user id?", data.session?.user?.id);
      console.log("token len", t.length);
      console.log("token has sub?", t.includes('"sub"') || t.includes("sub"));
      console.log("token parts", t.split(".").length); */
    })
  //console.log(session)

  return (
    <FormLayoutAdmin currentView={view} onViewChange={setView}>
      {view === "dashboard" && (
        <AdminDashboardView studyCount={studies.length} profileCount={profiles.length} />
      )}
      {
        view === "pdf" && (
          <AdminPdfView studies={studies} profiles={profiles} loading={loading} />
        )
      }
      {view === "users" && <AdminUsersView profiles={profiles} loading={loading} />}
    </FormLayoutAdmin >
  );
};

export default Admin;

