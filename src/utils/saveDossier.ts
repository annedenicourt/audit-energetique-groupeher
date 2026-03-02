import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { DossierFormData } from "@/types/dossierFormData";

interface SaveDossierResult {
  success: boolean;
  error?: string;
}

/**
 * Sauvegarde ou met à jour un dossier de liaison dans Supabase.
 * Si existingId est fourni, met à jour l'enregistrement existant.
 */
export async function saveDossier(
  pdfBlob: Blob,
  dossierData: DossierFormData,
  filename: string,
  existingId?: string | null,
  studyId?: string | null
): Promise<SaveDossierResult> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "Utilisateur non authentifié" };

    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const userId = user.id;
    const storagePath = `${userId}/liaison/${filename}-${formattedDate}`;

    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(storagePath, pdfBlob, { contentType: "application/pdf", upsert: false });

    if (uploadError) return { success: false, error: `Upload échoué : ${uploadError.message}` };

    if (existingId) {
      const { error: updateError } = await supabase
        .from("dossiers")
        .update({
          client_name: dossierData?.nomClient || null,
          pdf_path: storagePath,
          payload: dossierData as unknown as Json,
        })
        .eq("id", existingId);

      if (updateError) {
        await supabase.storage.from("pdfs").remove([storagePath]);
        return { success: false, error: `Mise à jour échouée : ${updateError.message}` };
      }
    } else {
      const { error: insertError } = await supabase
        .from("dossiers")
        .insert({
          user_id: userId,
          client_name: dossierData?.nomClient || null,
          pdf_path: storagePath,
          payload: dossierData as unknown as Json,
          ...(studyId ? { study_id: studyId } : {}),
        });

      if (insertError) {
        await supabase.storage.from("pdfs").remove([storagePath]);
        return { success: false, error: `Insertion échouée : ${insertError.message}` };
      }
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}
