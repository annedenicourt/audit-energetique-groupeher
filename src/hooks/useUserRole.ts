import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "admin" | "commercial" | null;

interface UseUserRoleResult {
  role: UserRole;
  loading: boolean;
}

export const useUserRole = (): UseUserRoleResult => {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        setRole(null);
      } else {
        setRole(data.role as UserRole);
      }
      setLoading(false);
    };

    fetchRole();
  }, [user, authLoading]);

  return { role, loading };
};
