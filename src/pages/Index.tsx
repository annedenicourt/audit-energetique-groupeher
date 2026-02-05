import React, { useState } from "react";
import FormLayout from "@/components/FormLayout";
import StepClient from "@/components/steps/StepClient";
import StepHabitation from "@/components/steps/StepHabitation";
import StepFactures from "@/components/steps/StepFactures";
import StepBilan from "@/components/steps/StepBilan";
import StepScenarios from "@/components/steps/StepScenarios";
import StepAides from "@/components/steps/StepAides";
import StepFinancement from "@/components/steps/StepFinancement";
import StepSynthese from "@/components/steps/StepSynthese";
import { FormData, initialFormData, ScenarioData } from "@/types/formData";

// Définition des étapes du formulaire
const STEPS = [
  { id: 1, label: "Fiche Client", shortLabel: "Client" },
  { id: 2, label: "Habitation", shortLabel: "Habitation" },
  { id: 3, label: "Factures & Travaux", shortLabel: "Factures" },
  { id: 4, label: "Bilan Énergétique", shortLabel: "Bilan" },
  { id: 5, label: "Scénarios", shortLabel: "Scénarios" },
  { id: 6, label: "Aides", shortLabel: "Aides" },
  { id: 7, label: "Financement", shortLabel: "Financement" },
  { id: 8, label: "Synthèse", shortLabel: "Synthèse" },
];

const Index: React.FC = () => {
  // État global du formulaire - toutes les données sont stockées ici
  const [formData, setFormData] = useState<FormData>(initialFormData);
  
  // État pour la navigation entre les étapes
  const [currentStep, setCurrentStep] = useState(1);

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

  const updateHabitation = (field: keyof FormData["habitation"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      habitation: { ...prev.habitation, [field]: value },
    }));
  };

  const updateFactures = (field: keyof FormData["factures"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      factures: { ...prev.factures, [field]: value },
    }));
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
      case 2:
        return <StepHabitation data={formData.habitation} onChange={updateHabitation} />;
      case 3:
        return <StepFactures data={formData.factures} onChange={updateFactures} />;
      case 4:
        return <StepBilan data={formData.bilan} onChange={updateBilan} />;
      case 5:
        return <StepScenarios data={formData.scenarios} onChange={updateScenarios} />;
      case 6:
        return <StepAides data={formData.aides} onChange={updateAides} />;
      case 7:
        return <StepFinancement data={formData.financement} onChange={updateFinancement} />;
      case 8:
        return <StepSynthese data={formData} />;
      default:
        return null;
    }
  };

  return (
    <FormLayout
      currentStep={currentStep}
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
