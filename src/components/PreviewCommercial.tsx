import React, { useState } from "react";
import { FileCheck, User, Home, Receipt, BarChart3, TrendingUp, Wallet, Banknote } from "lucide-react";
import SectionCard from "./SectionCard";
import { FormData } from "@/types/formData";
import html2pdf from "html2pdf.js";
import PdfContentCommercial from "./PdfContentCommercial";

interface PreviwCommercialProps {
  data: FormData;
  downloadPdf: () => void;
  isSaving?: boolean;
}

const PreviewCommercial: React.FC<PreviwCommercialProps> = ({ data, downloadPdf, isSaving }) => {

  return (
    <div className="mx-auto pt-4 bg-white border border-orange-100">
      {/* Bouton Téléchargement PDF */}
      <div className="m-6 flex items-center">
        <FileCheck size="30" className="mr-3 text-primary" />
        <div className="mr-6 text-2xl font-display font-bold text-foreground">
          Infos Simulateur
        </div>
        <button
          className="nav-button nav-button--primary px-6"
          disabled={isSaving}
          onClick={() => { requestAnimationFrame(() => downloadPdf()); }}
        >
          <FileCheck className="w-5 h-5" />
          {isSaving ? "Sauvegarde en cours…" : "Télécharger PDF"}
        </button>
      </div>
      <div>
        <PdfContentCommercial data={data} />
      </div>
      <div className="fixed -left-[10000px] top-0">
        <div id="pdf-content">
          <div className="a4-page">
            <img src="/images/couv_pdf.png" alt="couverture pdf" />
          </div>
          <PdfContentCommercial data={data} />
        </div>
      </div>
    </div>
  );
};

export default PreviewCommercial;