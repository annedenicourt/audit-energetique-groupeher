import React from "react";
import { TrendingUp, Sun, Thermometer, Banknote, ChartLine } from "lucide-react";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import SectionCard from "../SectionCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";
import { ScenariosData, ScenarioData, DimensionnementData, ExponentielData } from "@/types/formData";

interface StepExponentielProps {
  data: ExponentielData;
  onChange: (field: keyof ExponentielData | string, value: string | ExponentielData) => void;

}

const StepExponentiel: React.FC<StepExponentielProps> = ({ data, onChange }) => {

  const ChartData = [
    { name: "Aujourd’hui", value: 50 },
    { name: "5 ans", value: 150 },
    { name: "10 ans", value: 240 },
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Facture aujourd'hui"
            name="factureAujourdhui"
            value={data.factureAujourdhui}
            onChange={(v) => onChange("factureAujourdhui", v)}
            type="number"
            placeholder="2500"
            suffix="€/an"
          />
          <FormInput
            label="Estimation + 5 ans"
            name="facture5Ans"
            value={data.facture5Ans}
            onChange={(v) => onChange("facture5Ans", v)}
            type="number"
            placeholder="3350"
            suffix="€/an"
          />
          <FormInput
            label="Estimation + 10 ans"
            name="facture10Ans"
            value={data.facture10Ans}
            onChange={(v) => onChange("facture10Ans", v)}
            type="number"
            placeholder="4480"
            suffix="€/an"
          />
        </div>
        <div style={{ width: "100%", height: 200, overflow: "visible" }}>
          <ResponsiveContainer>
            <LineChart data={ChartData} margin={{ left: 24, right: 10, top: 10, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                axisLine
                tickLine={false}
                padding={{ left: 16, right: 16 }}
                interval={0}
              />
              <YAxis hide />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <FormInput
          label="Consommation énergétique sur 10 ans (après travaux)"
          name="consommation10AnsApresTravaux"
          value={data.consommation10AnsApresTravaux}
          onChange={(v) => onChange("consommation10AnsApresTravaux", v)}
          type="number"
          placeholder="16000"
          suffix="€"
        />

        <p className="text-xs font-bold text-muted-foreground mt-3">
          Hypothèse : augmentation moyenne estimée à 6% par an sur une durée de 10 ans
        </p>
      </SectionCard>

      {/* Synthèse des économies */}
      <SectionCard title="Synthèse des économies réalisées" icon={Banknote}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Consommation sur 10 ans (sans travaux)"
            name="consommation10AnsSansTravaux"
            value={data.consommation10AnsSansTravaux}
            onChange={(v) => onChange("consommation10AnsSansTravaux", v)}
            type="number"
            placeholder="35000"
            suffix="€"
          />
          <FormInput
            label="Consommation sur 10 ans (après travaux)"
            name="consommation10AnsApresTravaux"
            value={data.consommation10AnsApresTravaux}
            onChange={(v) => onChange("consommation10AnsApresTravaux", v)}
            type="number"
            placeholder="16000"
            suffix="€"
          />
          <div className="space-y-4">
            <FormInput
              label="Économies annuelles moyennes"
              name="economiesAnnuellesMoyennes"
              value={data.economiesAnnuellesMoyennes}
              onChange={(v) => onChange("economiesAnnuellesMoyennes", v)}
              type="number"
              placeholder="1900"
              suffix="€/an"
            />
            <FormInput
              label="Économies mensuelles moyennes"
              name="economiesMensuellesMoyennes"
              value={data.economiesMensuellesMoyennes}
              onChange={(v) => onChange("economiesMensuellesMoyennes", v)}
              type="number"
              placeholder="158"
              suffix="€/mois"
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
              onChange={(v) => onChange("economiesRealisees10Ans", v)}
              type="number"
              placeholder="19000"
              suffix="€"
            />
          </div>

        </div>
      </SectionCard>
    </div>
  );
};

export default StepExponentiel;