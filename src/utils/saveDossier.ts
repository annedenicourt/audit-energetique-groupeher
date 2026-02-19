import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { DossierFormData } from "@/types/dossierFormData";

interface SaveDossierResult {
  success: boolean;
  error?: string;
}

export async function saveDossier(
  pdfBlob: Blob,
  dossierData: DossierFormData,
  filename: string
): Promise<SaveDossierResult> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "Utilisateur non authentifié" };

    const now = new Date();
    const formattedDate = now.toISOString().slice(0,19).replace(/[:T]/g, "-");// 2026-02-18-11-42-30
    const userId = user.id;
    const storagePath = `${userId}/liaison/${filename}-${formattedDate}`;

    // 2. Upload du PDF dans le bucket privé `pdfs/dossiers`
    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(storagePath, pdfBlob, { contentType: "application/pdf", upsert: false });

    if (uploadError) return { success: false, error: `Upload échoué : ${uploadError.message}` };

    const { error: insertError } = await supabase
    .from("dossiers")
    .insert({
      user_id: userId,
      client_name: dossierData?.nomClient || null,
      pdf_path: storagePath,
      payload: dossierData as unknown as Json,
    });

    if (insertError) {
      await supabase.storage.from("pdfs").remove([storagePath]);
      return { success: false, error: `Insertion échouée : ${insertError.message}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}
