import React, { useEffect } from "react";
import { Wallet, Users, Calculator, SquareArrowOutUpRight } from "lucide-react";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import SectionCard from "../SectionCard";
import { AidesData } from "@/types/formData";
import { plafondsData, nbrePersonnesOptions, plafondParPersonneSupp } from "@/utils/handleForm";
import SimulMpr from "@/pages/SimulMpr";
import { useNavigate } from "react-router-dom";

interface StepAidesProps {
  data: AidesData;
  onChange: (field: keyof AidesData, value: string) => void;
  ecoEstimees10ans: string;
  dispoMPR: string;
  currentStep: number,
}

const StepAides: React.FC<StepAidesProps> = ({ data, onChange, ecoEstimees10ans, dispoMPR, currentStep }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const nbPers = Number(data.nbrePersonnesFoyer);
    const rfr = Number(data.dernierRFR);

    if (!nbPers || !Number.isFinite(rfr)) return;

    const base = plafondsData.find((item) => item.personnes === nbPers) ?? plafondsData[plafondsData.length - 1];
    const extra = Math.max(0, nbPers - plafondsData[plafondsData.length - 1].personnes);

    const seuilTres = base.tres + extra * plafondParPersonneSupp.tres;
    const seuilMod = base.mod + extra * plafondParPersonneSupp.mod;
    const seuilInter = base.inter + extra * plafondParPersonneSupp.inter;

    const cat =
      rfr <= seuilTres ? "Très modestes" :
        rfr <= seuilMod ? "Modestes" :
          rfr <= seuilInter ? "Intermédiaires" :
            "Supérieurs";

    if (data.categorieRevenus !== cat) onChange("categorieRevenus", cat);
  }, [data.nbrePersonnesFoyer, data.dernierRFR, data.categorieRevenus, onChange]);

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Calcul des aides
          </h2>
          <div className="text-xs text-red-500">* champs obligatoires</div>
        </div>
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
                <th className="w-1/5 text-left py-3 px-4 font-semibold text-foreground">Personnes</th>
                <th className="w-1/5 text-center py-3 font-semibold text-foreground">Très modestes</th>
                <th className="w-1/5 text-center py-3 font-semibold text-foreground">Modestes</th>
                <th className="w-1/5 text-center py-3 font-semibold text-foreground">Intermédiaires</th>
                <th className="w-1/5 text-center py-3 font-semibold text-foreground">Supérieurs</th>
              </tr>
            </thead>
            <tbody>
              {plafondsData.map((row) => (
                <tr key={row.personnes} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="py-3 font-medium">{row.personnes}</td>
                  <td className="py-3 bg-cyan-100 text-center text-muted-foreground"> {row.personnes > 5 ? "" : "≤"}  {row.tres} €</td>
                  <td className="py-3 bg-amber-100 text-center text-muted-foreground">{row.personnes > 5 ? "" : "≤"} {row.mod} €</td>
                  <td className="py-3 bg-violet-100 text-center text-muted-foreground">{row.personnes > 5 ? "" : "≤"} {row.inter} €</td>
                  <td className="py-3 bg-red-100 text-center text-muted-foreground">{row.personnes > 5 ? "" : "≤"} {row.sup} €</td>
                </tr>
              ))}
              {/* Ligne personne supplémentaire */}
              <tr className="border-b border-border/50 hover:bg-muted/50">
                <td className="py-3">Par personne supplémentaire</td>
                <td className="py-3 bg-cyan-100 text-center text-muted-foreground">
                  + {plafondParPersonneSupp.tres} €
                </td>
                <td className="py-3 bg-amber-100 text-center text-muted-foreground">
                  + {plafondParPersonneSupp.mod} €
                </td>
                <td className="py-3 bg-violet-100 text-center text-muted-foreground">
                  + {plafondParPersonneSupp.inter} €
                </td>
                <td className="py-3 bg-red-100 text-center text-muted-foreground">
                  + {plafondParPersonneSupp.sup} €
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Simulateur CEE EDF */}
      <SectionCard title="Simulation CEE EDF (tous produits)" icon={Calculator} legend="Obligatoire"
      >
        <div className="ml-7 -mt-4 text-xs">CEE déduite uniquement pour PAC air-eau</div>
        <div className="mt-6 flex text-sm font-bold">
          <a href="https://www.prime-energie-edf.fr/je-simule-ma-prime" target="_blank" title="Accéder au simulateur EDF">Accéder au simulateur EDF</a>
          <SquareArrowOutUpRight size={18} className="ml-1" />
        </div>
      </SectionCard>

      {/* Simulateur  */}
      <SectionCard title="Tableau prime CEE BTD déduite" icon={Calculator} legend="Obligatoire">
        <div className="flex text-sm font-bold">
          <a href="https://drive.google.com/drive/u/1/folders/1_ZmlAL9VmCcvniJle6clxzp4pf04S-ww" target="_blank">Tableau prime BTD</a>
          <SquareArrowOutUpRight size={18} className="ml-1" />
        </div>
      </SectionCard>

      {/* Simulateur MPR */}
      <SectionCard title="Simulation MaPrimeRénov' 2026 — Monogeste" icon={Calculator} legend="Obligatoire">
        <div className="mt-6 flex text-sm font-bold cursor-pointer" onClick={() => navigate(`/simulateur-mpr`, { state: { returnStep: currentStep } })}>
          Accéder au simulateur MaPrimeRénov'
          <SquareArrowOutUpRight size={18} className="ml-1" />
        </div>
        <div className="flex text-sm font-bold">
          <a href="https://drive.google.com/drive/u/1/folders/1mfTypbHZmEhCsQuF-x7esMZBXYDky8Lj" target="_blank">Texte officiel MaPrimeRenov'</a>
          <SquareArrowOutUpRight size={18} className="mx-1" />
          À envoyer par mail au client
        </div>
      </SectionCard>

      {/* Synthèse financière */}
      <SectionCard
        title="Synthèse financière sur 10 ans"
        icon={Wallet}
        link={[
          "https://devis-groupeher-enr.fr/home",
        ]}
        textLink={["Faire un devis"]}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="">
            <FormInput
              label="Coût total de l'installation"
              name="coutTotalInstallation"
              min={"0"}
              value={data.coutTotalInstallation}
              onChange={(v) => onChange("coutTotalInstallation", v)}
              type="number"
              placeholder="0"
              suffix="€"
              className="mb-4"
              isMissing={data.coutTotalInstallation === ""}
              required
            />
            <FormInput
              label="Prime CEE déduite (sous conditions)"
              name="primeCEE"
              min={"0"}
              value={data.primeCEE}
              onChange={(v) => onChange("primeCEE", v)}
              type="number"
              placeholder="0"
              suffix="€"
              className="mb-4"
              isMissing={data.primeCEE === ""}
              required
            />
            <FormInput
              label="Reste à charge AVANT MaPrimeRénov'"
              name="resteAChargeAvantMpr"
              min={"0"}
              value={data.resteAChargeAvantMpr}
              type="number"
              placeholder="0"
              suffix="€"
              readonly={true}
              isFocus={true}
            />
          </div>
          <div>
            <FormInput
              label="MaPrimeRénov'(non déduite)"
              name="maPrimeRenov"
              min={"0"}
              max={dispoMPR}
              value={data.maPrimeRenov}
              onChange={(v) => onChange("maPrimeRenov", v)}
              type="number"
              placeholder={`${dispoMPR} maxi`}
              suffix="€"
              className="mb-4"
              isMissing={data.maPrimeRenov === ""}
              required
            />
            <FormInput
              label="Reste à charge APRÈS MaPrimeRénov'"
              name="resteAChargeApresMpr"
              min={"0"}
              value={data.resteAChargeApresMpr}
              type="number"
              placeholder="0"
              suffix="€"
              className="mb-4"
              readonly={true}
              isFocus={true}
            />
            <FormInput
              label="Économies estimées sur 10 ans"
              name="economiesSur10Ans"
              min={"0"}
              value={ecoEstimees10ans}
              type="number"
              placeholder="0"
              suffix="€"
              className="mb-4"
              readonly={true}
              isFocus={true}
            />
          </div>
        </div>
        <div className="mt-8 text-xs text-center font-bold text-muted-foreground">
          Source CRE : augmentation moyenne estimée à 7% par an sur une durée de 10 ans
        </div>
      </SectionCard>
    </div>
  );
};

export default StepAides;