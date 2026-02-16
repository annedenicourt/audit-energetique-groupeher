import React, { useState } from "react";
import { FileCheck, User, Home, Receipt, BarChart3, TrendingUp, Wallet, Banknote } from "lucide-react";
import SectionCard from "./SectionCard";
import { FormData } from "@/types/formData";
import html2pdf from "html2pdf.js";
import PdfContentCommercial from "./PdfContentCommercial";

interface PreviwDossierProps {
  data: FormData;
  downloadPdf: () => void;
  isSaving?: boolean;
}


const PreviewDossier: React.FC<PreviwDossierProps> = ({ data, downloadPdf, isSaving }) => {

  return (
    <div className="mx-auto bg-white p-4">
      {/* Bouton Téléchargement PDF */}
      <div className="mb-6 flex items-center">
        <FileCheck size="30" className="mr-3 text-primary" />
        <div className="mr-6 text-2xl font-display font-bold text-foreground">
          Dossier de liaison
        </div>
        <button
          className="nav-button nav-button--primary px-6"
          disabled={isSaving}
        //onClick={() => { requestAnimationFrame(() => downloadPdf()); }}
        >
          <FileCheck className="w-5 h-5" />
          {isSaving ? "Sauvegarde en cours…" : "Télécharger PDF"}
        </button>
      </div>

    </div>
  );
};

export default PreviewDossier;