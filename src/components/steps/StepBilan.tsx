import React from "react";
import { BarChart3, ThermometerSun, FileText, Zap } from "lucide-react";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import FormTextarea from "../FormTextarea";
import SectionCard from "../SectionCard";
import { BilanData } from "@/types/formData";

interface StepBilanProps {
  data: BilanData;
  onChange: (field: keyof BilanData, value: string) => void;
}

const classeOptions = [
  { value: "A", label: "A - Très performant" },
  { value: "B", label: "B - Performant" },
  { value: "C", label: "C - Assez performant" },
  { value: "D", label: "D - Moyennement performant" },
  { value: "E", label: "E - Peu performant" },
  { value: "F", label: "F - Passoire énergétique" },
  { value: "G", label: "G - Passoire énergétique" },
];

const etatOptions = [
  { value: "bon", label: "Bon état" },
  { value: "moyen", label: "État moyen" },
  { value: "mauvais", label: "Mauvais état" },
  { value: "a_renover", label: "À rénover" },
  { value: "non_existant", label: "Non existant" },
];

const energieOptions = [
  { value: "electricite", label: "Électricité" },
  { value: "fioul", label: "Fioul" },
  { value: "gaz_ville", label: "Gaz de ville" },
  { value: "propane", label: "Propane" },
  { value: "bois", label: "Bois" },
  { value: "autre", label: "Autre" },
];

const StepBilan: React.FC<StepBilanProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Bilan & Classe énergétique
        </h2>
      </div>

      {/* Situation actuelle */}
      <SectionCard title="Situation actuelle du logement" icon={BarChart3}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormSelect
            label="Classe énergétique (DPE)"
            name="classeEnergetique"
            value={data.classeEnergetique}
            onChange={(v) => onChange("classeEnergetique", v)}
            options={classeOptions}
          />
          <FormInput
            label="Consommation actuelle"
            name="consommationActuelle"
            value={data.consommationActuelle}
            onChange={(v) => onChange("consommationActuelle", v)}
            type="number"
            placeholder="250"
            suffix="kWh/m²/an"
          />
          <FormInput
            label="Facture énergétique annuelle"
            name="factureAnnuelle"
            value={data.factureAnnuelle}
            onChange={(v) => onChange("factureAnnuelle", v)}
            type="number"
            placeholder="2500"
            suffix="€/an"
          />
        </div>
      </SectionCard>

      {/* Analyse des postes */}
      <SectionCard title="Analyse des postes énergétiques" icon={ThermometerSun}>
        <div className="space-y-4">
          {/* Isolation combles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-border">
            <FormSelect
              label="Isolation des combles"
              name="isolationCombles"
              value={data.isolationCombles}
              onChange={(v) => onChange("isolationCombles", v)}
              options={etatOptions}
            />
            <div className="md:col-span-2">
              <FormInput
                label="Commentaires"
                name="isolationComblesCommentaire"
                value={data.isolationComblesCommentaire}
                onChange={(v) => onChange("isolationComblesCommentaire", v)}
                placeholder="Observations..."
              />
            </div>
          </div>

          {/* Isolation murs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-border">
            <FormSelect
              label="Isolation des murs"
              name="isolationMurs"
              value={data.isolationMurs}
              onChange={(v) => onChange("isolationMurs", v)}
              options={etatOptions}
            />
            <div className="md:col-span-2">
              <FormInput
                label="Commentaires"
                name="isolationMursCommentaire"
                value={data.isolationMursCommentaire}
                onChange={(v) => onChange("isolationMursCommentaire", v)}
                placeholder="Observations..."
              />
            </div>
          </div>

          {/* Menuiseries */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-border">
            <FormSelect
              label="Menuiseries / ouvertures"
              name="menuiseries"
              value={data.menuiseries}
              onChange={(v) => onChange("menuiseries", v)}
              options={etatOptions}
            />
            <div className="md:col-span-2">
              <FormInput
                label="Commentaires"
                name="menuiseriesCommentaire"
                value={data.menuiseriesCommentaire}
                onChange={(v) => onChange("menuiseriesCommentaire", v)}
                placeholder="Observations..."
              />
            </div>
          </div>

          {/* Chauffage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-border">
            <FormSelect
              label="Chauffage principal"
              name="chauffagePrincipal"
              value={data.chauffagePrincipal}
              onChange={(v) => onChange("chauffagePrincipal", v)}
              options={etatOptions}
            />
            <div className="md:col-span-2">
              <FormInput
                label="Commentaires"
                name="chauffagePrincipalCommentaire"
                value={data.chauffagePrincipalCommentaire}
                onChange={(v) => onChange("chauffagePrincipalCommentaire", v)}
                placeholder="Observations..."
              />
            </div>
          </div>

          {/* ECS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-border">
            <FormSelect
              label="Eau chaude sanitaire"
              name="eauChaudeSanitaire"
              value={data.eauChaudeSanitaire}
              onChange={(v) => onChange("eauChaudeSanitaire", v)}
              options={etatOptions}
            />
            <div className="md:col-span-2">
              <FormInput
                label="Commentaires"
                name="eauChaudeSanitaireCommentaire"
                value={data.eauChaudeSanitaireCommentaire}
                onChange={(v) => onChange("eauChaudeSanitaireCommentaire", v)}
                placeholder="Observations..."
              />
            </div>
          </div>

          {/* Ventilation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormSelect
              label="Ventilation"
              name="ventilation"
              value={data.ventilation}
              onChange={(v) => onChange("ventilation", v)}
              options={etatOptions}
            />
            <div className="md:col-span-2">
              <FormInput
                label="Commentaires"
                name="ventilationCommentaire"
                value={data.ventilationCommentaire}
                onChange={(v) => onChange("ventilationCommentaire", v)}
                placeholder="Observations..."
              />
            </div>
          </div>
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
          rows={12}
        />
      </SectionCard>
    </div>
  );
};

export default StepBilan;