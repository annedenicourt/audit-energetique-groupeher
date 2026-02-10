import React from "react";
import { TrendingUp, Sun, Thermometer, SquareArrowOutUpRight } from "lucide-react";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import SectionCard from "../SectionCard";
import { ScenariosData, ScenarioData, DimensionnementData } from "@/types/formData";



const StepPresentation = () => {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Présentation
        </h2>
      </div>
      <div className="mt-6 flex flex-row items-center text-sm font-bold">
        <a href="https://particulier.edf.fr/fr/accueil/aides-financement/professionnels/resultats.html?raisonSociale=HER%20ENR" target="_blank">Partenaire Economies d'énergie EDF</a>
        <SquareArrowOutUpRight size={20} className="ml-1" />
      </div>
      <div className="mt-6 flex flex-row items-center text-sm font-bold">
        <a href="https://france-renov.gouv.fr/annuaire-rge/identifier?company=85156645500057&date=2026-02-09" target="_blank">Mandataire Administratif MaPrimeRénov'</a>
        <SquareArrowOutUpRight size={20} className="ml-1" />
      </div>
    </div>
  );
};

export default StepPresentation;