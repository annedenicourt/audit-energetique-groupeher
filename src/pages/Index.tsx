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
import { computeCoutNrj10ans, computeCoutNrj5ans, computeDepenseTotale10ans, computeEcoAnnuellesMoy, computeEcoMensuellesMoy, computefacture10Ans, computefacture5Ans, computeFactureTotale10ans, computeTotalNrj, computeEcoTotal10ans, computeDispoMPR, computeTotalAides, computeResteaCharge, computeGain10ans, computeEcoMoinsMensualite, computeCoutNrjMoins5ans } from "@/utils/energyCalculation";
import { STEPS } from "@/utils/handleForm";
import StepPresentation from "@/components/steps/StepPresentation";

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
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handlers génériques pour mettre à jour les différentes sections
  const updateClient = (field: keyof FormData["client"], value: string) => {
    setFormData((prev) => {
      const updatedClient = {
        ...prev.client,
        [field]: value,
      };

      return {
        ...prev,
        client: {
          ...updatedClient,
          dispoMaPrimeRenov: computeDispoMPR(updatedClient),
          montantAides: computeTotalAides(updatedClient)
        },
      };
    });
  };
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
          coutNrjMoins5ans: computeCoutNrjMoins5ans(updatedEvolution),
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

  const updateDimensionnement = (
    field: keyof FormData["dimensionnement"],
    value: string | DimensionnementData[keyof DimensionnementData] // inclut fenetres
  ) => {
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

      // Calculs chaînés dans le bon ordre
      const facture5Ans = computefacture5Ans(updatedExponentiel);
      const facture10Ans = computefacture10Ans(updatedExponentiel);
      const consommation10AnsSansTravaux = prev.evolution.depenseTotal10ans;
      const consommation10AnsApresTravaux = computeFactureTotale10ans(updatedExponentiel);

      // Injecter les valeurs fraîches pour les calculs suivants
      const withFreshValues = {
        ...updatedExponentiel,
        facture5Ans,
        facture10Ans,
        consommation10AnsSansTravaux,
        consommation10AnsApresTravaux,
      };

      const economiesRealisees10Ans = computeEcoTotal10ans(withFreshValues);
      const economiesAnnuellesMoyennes = computeEcoAnnuellesMoy(withFreshValues);
      const withEcoAnnuelles = {
        ...withFreshValues,
        economiesRealisees10Ans,
        economiesAnnuellesMoyennes,
      };
      const economiesMensuellesMoyennes = computeEcoMensuellesMoy(withEcoAnnuelles);

      return {
        ...prev,
        exponentiel: {
          ...withEcoAnnuelles,
          economiesMensuellesMoyennes,
        },
      };
    });
  };

  const updateAides = (field: keyof FormData["aides"], value: string) => {
    setFormData((prev) => {
      const updatedAides = {
        ...prev.aides,
        [field]: value,
      };

      return {
        ...prev,
        aides: {
          ...updatedAides,
          resteACharge: computeResteaCharge(updatedAides),
          //economiesSur10Ans: formData.exponentiel.economiesRealisees10Ans,
          gainSur10Ans: computeGain10ans(updatedAides)
        },
      };
    });
  };

  const updateFinancement = (field: keyof FormData["financement"], value: string) => {
    setFormData((prev) => {
      const updatedFinancement = {
        ...prev.financement,
        [field]: value,
        economiesMoyennesMensuelles: prev.exponentiel.economiesMensuellesMoyennes,
      };

      return {
        ...prev,
        financement: {
          ...updatedFinancement,
          mensualiteMoinsEconomies: computeEcoMoinsMensualite(updatedFinancement),
        },
      };
    });
  };

  // Rendu du composant d'étape actuel
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <StepPresentation />;
      case 2:
        return <StepClient data={formData.client} onChange={updateClient} />;
      /* case 2:
        return <StepHabitation data={formData.habitation} onChange={updateHabitation} />; */
      case 3:
        return <StepBilan data={formData.bilan} onChange={updateBilan} />;
      case 4:
        return <StepEvolutionNrj data={formData.evolution} onChange={updateEvolutionNrj} />;
      case 5:
        return <StepScenarios data={formData.scenarios} onChange={updateScenarios} />;
      case 6:
        return <StepDimensionnement data={formData.dimensionnement} onChange={updateDimensionnement} />;
      case 7:
        return <StepExponentiel data={formData.exponentiel} consommation10AnsSansTravaux={formData.evolution.depenseTotal10ans} onChange={updateExponentiel} />;
      case 8:
        return <StepAides data={formData.aides} onChange={updateAides} ecoEstimees10ans={formData.exponentiel.economiesRealisees10Ans} />;
      case 9:
        return <StepFinancement data={formData.financement} onChange={updateFinancement} economiesMensuellesMoyennes={formData.exponentiel.economiesMensuellesMoyennes} aidesMaPrimeRenov={formData.aides.maPrimeRenov} aidesCEE={formData.aides.primeCEE} />;
      case 10:
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
      canGoPrevious={currentStep > 0}
      canGoNext={currentStep < STEPS.length}
    >
      {renderCurrentStep()}
    </FormLayout>
  );
};

export default Index;

