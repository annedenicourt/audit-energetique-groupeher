import React, { useState } from "react";
import { FileCheck, User, Home, Receipt, BarChart3, TrendingUp, Wallet, Banknote } from "lucide-react";
import SectionCard from "./SectionCard";
import { FormData } from "@/types/formData";
import html2pdf from "html2pdf.js";
import PdfContentCommercial from "./PdfContentCommercial";

interface StepSyntheseProps {
  data: FormData;
  downloadPdf: () => void
}

// Composant pour afficher une ligne de résumé
const SummaryRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-border/50 last:border-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground">{value || "—"}</span>
  </div>
);

const PreviewCommercial: React.FC<StepSyntheseProps> = ({ data, downloadPdf }) => {

  return (
    <div className="mx-auto bg-white p-4">
      {/* Bouton Téléchargement PDF */}
      <div className="mb-6 flex justify-center">
        <button
          className="nav-button nav-button--primary text-lg px-8"
          onClick={() => { requestAnimationFrame(() => downloadPdf()); }}>
          <FileCheck className="w-5 h-5" />
          Télécharger PDF Commercial
        </button>
      </div>
      <div>
        <PdfContentCommercial data={data} />
      </div>
      <div className="fixed -left-[10000px] top-0">
        <div id="pdf-content">
          <div className="a4-page">
            MA PAGE DE COUV
          </div>
          <PdfContentCommercial data={data} />
        </div>
      </div>
    </div>
  );
};

export default PreviewCommercial;