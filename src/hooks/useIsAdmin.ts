import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface UseIsAdminResult {
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

export const useIsAdmin = (): UseIsAdminResult => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (fetchError) {
        setError(fetchError.message);
        setIsAdmin(false);
      } else {
        setIsAdmin(data.role === "admin");
      }
      setLoading(false);
    };

    fetchRole();
  }, [user, authLoading]);

  return { isAdmin, loading, error };
};
