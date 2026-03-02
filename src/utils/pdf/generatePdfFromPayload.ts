import { pdf } from "@react-pdf/renderer";
import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EtudeDocument from "./EtudeDocument";
import DossierDocument from "./DossierDocument";

export async function downloadPdfFromDb(
  type: "etude" | "dossier",
  id: string
): Promise<boolean> {
  try {
    // Fetch payload from DB
    const table = type === "etude" ? "etudes_energetiques" : "dossiers";
    const { data, error } = await supabase
      .from(table)
      .select("payload, client_name")
      .eq("id", id)
      .single();

    if (error || !data) {
      toast.error("Impossible de récupérer les données.");
      return false;
    }

    const payload = data.payload as any;
    const clientName = data.client_name || "Client";

    // Build PDF document
    const DocComponent =
      type === "etude"
        ? React.createElement(EtudeDocument, { data: payload })
        : React.createElement(DossierDocument, { data: payload });

    const blob = await pdf(DocComponent as any).toBlob();

    // Download
    const prefix = type === "etude" ? "Etude_NRJ" : "Dossier_Liaison";
    const filename = `${prefix}_${clientName}.pdf`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("PDF téléchargé !");
    return true;
  } catch (err) {
    console.error("[downloadPdfFromDb]", err);
    toast.error("Erreur lors de la génération du PDF");
    return false;
  }
}
