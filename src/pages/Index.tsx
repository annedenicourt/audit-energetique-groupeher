import React, { useEffect, useState } from "react";
import FormLayout from "@/components/FormLayout";
import StepClient from "@/components/steps/StepClient";
import StepHabitation from "@/components/steps/StepHabitation";
import StepFactures from "@/components/steps/StepFactures";
import StepBilan from "@/components/steps/StepBilan";
import StepScenarios from "@/components/steps/StepScenarios";
import StepAides from "@/components/steps/StepAides";
import StepFinancement from "@/components/steps/StepFinancement";
import StepSynthese from "@/components/steps/StepSynthese";
import { DimensionnementData, ExponentielData, FormData, initialFormData, ScenarioData } from "@/types/formData";
import StepEvolutionNrj from "@/components/steps/StepEvolutionNrj";
import StepDimensionnement from "@/components/steps/StepDimensionnement";
import StepExponentiel from "@/components/steps/StepExponentiel";
import { computeCoutNrj10ans, computeCoutNrj5ans, computeDepenseTotale10ans, computeEcoAnnuellesMoy, computeEcoMensuellesMoy, computefacture10Ans, computefacture5Ans, computeFactureTotale10ans, computeTotalNrj, computeEcoTotal10ans } from "@/utils/energyCalculation";
import { STEPS } from "@/utils/handleForm";

const Index: React.FC = () => {
  // État global du formulaire - toutes les données sont stockées ici
  const [formData, setFormData] = useState<FormData>(initialFormData);
  // État pour la navigation entre les étapes
  const [currentStep, setCurrentStep] = useState(1);

  const STORAGE_KEY = "simulation_form";

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        setFormData(JSON.parse(stored));
      } catch (e) {
        console.warn("Données sessionStorage invalides", e);
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);


  // Handlers pour la navigation
  const goToNextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handlers génériques pour mettre à jour les différentes sections
  const updateClient = (field: keyof FormData["client"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      client: { ...prev.client, [field]: value },
    }));
  };

  /* const updateEvolutionNrj = (field: keyof FormData["evolution"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      evolution: { ...prev.evolution, [field]: value },
    }));
  }; */



  const updateEvolutionNrj = (field: keyof FormData["evolution"], value: string) => {
    setFormData((prev) => {
      const updatedEvolution = {
        ...prev.evolution,
        [field]: value,
      };

      return {
        ...prev,
        evolution: {
          ...updatedEvolution,
          totalFactureNRJ: computeTotalNrj(updatedEvolution),
          coutNrj5Ans: computeCoutNrj5ans(updatedEvolution),
          coutNrj10Ans: computeCoutNrj10ans(updatedEvolution),
          depenseTotal10ans: computeDepenseTotale10ans(updatedEvolution)
        },
      };
    });
  };


  const updateBilan = (field: keyof FormData["bilan"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      bilan: { ...prev.bilan, [field]: value },
    }));
  };

  const updateScenarios = (field: keyof FormData["scenarios"] | string, value: string | ScenarioData) => {
    setFormData((prev) => ({
      ...prev,
      scenarios: { ...prev.scenarios, [field]: value },
    }));
  };

  const updateDimensionnement = (field: keyof FormData["dimensionnement"] | string, value: string | DimensionnementData) => {
    setFormData((prev) => ({
      ...prev,
      dimensionnement: { ...prev.dimensionnement, [field]: value },
    }));
  };

  const updateExponentiel = (field: keyof FormData["exponentiel"] | string, value: string | ExponentielData) => {
    setFormData((prev) => {
      const updatedExponentiel = {
        ...prev.exponentiel,
        [field]: value,
      };

      return {
        ...prev,
        exponentiel: {
          ...updatedExponentiel,
          facture5Ans: computefacture5Ans(updatedExponentiel),
          facture10Ans: computefacture10Ans(updatedExponentiel),
          consommation10AnsSansTravaux: formData.evolution.depenseTotal10ans,
          consommation10AnsApresTravaux: computeFactureTotale10ans(updatedExponentiel),
          economiesRealisees10Ans: computeEcoTotal10ans(updatedExponentiel),
          economiesAnnuellesMoyennes: computeEcoAnnuellesMoy(updatedExponentiel),
          economiesMensuellesMoyennes: computeEcoMensuellesMoy(updatedExponentiel),
        },
      };
    });
  };

  const updateAides = (field: keyof FormData["aides"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      aides: { ...prev.aides, [field]: value },
    }));
  };

  const updateFinancement = (field: keyof FormData["financement"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      financement: { ...prev.financement, [field]: value },
    }));
  };

  // Rendu du composant d'étape actuel
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <StepClient data={formData.client} onChange={updateClient} />;
      /* case 2:
        return <StepHabitation data={formData.habitation} onChange={updateHabitation} />; */
      case 2:
        return <StepBilan data={formData.bilan} onChange={updateBilan} />;
      case 3:
        return <StepEvolutionNrj data={formData.evolution} onChange={updateEvolutionNrj} />;
      case 4:
        return <StepScenarios data={formData.scenarios} onChange={updateScenarios} />;
      case 5:
        return <StepDimensionnement data={formData.dimensionnement} onChange={updateDimensionnement} />;
      case 6:
        return <StepExponentiel data={formData.exponentiel} consommation10AnsSansTravaux={formData.evolution.depenseTotal10ans} onChange={updateExponentiel} />;
      case 7:
        return <StepAides data={formData.aides} onChange={updateAides} />;
      case 8:
        return <StepFinancement data={formData.financement} onChange={updateFinancement} />;
      case 9:
        return <StepSynthese data={formData} />;
      default:
        return null;
    }
  };

  return (
    <FormLayout
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      totalSteps={STEPS.length}
      steps={STEPS}
      onPrevious={goToPreviousStep}
      onNext={goToNextStep}
      canGoPrevious={currentStep > 1}
      canGoNext={currentStep < STEPS.length}
    >
      {renderCurrentStep()}
    </FormLayout>
  );
};

export default Index;

