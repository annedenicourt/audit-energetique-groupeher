import React, { useEffect } from "react";
import { Star, Handshake } from "lucide-react";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import SectionCard from "../SectionCard";
import { AidesData } from "@/types/formData";
import { plafondsData, nbrePersonnesOptions, plafondParPersonneSupp } from "@/utils/handleForm";
import SimulMpr from "@/pages/SimulMpr";
import { useNavigate } from "react-router-dom";

interface StepAvisProps {
  data: AidesData;
  onChange: (field: keyof AidesData, value: string) => void;
}

const StepAvis: React.FC<StepAvisProps> = ({ data, onChange }) => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Avis & Parrainage
          </h2>
          <div className="text-xs text-red-500">* champs obligatoires</div>
        </div>
      </div>


      {/* AVIS */}
      <SectionCard
        title="Avis client"
        icon={Star}
      >


        <div></div>
      </SectionCard>

      {/* PARRAINAGE */}
      {/* <SectionCard
        title="Parrainage"
        icon={Handshake}
      >

        <div></div>
      </SectionCard> */}
    </div>
  );
};

export default StepAvis;