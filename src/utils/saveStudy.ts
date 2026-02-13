import { supabase } from "@/integrations/supabase/client";
import type { FormData } from "@/types/formData";
import type { Json } from "@/integrations/supabase/types";

interface SaveStudyResult {
  success: boolean;
  error?: string;
}

/**
 * Sauvegarde une étude énergétique dans Supabase :
 * 1. Upload du PDF blob dans le bucket `pdfs`
 * 2. Insert d'un enregistrement dans `etudes_energetiques`
 */
export async function saveStudy(
  pdfBlob: Blob,
  formData: FormData,
  filename: string
): Promise<SaveStudyResult> {
  try {
    // 1. Récupérer l'utilisateur connecté
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("[saveStudy] Utilisateur non authentifié", authError);
      return { success: false, error: "Utilisateur non authentifié" };
    }

    const userId = user.id;
    const storagePath = `${userId}/${Date.now()}-${filename}`;

    // 2. Upload du PDF dans le bucket privé `pdfs`
    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(storagePath, pdfBlob, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("[saveStudy] Échec upload PDF", uploadError);
      return { success: false, error: `Upload échoué : ${uploadError.message}` };
    }

    // 3. Insérer l'enregistrement en base
    const { error: insertError } = await supabase
      .from("etudes_energetiques")
      .insert({
        user_id: userId,
        client_name: formData.client.nom || null,
        pdf_path: storagePath,
        payload: formData as unknown as Json,
      });

    if (insertError) {
      // Nettoyage : supprimer le PDF uploadé si l'insert échoue
      await supabase.storage.from("pdfs").remove([storagePath]);
      console.error("[saveStudy] Échec insertion DB", insertError);
      return { success: false, error: `Insertion échouée : ${insertError.message}` };
    }

    console.info("[saveStudy] Étude sauvegardée avec succès", { storagePath });
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    console.error("[saveStudy] Erreur inattendue", err);
    return { success: false, error: message };
  }
}
