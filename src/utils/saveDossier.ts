import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { DossierFormData } from "@/types/dossierFormData";

interface SaveDossierResult {
  success: boolean;
  error?: string;
}

/**
 * Sauvegarde ou met à jour un dossier de liaison dans Supabase (payload JSON uniquement, sans PDF).
 */
export async function saveDossier(
  dossierData: DossierFormData,
  existingId?: string | null,
  studyId?: string | null
): Promise<SaveDossierResult> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "Utilisateur non authentifié" };

    const userId = user.id;

    if (existingId) {
      const { error: updateError } = await supabase
        .from("dossiers")
        .update({
          client_name: dossierData?.nomClient || null,
          payload: dossierData as unknown as Json,
        })
        .eq("id", existingId);

      if (updateError) {
        return { success: false, error: `Mise à jour échouée : ${updateError.message}` };
      }
    } else {
      const { error: insertError } = await supabase
        .from("dossiers")
        .insert({
          user_id: userId,
          client_name: dossierData?.nomClient || null,
          payload: dossierData as unknown as Json,
          pdf_path: null,
          ...(studyId ? { study_id: studyId } : {}),
        });

      if (insertError) {
        return { success: false, error: `Insertion échouée : ${insertError.message}` };
      }
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}
