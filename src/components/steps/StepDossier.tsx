import React, { useState } from "react";
import { FileCheck } from "lucide-react";
import { FormData } from "@/types/formData";
import html2pdf from "html2pdf.js";
import PreviewCommercial from "../PreviewCommercial";
import PreviewClient from "../PreviewClient";
import { saveStudy } from "@/utils/saveStudy";
import { toast } from "sonner";

interface StepSyntheseProps {
  data: FormData;
}


const StepDossier: React.FC<StepSyntheseProps> = ({ data }) => {


  return (
    <div className="">


      PAGE DOSSIER DE LIAISON

    </div>
  );
};

export default StepDossier;