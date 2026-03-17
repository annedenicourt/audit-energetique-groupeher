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
      </div>
      <div className="pdf-commercial-visible">
        <PdfContentCommercial data={data} />
      </div>
    </div>
  );
};

export default PreviewCommercial;