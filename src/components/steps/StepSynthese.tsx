import React, { useState } from "react";
import { FileCheck } from "lucide-react";
import { FormData } from "@/types/formData";
import html2pdf from "html2pdf.js";
import PreviewCommercial from "../PreviewCommercial";
import PreviewClient from "../PreviewClient";
import { saveStudy } from "@/utils/saveStudy";
import { toast } from "sonner";
import PreviewDossier from "../PreviewDossier";

interface StepSyntheseProps {
  data: FormData;
}

const STORAGE_KEY = "simulation_form";

const StepSynthese: React.FC<StepSyntheseProps> = ({ data }) => {

  const [pdfMode, setPdfMode] = useState("simulateur");
  const [isSaving, setIsSaving] = useState(false);

  const downloadPdf = async () => {
    setIsSaving(true);
    document.body.classList.add("exporting");
    const el = document.getElementById("pdf-content");

    const filename =
      pdfMode === "commercial"
        ? `${data.client.nom}_Rapport_Commercial_HER.pdf`
        : `HER_ENR_Synthese_Client_${data.client.nom}.pdf`;

    try {
      // Générer le PDF en Blob
      const pdfBlob: Blob = await html2pdf()
        .set({
          filename,
          margin: 0,
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(el)
        .outputPdf("blob");

      // Sauvegarder dans Supabase (upload + insert)
      const result = await saveStudy(pdfBlob, data, filename);

      if (result.success) {
        // Téléchargement local
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Supprimer le brouillon localStorage
        localStorage.removeItem(STORAGE_KEY);
        toast.success("Étude sauvegardée et PDF téléchargé !");
      } else {
        console.error("[downloadPdf] Sauvegarde échouée :", result.error);
        toast.error(`Sauvegarde échouée : ${result.error}`);
      }
    } catch (err) {
      console.error("[downloadPdf] Erreur inattendue", err);
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      document.body.classList.remove("exporting");
      setIsSaving(false);
    }
  };

  return (
    <div className="">
      <div className="mt-8 flex items-center">
        <div className={`p-4 rounded-t-lg cursor-pointer ${pdfMode === "simulateur" ? "bg-orange-100 font-bold" : "bg-white text-slate-400"}`} onClick={() => { setPdfMode("simulateur") }}>
          Synthèse simulateur
        </div>
        <div className={`p-4 rounded-t-lg cursor-pointer ${pdfMode === "dossier" ? "bg-orange-100 font-bold" : "bg-white text-slate-400"}`} onClick={() => { setPdfMode("dossier") }}>
          Synthèse dossier de liaison
        </div>
      </div>


      <div className="mx-auto bg-white p-8">
        {pdfMode === "simulateur" ? (
          <PreviewCommercial data={data} downloadPdf={downloadPdf} isSaving={isSaving} />
        ) : (
          <PreviewDossier data={data} downloadPdf={downloadPdf} isSaving={isSaving} />
        )}
      </div>
    </div>
  );
};

export default StepSynthese;