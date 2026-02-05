import React from "react";
import { TrendingUp, Sun, Thermometer } from "lucide-react";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import SectionCard from "../SectionCard";
import { ScenariosData, ScenarioData } from "@/types/formData";

interface StepScenariosProps {
  data: ScenariosData;
  onChange: (field: keyof ScenariosData | string, value: string | ScenarioData) => void;
}

const lettreOptions = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "E", label: "E" },
];

// Composant pour un scénario individuel
const ScenarioCard: React.FC<{
  title: string;
  scenario: ScenarioData;
  onChange: (field: keyof ScenarioData, value: string) => void;
  color: string;
}> = ({ title, scenario, onChange, color }) => (
  <div className={`p-5 rounded-lg border-2 ${color}`}>
    <h4 className="font-semibold text-foreground mb-4">{title}</h4>
    <div className="space-y-3">
      <FormInput
        label="Nom du scénario"
        name={`${title}-nom`}
        value={scenario.nom}
        onChange={(v) => onChange("nom", v)}
        placeholder="Ex: Pompe à chaleur + isolation"
      />
      <FormInput
        label="Plus-value du logement"
        name={`${title}-plusvalue`}
        value={scenario.plusValueLogement}
        onChange={(v) => onChange("plusValueLogement", v)}
        type="number"
        placeholder="15000"
        suffix="€"
      />
      <FormInput
        label="Facture énergétique après travaux"
        name={`${title}-facture`}
        value={scenario.factureApres}
        onChange={(v) => onChange("factureApres", v)}
        type="number"
        placeholder="1200"
        suffix="€/an"
      />
      <FormSelect
        label="Lettre énergétique après travaux"
        name={`${title}-lettre`}
        value={scenario.lettreApres}
        onChange={(v) => onChange("lettreApres", v)}
        options={lettreOptions}
      />
    </div>
  </div>
);

const StepScenarios: React.FC<StepScenariosProps> = ({ data, onChange }) => {
  // Helper pour mettre à jour un scénario spécifique
  const updateScenario = (
    scenarioKey: "scenario1" | "scenario2" | "scenario3",
    field: keyof ScenarioData,
    value: string
  ) => {
    const updated = { ...data[scenarioKey], [field]: value };
    onChange(scenarioKey, updated);
  };

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Scénarios
        </h2>
      </div>

      {/* Scénarios proposés */}
      <SectionCard title="Scénarios proposés" icon={TrendingUp}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ScenarioCard
            title="Scénario 1"
            scenario={data.scenario1}
            onChange={(field, value) => updateScenario("scenario1", field, value)}
            color="border-primary/30 bg-primary/5"
          />
          <ScenarioCard
            title="Scénario 2"
            scenario={data.scenario2}
            onChange={(field, value) => updateScenario("scenario2", field, value)}
            color="border-accent/30 bg-accent/5"
          />
          <ScenarioCard
            title="Scénario 3"
            scenario={data.scenario3}
            onChange={(field, value) => updateScenario("scenario3", field, value)}
            color="border-secondary-foreground/20 bg-secondary/50"
          />
        </div>
      </SectionCard>
    </div>
  );
};

export default StepScenarios;