import { supabase } from "@/integrations/supabase/client";
import type { FormData } from "@/types/formData";
import type { Json } from "@/integrations/supabase/types";

interface SaveStudyResult {
  success: boolean;
  error?: string;
  studyId?: string;
}

/**
 * Sauvegarde ou met à jour une étude énergétique dans Supabase (payload JSON uniquement, sans PDF).
 */
export async function saveStudy(
  formData: FormData,
  existingId?: string | null
): Promise<SaveStudyResult> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Utilisateur non authentifié" };
    }

    const userId = user.id;

    if (existingId) {
      const { error: updateError } = await supabase
        .from("etudes_energetiques")
        .update({
          client_name: formData.client.nom || null,
          payload: formData as unknown as Json,
        })
        .eq("id", existingId);

      if (updateError) {
        return { success: false, error: `Mise à jour échouée : ${updateError.message}` };
      }
      return { success: true, studyId: existingId };
    } else {
      const { data: insertData, error: insertError } = await supabase
        .from("etudes_energetiques")
        .insert({
          user_id: userId,
          client_name: formData.client.nom || null,
          payload: formData as unknown as Json,
        })
        .select("id")
        .single();

      if (insertError || !insertData) {
        return { success: false, error: `Insertion échouée : ${insertError?.message}` };
      }
      return { success: true, studyId: insertData.id };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return { success: false, error: message };
  }
}
