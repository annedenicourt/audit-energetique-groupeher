import React, { useState } from "react";
import { FileCheck } from "lucide-react";
import PdfContentDossier from "./PdfContentDossier";
import { DossierFormData } from "@/types/dossierFormData";

interface PreviwDossierProps {
  data: DossierFormData;
  downloadPdf: () => void;
  isSaving?: boolean;
}


const PreviewDossier: React.FC<PreviwDossierProps> = ({ data, downloadPdf, isSaving }) => {

  return (
    <div className="mx-auto bg-white border border-orange-100">
      <div className="m-6 flex items-center">
        <FileCheck size="30" className="mr-3 text-primary" />
        <div className="mr-6 text-2xl font-display font-bold text-foreground">
          Dossier de liaison
        </div>
        {/* <button
          className="nav-button nav-button--primary px-6"
          disabled={isSaving}
          onClick={() => { requestAnimationFrame(() => downloadPdf()); }}
        >
          <FileCheck className="w-5 h-5" />
          {isSaving ? "Sauvegarde en cours…" : "Valider et télécharger le PDF"}
        </button> */}
      </div>
      <div>
        <PdfContentDossier data={data} />
      </div>
    </div>
  );
};

export default PreviewDossier;