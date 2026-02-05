import React from "react";
import { TrendingUp, Sun, Thermometer } from "lucide-react";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import SectionCard from "../SectionCard";
import { ScenariosData, ScenarioData, DimensionnementData } from "@/types/formData";

interface StepDimensionnementProps {
  data: DimensionnementData;
  onChange: (field: keyof DimensionnementData | string, value: string | DimensionnementData) => void;
}

const StepDimensionnement: React.FC<StepDimensionnementProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Dimensionnement thermique & solaire
        </h2>
      </div>


      {/* Dimensionnement thermique */}
      <SectionCard title="Dimensionnement thermique (chauffage / ECS)" icon={Thermometer}>
        <FormInput
          label="Résultat de la note de dimensionnement fabricant"
          name="dimensionnementFabricant"
          value={data.puissanceThermique}
          onChange={(v) => onChange("dimensionnementFabricant", v)}
          type="number"
          placeholder="12"
          suffix=""
        />
        <FormInput
          label="Puissance thermique recommandée"
          name="puissanceThermique"
          value={data.puissanceThermique}
          onChange={(v) => onChange("puissanceThermique", v)}
          type="number"
          placeholder="12"
          suffix="kW"
        />
      </SectionCard>

      {/* Dimensionnement solaire */}
      <SectionCard title="Dimensionnement solaire photovoltaïque" icon={Sun}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Consommation électrique annuelle"
            name="consommationElecAnnuelle"
            value={data.consommationElecAnnuelle}
            onChange={(v) => onChange("consommationElecAnnuelle", v)}
            type="number"
            placeholder="5000"
            suffix="kWh/an"
          />
          <FormInput
            label="Puissance PV recommandée"
            name="puissancePVRecommandee"
            value={data.puissancePVRecommandee}
            onChange={(v) => onChange("puissancePVRecommandee", v)}
            type="number"
            placeholder="6"
            suffix="kWc"
          />
          <FormInput
            label="Production PV estimée"
            name="productionPVEstimee"
            value={data.productionPVEstimee}
            onChange={(v) => onChange("productionPVEstimee", v)}
            type="number"
            placeholder="6500"
            suffix="kWh/an"
          />
        </div>
      </SectionCard>
    </div>
  );
};

export default StepDimensionnement;