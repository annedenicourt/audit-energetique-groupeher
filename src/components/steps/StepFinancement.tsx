import React from "react";
import { Banknote, LineChart, CheckCircle2 } from "lucide-react";
import FormInput from "../FormInput";
import SectionCard from "../SectionCard";
import { FinancementData } from "@/types/formData";
import Chronologie from "../Chronologie";

interface StepFinancementProps {
  data: FinancementData;
  onChange: (field: keyof FinancementData, value: string) => void;
}

const StepFinancement: React.FC<StepFinancementProps> = ({ data, onChange }) => {

  /* const [values, setValues] = useState({
    mois_demande: "",
    mois_metre: "",
    mois_pose: "",
    mois_m1: "",
    mois_m2: "",
    mpr: "",
    cee: "",
    reinject_m1: "",
    reinject_m2: "",
  }); */

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Écofinancement & Synthèse
        </h2>
        <p className="text-muted-foreground">
          Transfert de charge et projection des économies
        </p>
      </div>

      {/* Transfert de charge */}
      <SectionCard title="Transfert de charge" icon={Banknote}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Mensualité de confort"
              name="mensualiteConfort"
              value={data.mensualiteConfort}
              onChange={(v) => onChange("mensualiteConfort", v)}
              type="number"
              placeholder="200"
              suffix="€"
            />
            <FormInput
              label="Économies moyennes mensuelles"
              name="economiesMoyennesMensuelles"
              value={data.economiesMoyennesMensuelles}
              onChange={(v) => onChange("economiesMoyennesMensuelles", v)}
              type="number"
              placeholder="158"
              suffix="€"
            />
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <label className="form-label text-primary mb-2 block">
                Mensualité - économies
              </label>
              <FormInput
                label=""
                name="mensualiteMoinsEconomies"
                value={data.mensualiteMoinsEconomies}
                onChange={(v) => onChange("mensualiteMoinsEconomies", v)}
                type="number"
                placeholder="42"
                suffix="€/mois"
              />
            </div>
          </div>
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <p className="text-lg font-semibold text-primary">
              = Gain ou faible effort financier
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Avantages écofinancement */}
      <div className="p-6 bg-secondary rounded-xl border border-border">
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