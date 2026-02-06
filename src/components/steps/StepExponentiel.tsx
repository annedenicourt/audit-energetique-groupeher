import React from "react";
import { Banknote, ChartLine } from "lucide-react";
import FormInput from "../FormInput";
import SectionCard from "../SectionCard";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Cell,
  Bar
} from "recharts";
import { ExponentielData } from "@/types/formData";

interface StepExponentielProps {
  data: ExponentielData;
  onChange: (field: keyof ExponentielData | string, value: string | ExponentielData) => void;
  consommation10AnsSansTravaux: string;

}

const StepExponentiel: React.FC<StepExponentielProps> = ({ data, consommation10AnsSansTravaux, onChange }) => {

  const ChartData = [
    { name: "Aujourd’hui", value: 80, color: "#22c55e" },
    { name: "5 ans", value: 150, color: "#f59e0b" },
    { name: "10 ans", value: 240, color: "#f97316" },
  ];

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Re-exponentiel - Projection des coûts (APRÈS TRAVAUX)
        </h2>
      </div>

      {/* Projection des coûts - APRES travaux */}
      <SectionCard title="Projection d'évolution des coûts (APRÈS travaux)" icon={ChartLine}>

        <div className="w-3/5 mx-auto">
          <div className="h-[200px] w-full -ml-8">
            <ResponsiveContainer>
              <BarChart
                data={ChartData}
                margin={{ top: 20, right: 20, left: 20, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine
                />
                <YAxis
                  tick={false}
                  tickLine={false}
                  axisLine
                />
                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                >
                  {ChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Facture aujourd'hui"
              name="factureAujourdhui"
              value={data.factureAujourdhui}
              onChange={(v) => onChange("factureAujourdhui", v)}
              type="number"
              placeholder="0"
              suffix="€/an"
            />
            <FormInput
              label="Estimation + 5 ans"
              name="facture5Ans"
              value={data.facture5Ans}
              type="text"
              placeholder="0"
              suffix="€/an"
              readonly={true}
            />
            <FormInput
              label="Estimation + 10 ans"
              name="facture10Ans"
              value={data.facture10Ans}
              type="text"
              placeholder="0"
              suffix="€/an"
              readonly={true}
            />
          </div>
        </div>
        <FormInput
          label="Consommation énergétique sur 10 ans (après travaux)"
          name="consommation10AnsApresTravaux"
          value={data.consommation10AnsApresTravaux}
          onChange={(v) => onChange("consommation10AnsApresTravaux", v)}
          type="number"
          placeholder="0"
          suffix="€"
          className="mt-8"
        />
        <p className="text-xs text-center font-bold text-muted-foreground mt-3">
          Hypothèse : augmentation moyenne estimée à 6% par an sur une durée de 10 ans
        </p>
      </SectionCard>

      {/* Synthèse des économies */}
      <SectionCard title="Synthèse des économies réalisées" icon={Banknote}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Consommation sur 10 ans (sans travaux)"
            name="consommation10AnsSansTravaux"
            value={consommation10AnsSansTravaux}
            type="number"
            placeholder="0"
            suffix="€"
            readonly={true}
          />
          <FormInput
            label="Consommation sur 10 ans (après travaux)"
            name="consommation10AnsApresTravaux"
            value={data.consommation10AnsApresTravaux}
            type="number"
            placeholder="0"
            suffix="€"
            readonly={true}
          />
          <div className="space-y-4">
            <FormInput
              label="Économies annuelles moyennes"
              name="economiesAnnuellesMoyennes"
              value={data.economiesAnnuellesMoyennes}
              type="number"
              placeholder="0"
              suffix="€/an"
              readonly={true}
            />
            <FormInput
              label="Économies mensuelles moyennes"
              name="economiesMensuellesMoyennes"
              value={data.economiesMensuellesMoyennes}
              type="number"
              placeholder="0"
              suffix="€/mois"
              readonly={true}
            />
          </div>
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <label className="form-label text-primary mb-2 block">
              Économies totales sur 10 ans
            </label>
            <FormInput
              label=""
              name="economiesRealisees10Ans"
              value={data.economiesRealisees10Ans}
              type="number"
              placeholder="0"
              suffix="€"
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default StepExponentiel;