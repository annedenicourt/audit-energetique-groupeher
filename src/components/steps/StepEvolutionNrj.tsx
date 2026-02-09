import React from "react";
import { Receipt, Wrench, HandCoins, FileText, Zap, ChartLine } from "lucide-react";
import FormInput from "../FormInput";
import FormTextarea from "../FormTextarea";
import SectionCard from "../SectionCard";
import { EvolutionData } from "@/types/formData";
import FormSelect from "../FormSelect";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Bar,
  BarChart,
  Cell
} from "recharts";
import { energieOptions } from "@/utils/handleForm";


interface StepEvolutionProps {
  data: EvolutionData;
  onChange: (field: keyof EvolutionData, value: string) => void;
}


const StepEvolutionNrj: React.FC<StepEvolutionProps> = ({ data, onChange }) => {

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
          Évolution de la facture énergétique
        </h2>
      </div>
      {/* Répartition facture */}
      <SectionCard title="Répartition de la facture énergétique" icon={Zap}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormInput
            label="Chauffage"
            name="montantChauffage"
            value={data.montantChauffage}
            onChange={(v) => onChange("montantChauffage", v)}
            type="number"
            placeholder="0"
            suffix="€/an"
          />
          <FormInput
            label="Eau chaude sanitaire (ECS)"
            name="montantECS"
            value={data.montantECS}
            onChange={(v) => onChange("montantECS", v)}
            type="number"
            placeholder="0"
            suffix="€/an"
          />
          <FormInput
            label="Électricité domestique"
            name="montantElecDomestique"
            value={data.montantElecDomestique}
            onChange={(v) => onChange("montantElecDomestique", v)}
            type="number"
            placeholder="0"
            suffix="€/an"
          />
          <FormInput
            label="Total"
            name="totalFactureNRJ"
            value={data.totalFactureNRJ}
            type="number"
            placeholder="0"
            suffix="€/an"
            readonly={true}
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

      {/* Projection évolution des coûts - avant travaux */}
      <SectionCard title="Projection d'évolution des coûts de l'énergie (avant travaux)" icon={ChartLine}>
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
              name="coutNrjAujourdhui"
              value={data.coutNrjAujourdhui}
              onChange={(v) => onChange("coutNrjAujourdhui", v)}
              type="number"
              placeholder="0"
              suffix="€/an"
            />
            <FormInput
              label="Estimation + 5 ans"
              name="coutNrj5Ans"
              value={data.coutNrj5Ans}
              type="text"
              placeholder="0"
              suffix="€/an"
              readonly={true}
            />
            <FormInput
              label="Estimation + 10 ans"
              name="coutNrj10Ans"
              value={data.coutNrj10Ans}
              type="text"
              placeholder="0"
              suffix="€/an"
              readonly={true}
            />
          </div>

        </div>
        <FormInput
          label="Dépense totale cumulée sur 10 ans"
          name="depenseTotal10ans"
          value={data.depenseTotal10ans}
          type="text"
          placeholder="0"
          suffix="€"
          className="mt-6"
          readonly={true}
        />

        <p className="mt-3 font-bold text-center text-xs text-muted-foreground">
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