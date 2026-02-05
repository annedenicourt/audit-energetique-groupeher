import React from "react";
import { Receipt, Wrench, HandCoins, FileText, Zap, ChartLine } from "lucide-react";
import FormInput from "../FormInput";
import FormTextarea from "../FormTextarea";
import SectionCard from "../SectionCard";
import { EvolutionData, FacturesData } from "@/types/formData";
import FormSelect from "../FormSelect";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";

interface StepEvolutionProps {
  data: EvolutionData;
  onChange: (field: keyof EvolutionData, value: string) => void;
}

const energieOptions = [
  { value: "electricite", label: "Électricité" },
  { value: "fioul", label: "Fioul" },
  { value: "gaz_ville", label: "Gaz de ville" },
  { value: "propane", label: "Propane" },
  { value: "bois", label: "Bois" },
  { value: "autre", label: "Autre" },
];
const StepEvolutionNrj: React.FC<StepEvolutionProps> = ({ data, onChange }) => {

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
          Évolution de la facture énergétique
        </h2>
      </div>
      {/* Répartition facture */}
      <SectionCard title="Répartition de la facture énergétique" icon={Zap}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Chauffage"
            name="montantChauffage"
            value={data.montantChauffage}
            onChange={(v) => onChange("montantChauffage", v)}
            type="number"
            placeholder="1200"
            suffix="€/an"
          />
          <FormInput
            label="Eau chaude sanitaire (ECS)"
            name="montantECS"
            value={data.montantECS}
            onChange={(v) => onChange("montantECS", v)}
            type="number"
            placeholder="400"
            suffix="€/an"
          />
          <FormInput
            label="Électricité domestique"
            name="montantElecDomestique"
            value={data.montantElecDomestique}
            onChange={(v) => onChange("montantElecDomestique", v)}
            type="number"
            placeholder="800"
            suffix="€/an"
          />
        </div>
        <div className="mt-4">
          <FormSelect
            label="Énergie actuelle du logement"
            name="energieActuelle"
            value={data.energieActuelle}
            onChange={(v) => onChange("energieActuelle", v)}
            options={energieOptions}
          />
        </div>
      </SectionCard>

      {/* Projection des coûts - APRES travaux */}
      <SectionCard title="Projection d'évolution des coûts de l'énergie" icon={ChartLine}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Facture aujourd'hui"
            name="coutNrjAujourdhui"
            value={data.coutNrjAujourdhui}
            onChange={(v) => onChange("coutNrjAujourdhui", v)}
            type="number"
            placeholder="2500"
            suffix="€/an"
          />
          <FormInput
            label="Estimation + 5 ans"
            name="coutNrj5Ans"
            value={data.coutNrj5Ans}
            onChange={(v) => onChange("coutNrj5Ans", v)}
            type="number"
            placeholder="3350"
            suffix="€/an"
          />
          <FormInput
            label="Estimation + 10 ans"
            name="coutNrj10Ans"
            value={data.coutNrj10Ans}
            onChange={(v) => onChange("coutNrj10Ans", v)}
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
          label="Dépense totale cumulée sur 10 ans"
          name="depenseTotal10ans"
          value={data.depenseTotal10ans}
          onChange={(v) => onChange("depenseTotal10ans", v)}
          type="number"
          placeholder="16000"
          suffix="€"
        />

        <p className="text-xs text-muted-foreground mt-3">
          Hypothèse : augmentation moyenne estimée à 6% par an sur une durée de 10 ans
        </p>
      </SectionCard>

      {/* Notes */}
      <SectionCard title="Notes / Remarques" icon={FileText}>
        <FormTextarea
          label="Observations complémentaires"
          name="notes"
          value={data.notes}
          onChange={(v) => onChange("notes", v)}
          placeholder="Ajoutez ici toutes les observations importantes..."
          rows={12}
        />
      </SectionCard>





    </div>
  );
};

export default StepEvolutionNrj;