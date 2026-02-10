import React from "react";
import { Wallet, Users, Calculator, SquareArrowOutUpRight } from "lucide-react";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import SectionCard from "../SectionCard";
import { AidesData } from "@/types/formData";
import { plafondsData, nbrePersonnesOptions, categorieOptions } from "@/utils/handleForm";

interface StepAidesProps {
  data: AidesData;
  onChange: (field: keyof AidesData, value: string) => void;
  ecoEstimees10ans: string;
}

const StepAides: React.FC<StepAidesProps> = ({ data, onChange, ecoEstimees10ans }) => {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Calcul des aides
        </h2>
        <p className="text-muted-foreground">
          MaPrimeRénov' & CEE - Estimation des aides disponibles
        </p>
      </div>

      {/* Tableau des plafonds */}
      <SectionCard title="Plafonds de ressources (référence MaPrimeRénov')" icon={Calculator}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Personnes</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Très modestes</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Modestes</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Intermédiaires</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Supérieurs</th>
              </tr>
            </thead>
            <tbody>
              {plafondsData.map((row) => (
                <tr key={row.personnes} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">{row.personnes}</td>
                  <td className="py-3 px-4 text-muted-foreground"> {row.personnes === "Par personne supplémentaire" ? "" : "≤"}  {row.tresModestes}</td>
                  <td className="py-3 px-4 text-muted-foreground">{row.personnes === "Par personne supplémentaire" ? "" : "≤"} {row.modestes}</td>
                  <td className="py-3 px-4 text-muted-foreground">{row.personnes === "Par personne supplémentaire" ? "" : "≤"} {row.intermediaires}</td>
                  <td className="py-3 px-4 text-muted-foreground">{row.personnes === "Par personne supplémentaire" ? "" : "≤"} {row.superieurs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Informations foyer */}
      <SectionCard title="Informations du foyer" icon={Users}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormSelect
            label="Nombre de personnes dans le foyer"
            name="nbrePersonnesFoyer"
            value={data.nbrePersonnesFoyer}
            onChange={(v) => onChange("nbrePersonnesFoyer", v)}
            options={nbrePersonnesOptions}
          />
          <FormInput
            label="Dernier RFR (Revenu Fiscal de Référence)"
            name="dernierRFR"
            value={data.dernierRFR}
            onChange={(v) => onChange("dernierRFR", v)}
            type="number"
            placeholder="0"
            suffix="€"
          />
          <FormSelect
            label="Catégorie de revenus"
            name="categorieRevenus"
            value={data.categorieRevenus}
            onChange={(v) => onChange("categorieRevenus", v)}
            options={categorieOptions}
          />
        </div>
        <div className="mt-6 flex text-sm font-bold">
          <a href="https://www.prime-energie-edf.fr/je-simule-ma-prime" target="_blank" title="Accéder au simulateur EDF">Simulateur EDF</a>
          <SquareArrowOutUpRight size={18} className="ml-1" />
        </div>
        <div className="flex text-sm font-bold">
          <a href="https://drive.google.com/drive/u/1/folders/1_ZmlAL9VmCcvniJle6clxzp4pf04S-ww" target="_blank">Tableau prime avec plafond</a>
          <SquareArrowOutUpRight size={18} className="ml-1" />
        </div>
        <div className="flex text-sm font-bold">
          <a href="https://drive.google.com/drive/u/1/folders/1mfTypbHZmEhCsQuF-x7esMZBXYDky8Lj" target="_blank">MaPrimeRenov'</a>
          <SquareArrowOutUpRight size={18} className="ml-1" />
        </div>
      </SectionCard>

      {/* Synthèse financière */}
      <SectionCard title="Synthèse financière sur 10 ans" icon={Wallet} link="https://devis-groupeher-enr.fr/home" textLink="Faire un devis">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="">
            <FormInput
              label="Coût total de l'installation"
              name="coutTotalInstallation"
              value={data.coutTotalInstallation}
              onChange={(v) => onChange("coutTotalInstallation", v)}
              type="number"
              placeholder="0"
              suffix="€"
              className="mb-4"
            />
            <FormInput
              label="Prime CEE déduite (sous conditions)"
              name="primeCEE"
              value={data.primeCEE}
              onChange={(v) => onChange("primeCEE", v)}
              type="number"
              placeholder="0"
              suffix="€"
              className="mb-4"
            />
            <FormInput
              label="MaPrimeRénov' (non déduite)"
              name="maPrimeRenov"
              value={data.maPrimeRenov}
              onChange={(v) => onChange("maPrimeRenov", v)}
              type="number"
              placeholder="0"
              suffix="€"
            />
          </div>
          <div>
            <FormInput
              label="Reste à charge après MaPrimeRénov'"
              name="resteACharge"
              value={data.resteACharge}
              type="number"
              placeholder="0"
              suffix="€"
              className="mb-4"
              readonly={true}
            />
            <FormInput
              label="Économies estimées sur 10 ans"
              name="economiesSur10Ans"
              value={ecoEstimees10ans}
              type="number"
              placeholder="0"
              suffix="€"
              className="mb-4"
              readonly={true}
            />
            <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <label className="form-label text-primary">Gain sur 10 ans</label>
              <FormInput
                label=""
                name="gainSur10Ans"
                value={data.gainSur10Ans}
                type="number"
                placeholder="0"
                suffix="€"
                readonly={true}
              />
            </div>
          </div>
        </div>
        <div className="mt-8 text-xs text-center font-bold text-muted-foreground">
          Hypothèse : augmentation moyenne estimée à 6% par an sur une durée de 10 ans (source CRE)
        </div>
      </SectionCard>

      {/* Note d'information */}
      <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
        <p className="text-sm text-foreground">
          <strong>Note :</strong> MaPrimeRénov' est présentée à titre indicatif et n'est pas déduite du coût du projet.
          La prime CEE peut être déduite sous conditions d'éligibilité.
        </p>
      </div>
    </div>
  );
};

export default StepAides;