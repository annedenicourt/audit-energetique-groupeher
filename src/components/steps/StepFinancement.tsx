import React, { useState } from "react";
import { Banknote, LineChart, CheckCircle2 } from "lucide-react";
import FormInput from "../FormInput";
import SectionCard from "../SectionCard";
import { FinancementData } from "@/types/formData";
import { Chronologie } from "../Chronologie";

interface StepFinancementProps {
  data: FinancementData;
  onChange: (field: keyof FinancementData, value: string) => void;
  economiesMensuellesMoyennes: string;
}

const StepFinancement: React.FC<StepFinancementProps> = ({ data, onChange, economiesMensuellesMoyennes }) => {

  return (
    <div className="">
      {/* Page title */}
      <div className="mb-16">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Écofinancement & Synthèse
        </h2>
        <p className="text-muted-foreground">
          Transfert de charge et projection des économies
        </p>
      </div>
      {/* Frise */}
      <Chronologie data={data} onChange={(v) => onChange("mensualiteConfort", v)} />
      {/* Transfert de charge */}
      <SectionCard title="Transfert de charge" icon={Banknote}>
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Mensualité de confort"
              name="mensualiteConfort"
              value={data.mensualiteConfort}
              type="number"
              placeholder="0"
              suffix="€"
              readonly={true}
            />
            <FormInput
              label="Économies moyennes mensuelles sur 10 ans"
              name="economiesMoyennesMensuelles"
              value={economiesMensuellesMoyennes}
              type="number"
              placeholder="0"
              suffix="€"
              readonly={true}
            />
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="font-bold">Gain ou faible effort financier</div>
              <FormInput
                label=""
                name="mensualiteMoinsEconomies"
                value={data.mensualiteMoinsEconomies}
                onChange={(v) => onChange("mensualiteMoinsEconomies", v)}
                type="number"
                placeholder="0"
                suffix="€/mois"
                readonly={true}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Avantages écofinancement */}
      <div className="mt-8 p-6 bg-secondary rounded-xl border border-border">
        <h4 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          Les avantages de l'écofinancement
        </h4>
        <ul className="space-y-3 text-sm text-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Possibilité de régler comptant sans frais en fin de chantier, sans engagement de financement</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Pack Sécurité 6 mois pour ne pas avancer MaPrimeRénov' et CEE tout en commençant à réaliser des économies</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Possibilité de solder tout ou partiellement sans frais jusqu'à 10 000 €</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Si montant supérieur à 10 000 €, frais limités à 1% pris en charge par Groupe HER-ENR</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StepFinancement;