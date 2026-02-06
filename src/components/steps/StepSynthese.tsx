import React, { useState } from "react";
import { FileCheck, User, Home, Receipt, BarChart3, TrendingUp, Wallet, Banknote } from "lucide-react";
import SectionCard from "../SectionCard";
import { FormData } from "@/types/formData";
import html2pdf from "html2pdf.js";
import PreviewCommercial from "../PreviewCommercial";
import PreviewClient from "../PreviewClient";

interface StepSyntheseProps {
  data: FormData;
}

// Composant pour afficher une ligne de résumé
const SummaryRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-border/50 last:border-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground">{value || "—"}</span>
  </div>
);

const StepSynthese: React.FC<StepSyntheseProps> = ({ data }) => {

  const [pdfMode, setPdfMode] = useState("commercial");

  const downloadPdf = () => {
    document.body.classList.add("exporting");
    const el = document.getElementById("pdf-content");

    html2pdf()
      .set({
        filename:
          pdfMode === "commercial"
            ? `${data.client.nom}_Rapport_Commercial_HER.pdf`
            : `HER_ENR_Synthese_Client_${data.client.nom}.pdf`,
        margin: 0,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(el)
      .save()
      .finally(() => {
        document.body.classList.remove("exporting");
      });
  }

  return (
    <div className="">
      {/* Page title */}
      <div className="my-8 flex items-center">
        <FileCheck size="30" className="mr-3 text-primary" />
        <h2 className="text-2xl font-display font-bold text-foreground">
          Synthèse du dossier
        </h2>
      </div>


      {/* <button onClick={() => { requestAnimationFrame(() => downloadPdf()); }}>
        Télécharger PDF Client
      </button> */}

      <div className="mt-8 flex items-center">
        <div className={`p-4 rounded-t-lg cursor-pointer ${pdfMode === "commercial" ? "bg-orange-100 font-bold" : "bg-white text-slate-400"}`} onClick={() => { setPdfMode("commercial") }}>
          Aperçu commercial
        </div>
        <div className={`p-4 rounded-t-lg cursor-pointer ${pdfMode === "client" ? "bg-orange-100 font-bold" : "bg-white text-slate-400"}`} onClick={() => { setPdfMode("client") }}>
          Aperçu client
        </div>
      </div>


      <div className="mx-auto bg-white p-8">
        {pdfMode === "commercial" ? (
          <PreviewCommercial data={data} downloadPdf={downloadPdf} />
        ) : (
          <PreviewClient data={data} downloadPdf={downloadPdf} />
        )}
      </div>



      {/* Bouton d'action (placeholder) */}
      <div className="flex justify-center pt-6">
        <button
          onClick={() => alert("Fonctionnalité à implémenter : export PDF, envoi par email, etc.")}
          className="nav-button nav-button--primary text-lg px-8"
        >
          <FileCheck className="w-5 h-5" />
          Valider le dossier
        </button>
      </div>
    </div>
  );
};

export default StepSynthese;