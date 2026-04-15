import { supabase } from "@/integrations/supabase/client";

function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, base64] = dataUrl.split(",");
  if (!meta || !base64) {
    throw new Error("Signature invalide.");
  }

  const mimeMatch = meta.match(/data:(.*?);base64/);
  const mimeType = mimeMatch?.[1] ?? "image/png";

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: mimeType });
}

export async function saveUserSignature(signatureDataUrl: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Utilisateur introuvable.");
  }

  const blob = dataUrlToBlob(signatureDataUrl);
  const filePath = `${user.id}/signature.png`;

  const uploadRes = await supabase.storage
    .from("signatures")
    .update(filePath, blob, {
      upsert: true,
      contentType: "image/png",
    });

  if (uploadRes.error) {
    throw new Error(`UPLOAD BLOQUÉ : ${uploadRes.error.message}`);
  }

  const profileRes = await supabase
    .from("profiles")
    .update({ signature_path: filePath })
    .eq("id", user.id)
    .select("id, display_name, role, created_at, signature_path")
        .single()

  if (profileRes.error) {
    throw new Error(`UPDATE PROFILE BLOQUÉ : ${profileRes.error.message}`);
  }

return profileRes.data;
}

export function getSignaturePublicUrl(path: string): string {
  const { data } = supabase.storage.from("signatures").getPublicUrl(path);
  return data.publicUrl;
}