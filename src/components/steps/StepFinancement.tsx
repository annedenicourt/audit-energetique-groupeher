import React, { useEffect, useState } from "react";
import { Banknote, LineChart, CheckCircle2 } from "lucide-react";
import FormInput from "../FormInput";
import SectionCard from "../SectionCard";
import { FinancementData } from "@/types/formData";
import { Chronologie } from "../Chronologie";

interface StepFinancementProps {
  data: FinancementData;
  onChange: (field: keyof FinancementData, value: string) => void;
  economiesMensuellesMoyennes: string;
  aidesMaPrimeRenov: string;
  aidesCEE: string;
  economiesPremiereAnne: string;
  economies10eAnnee: string;
}

const StepFinancement: React.FC<StepFinancementProps> = ({ data, onChange, economiesMensuellesMoyennes, aidesMaPrimeRenov, aidesCEE, economiesPremiereAnne, economies10eAnnee }) => {

  const [isActive, setIsActive] = useState<string>("economies5eAnnee");
  const [resultCalc, setResultCalc] = useState<string>();

  const getBackground = (mensualite) => {
    let result = ""
    const numMensualite = Number(mensualite)
    if (mensualite && numMensualite >= -50) {
      result = "ring-lime-500"
    }
    return result
  }


  useEffect(() => {
    let result = 0
    if (isActive === "economiesPremiereAnnee") {
      result = Number(economiesPremiereAnne) - Number(data.mensualiteConfort)
      //setIsActive("economiesPremiereAnne")
    } else if (isActive === "economies10eAnnee") {
      result = Number(economies10eAnnee) - Number(data.mensualiteConfort)
      //setIsActive("economies10eAnnee")
    } else {
      result = Number(economiesMensuellesMoyennes) - Number(data.mensualiteConfort)
    }
    setResultCalc(Math.round(result).toString())

  }, [data.mensualiteConfort, economies10eAnnee, economiesMensuellesMoyennes, economiesPremiereAnne, isActive])

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
      <Chronologie data={data} onChange={onChange} aidesMaPrimeRenov={aidesMaPrimeRenov} aidesCEE={aidesCEE} />
      {/* Transfert de charge */}
      <SectionCard title="Transfert de charge" icon={Banknote}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="mt-0 md:mt-14 lg:mt-8 flex items-center">
            <FormInput
              label="Mensualité de confort"
              name="mensualiteConfort"
              value={data.mensualiteConfort}
              type="number"
              placeholder="0"
              suffix="€"
              readonly={true}
            />
          </div>
          <div>
            <div className="mb-4 text-sm font-semibold">Économies moyennes mensuelles sur 10 ans </div>
            <div onClick={() => setIsActive("economiesPremiereAnnee")}>
              <div className="form-label">La 1ère année</div>
              <div className={`my-3 flex items-center justify-between form-input bg-muted cursor-pointer  ${isActive === "economiesPremiereAnnee" && "ring ring-offset-2 ring-lime-500"}`}>
                <span>{economiesPremiereAnne || 0}</span>
                <span className="text-muted-foreground text-sm font-medium">€</span>
              </div>
            </div>
            <div onClick={() => setIsActive("economies5eAnnee")}>
              <div className="form-label">La 5e année</div>
              <div className={`my-3 flex items-center justify-between form-input bg-muted cursor-pointer  ${isActive === "economies5eAnnee" && "ring ring-offset-2 ring-lime-500"}`}>
                <span>{economiesMensuellesMoyennes || 0}</span>
                <span className="text-muted-foreground text-sm font-medium">€</span>
              </div>
            </div>
            <div onClick={() => setIsActive("economies10eAnnee")}>
              <div className="form-label">La 10e année</div>
              <div className={`mt-3 flex items-center justify-between form-input bg-muted cursor-pointer  ${isActive === "economies10eAnnee" && "ring ring-offset-2 ring-lime-500"}`}>
                <span>{economies10eAnnee || 0}</span>
                <span className="text-muted-foreground text-sm font-medium">€</span>
              </div>
            </div>
          </div>
          <div className={`flex flex-col justify-center items-center`}>
            <div className="font-bold">Gain financier</div>
            <div className="mt-0 md:mt-14 lg:mt-8">
              <FormInput
                label=""
                name="mensualiteMoinsEconomies"
                value={resultCalc}
                // onChange={(v) => onChange("mensualiteMoinsEconomies", v)}
                type="number"
                placeholder="0"
                suffix="€/mois"
                readonly={true}
                className={`ring ring-offset-2 rounded-md ${getBackground(data.mensualiteMoinsEconomies)}`}
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
            <span>Si montant à solder supérieur à 10 000 €, frais limités à 1% mais pris en charge par le Groupe HER-ENR en déduction du devis</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StepFinancement;