import React from "react";
import { Receipt, Wrench, HandCoins, FileText, Zap } from "lucide-react";
import FormInput from "../FormInput";
import FormTextarea from "../FormTextarea";
import SectionCard from "../SectionCard";
import { EvolutionData, FacturesData } from "@/types/formData";
import FormSelect from "../FormSelect";

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
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Évolution de la facture énergétique
        </h2>
        <p className="text-muted-foreground">
          Dépenses énergétiques et travaux réalisés
        </p>
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

      {/* Notes */}
      <SectionCard title="Notes / Remarques" icon={FileText}>
        <FormTextarea
          label="Observations complémentaires"
          name="notes"
          value={data.notes}
          onChange={(v) => onChange("notes", v)}
          placeholder="Ajoutez ici toutes les observations importantes..."
          rows={4}
        />
      </SectionCard>





    </div>
  );
};

export default StepEvolutionNrj;