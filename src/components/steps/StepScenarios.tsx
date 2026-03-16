import React from "react";
import { TrendingUp, Sun, Thermometer, CircleAlert } from "lucide-react";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import SectionCard from "../SectionCard";
import { ScenariosData, ScenarioData } from "@/types/formData";
import { lettreOptions } from "@/utils/handleForm";

interface StepScenariosProps {
  data: ScenariosData;
  onChange: (field: keyof ScenariosData | string, value: string | ScenarioData) => void;
}

// Composant pour un scénario individuel
const ScenarioCard: React.FC<{
  title: string;
  scenario: ScenarioData;
  onChange?: (field: keyof ScenarioData, value: string) => void;
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
        placeholder=""
      />
      <FormInput
        label="Plus-value du logement"
        name={`${title}-plusvalue`}
        value={scenario.plusValueLogement}
        onChange={(v) => onChange("plusValueLogement", v)}
        type="number"
        min={"0"}
        placeholder="0"
        suffix="%"
      />
      <FormInput
        label="Économies"
        name={`${title}-plusvalue`}
        value={scenario.economieAnnuelle}
        onChange={(v) => onChange("economieAnnuelle", v)}
        type="number"
        min={"0"}
        placeholder="0"
        suffix="%"
      />
      <FormInput
        label="Facture énergétique après travaux"
        name={`${title}-facture`}
        value={scenario.factureApres}
        type="number"
        min={"0"}
        placeholder="0"
        suffix="€/an"
        readonly={true}
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

  const hasAtLeastOneScenario = (): boolean => {
    if (!data.scenario1 || typeof data.scenario1 !== "object") return false;

    return Object.values(data).some((scenario: ScenarioData) =>
      scenario &&
      (scenario.nom !== "" ||
        scenario.lettreApres !== "" ||
        scenario.economieAnnuelle !== "")
    );
  };

  console.log(data)
  console.log(hasAtLeastOneScenario())

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Résultat audit après travaux
        </h2>
        <div className="text-xs text-red-500">* champs obligatoires</div>
      </div>

      {/* Scénarios proposés */}
      <SectionCard title="Scénarios proposés" icon={TrendingUp}>
        <button className="mb-4 py-1 px-2 flex items-center font-semibold text-sm text-white bg-orange-500 rounded-md gap-2 cursor-default">
          <CircleAlert />
          Merci de renseigner au moins un scénario
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ScenarioCard
            title="Scénario 1 * (obligatoire)"
            scenario={data.scenario1}
            onChange={(field, value) => updateScenario("scenario1", field, value)}
            color={`${!hasAtLeastOneScenario() && "border-dotted border-red-500 bg-primary/5"}`}
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