import { supabase } from "@/integrations/supabase/client";
import type { FormData } from "@/types/formData";
import type { Json } from "@/integrations/supabase/types";

interface SaveStudyResult {
  success: boolean;
  error?: string;
  studyId?: string;
}

/**
 * Sauvegarde ou met à jour une étude énergétique dans Supabase.
 * Si existingId est fourni, met à jour l'enregistrement existant (PDF + payload).
 */
export async function saveStudy(
  pdfBlob: Blob,
  formData: FormData,
  filename: string,
  existingId?: string | null
): Promise<SaveStudyResult> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Utilisateur non authentifié" };
    }

    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const userId = user.id;
    const storagePath = `${userId}/etudes/${filename}-${formattedDate}`;

    // Upload du PDF
    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(storagePath, pdfBlob, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      return { success: false, error: `Upload échoué : ${uploadError.message}` };
    }

    if (existingId) {
      // UPDATE existing record
      const { error: updateError } = await supabase
        .from("etudes_energetiques")
        .update({
          client_name: formData.client.nom || null,
          pdf_path: storagePath,
          payload: formData as unknown as Json,
        })
        .eq("id", existingId);

      if (updateError) {
        await supabase.storage.from("pdfs").remove([storagePath]);
        return { success: false, error: `Mise à jour échouée : ${updateError.message}` };
      }
      return { success: true, studyId: existingId };
    } else {
      // INSERT new record
      const { error: insertError } = await supabase
        .from("etudes_energetiques")
        .insert({
          user_id: userId,
          client_name: formData.client.nom || null,
          pdf_path: storagePath,
          payload: formData as unknown as Json,
        });

      if (insertError) {
        await supabase.storage.from("pdfs").remove([storagePath]);
        return { success: false, error: `Insertion échouée : ${insertError.message}` };
      }
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return { success: false, error: message };
  }
}
