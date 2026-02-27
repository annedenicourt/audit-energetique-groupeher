import React, { useState } from "react";
import { FileCheck } from "lucide-react";
import { FormData } from "@/types/formData";
import PdfContentCommercial from "./PdfContentCommercial";

interface PreviwCommercialProps {
  data: FormData;
  downloadPdf: () => void;
  isSaving?: boolean;
}

const PreviewCommercial: React.FC<PreviwCommercialProps> = ({ data, downloadPdf, isSaving }) => {

  return (
    <div className="mx-auto pt-4 bg-white border border-orange-100">
      <div className="m-6 flex items-center">
        <FileCheck size="30" className="mr-3 text-primary" />
        <div className="mr-6 text-2xl font-display font-bold text-foreground">
          Infos Simulateur
        </div>
        {/* <button
          className="nav-button nav-button--primary px-6"
          disabled={isSaving}
          onClick={() => { requestAnimationFrame(() => downloadPdf()); }}
        >
          <FileCheck className="w-5 h-5" />
          {isSaving ? "Sauvegarde en cours…" : "Valider et sauvegarder les données"}
        </button> */}
      </div>
      <div className="pdf-commercial-visible">
        <PdfContentCommercial data={data} />
      </div>
    </div>
  );
};

export default PreviewCommercial;