import React from "react";
import { TrendingUp, Sun, Thermometer, Banknote } from "lucide-react";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import SectionCard from "../SectionCard";
import { ScenariosData, ScenarioData, DimensionnementData } from "@/types/formData";

interface StepExponentielProps {
  data: DimensionnementData;
  onChange: (field: keyof DimensionnementData | string, value: string | DimensionnementData) => void;
}

const StepExponentiel: React.FC<StepExponentielProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Dimensionnement solaire et photovoltaïque
        </h2>
        <p className="text-muted-foreground">
          Propositions de travaux et dimensionnement des équipements
        </p>
      </div>

      {/* Synthèse des économies */}
      <SectionCard title="Synthèse des économies réalisées" icon={Banknote}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* <FormInput
            label="Consommation sur 10 ans (sans travaux)"
            name="consommation10AnsSansTravaux"
            value={data.consommation10AnsSansTravaux}
            onChange={(v) => onChange("consommation10AnsSansTravaux", v)}
            type="number"
            placeholder="35000"
            suffix="€"
          /> */}
          {/* <FormInput
            label="Consommation sur 10 ans (après travaux)"
            name="consommation10AnsApresTravaux"
            value={data.consommation10AnsApresTravaux}
            onChange={(v) => onChange("consommation10AnsApresTravaux", v)}
            type="number"
            placeholder="16000"
            suffix="€"
          /> */}
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <label className="form-label text-primary mb-2 block">
              Économies totales sur 10 ans
            </label>
            {/* <FormInput
              label=""
              name="economiesRealisees10Ans"
              value={data.economiesRealisees10Ans}
              onChange={(v) => onChange("economiesRealisees10Ans", v)}
              type="number"
              placeholder="19000"
              suffix="€"
            /> */}
          </div>
          <div className="space-y-4">
            {/* <FormInput
              label="Économies annuelles moyennes"
              name="economiesAnnuellesMoyennes"
              value={data.economiesAnnuellesMoyennes}
              onChange={(v) => onChange("economiesAnnuellesMoyennes", v)}
              type="number"
              placeholder="1900"
              suffix="€/an"
            /> */}
            {/* <FormInput
              label="Économies mensuelles moyennes"
              name="economiesMensuellesMoyennes"
              value={data.economiesMensuellesMoyennes}
              onChange={(v) => onChange("economiesMensuellesMoyennes", v)}
              type="number"
              placeholder="158"
              suffix="€/mois"
            /> */}
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default StepExponentiel;