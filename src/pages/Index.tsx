import React, { useEffect, useState } from "react";
import FormLayout from "@/components/FormLayout";
import StepClient from "@/components/steps/StepClient";
import StepBilan from "@/components/steps/StepBilan";
import StepScenarios from "@/components/steps/StepScenarios";
import StepAides from "@/components/steps/StepAides";
import StepFinancement from "@/components/steps/StepFinancement";
import { DimensionnementData, ExponentielData, FormData, initialFormData, ScenarioData } from "@/types/formData";
import StepEvolutionNrj from "@/components/steps/StepEvolutionNrj";
import StepDimensionnement from "@/components/steps/StepDimensionnement";
import StepExponentiel from "@/components/steps/StepExponentiel";
import {
  computeCoutNrjMoins5ans,
  computeCoutNrj5ans,
  computeCoutNrj10ans,
  computeDepenseTotale10ans,
  computeEcoAnnuellesMoy,
  computeEcoMensuellesMoy,
  computefacture5Ans,
  computefacture10Ans,
  computeFactureTotale10ans,
  computeEcoTotal10ans,
  computeDispoMPR,
  computeTotalAides,
  computeResteaChargeAvant,
  computeResteaChargeApres,
  computeGain10ans,
  computeEcoMoinsMensualite,
  computeNRJAnnuel,
  computeTotalChauffage,
  computefactureApres,
  computeEcoPremiereAnnee,
  computeEco10eAnnee,
} from "@/utils/energyCalculation";
import { STEPS } from "@/utils/handleForm";
import StepPresentation from "@/components/steps/StepPresentation";
import StepDossier from "@/components/steps/StepDossier";
import { useLocation } from "react-router-dom";
import { validateSimulationForm, MissingField } from "@/utils/validateSimulation";
import MissingFieldsModal from "@/components/MissingFieldsModal";
import StepAvis from "@/components/steps/StepAvis";

const Index: React.FC = () => {
  const location = useLocation();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [missingFields, setMissingFields] = useState<MissingField[]>([]);
  const [showMissingModal, setShowMissingModal] = useState(false);
  const [isStepDossierValid, setIsStepDossierValid] = useState(false);

  useEffect(() => {
    const stepLocation = location.state?.step;
    if (typeof stepLocation === "number") setCurrentStep(stepLocation);
  }, [location.state]);

  const STORAGE_KEY = "simulation_form";

  // Chargement depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFormData(JSON.parse(stored));
      } catch (e) {
        console.warn("Données localStorage invalides", e);
      }
    }
  }, []);

  // Sauvegarde dans localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // ─── EFFET 1 : recalcule les champs dérivés de client ───────────────────
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      client: {
        ...prev.client,
        dispoMaPrimeRenov: computeDispoMPR(prev.client),
        montantAides: computeTotalAides(prev.client),
        //factureEnergieAnnuelle: computeNRJAnnuel(prev.client),
        montantChauffage: computeTotalChauffage(prev.client),
      },
    }));
  }, [
    formData.client.aidesMaPrimeRenov,
    formData.client.aidesCEE,
    formData.client.aidesAutre,
    formData.client.coutAnnuelChauffage,
    formData.client.coutAnnuelChauffageAppoint,
    formData.client.factureElecAnnuelle,
  ]);

  // ─── EFFET 2 : recalcule les projections NRJ (evolution) ────────────────
  // Se déclenche aussi si factureEnergieAnnuelle change (cascade depuis client)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      evolution: {
        ...prev.evolution,
        totalFactureNRJ: prev.client.factureEnergieAnnuelle,
        coutNrjMoins5ans: computeCoutNrjMoins5ans(prev.evolution),
        coutNrj5Ans: computeCoutNrj5ans(prev.evolution),
        coutNrj10Ans: computeCoutNrj10ans(prev.evolution),
        depenseTotal10ans: computeDepenseTotale10ans(prev.evolution),
      },
    }));
  }, [
    formData.client.factureEnergieAnnuelle,
    formData.evolution.coutNrjAujourdhui,
  ]);

  // ─── EFFET 3 : recalcule les projections après travaux (exponentiel) ─────
  // Se déclenche aussi si depenseTotal10ans change (cascade depuis evolution)
  useEffect(() => {
    setFormData((prev) => {
      const facture5Ans = computefacture5Ans(prev.exponentiel);
      const facture10Ans = computefacture10Ans(prev.exponentiel);
      const consommation10AnsApresTravaux = computeFactureTotale10ans(prev.exponentiel);
      const withFresh = {
        ...prev.exponentiel,
        facture5Ans,
        facture10Ans,
        consommation10AnsSansTravaux: prev.evolution.depenseTotal10ans,
        consommation10AnsApresTravaux,
      };
      const economiesRealisees10Ans = computeEcoTotal10ans(withFresh);
      const economiesAnnuellesMoyennes = computeEcoAnnuellesMoy(withFresh);
      const economiesMensuellesMoyennes = computeEcoMensuellesMoy({
        ...withFresh,
        economiesAnnuellesMoyennes,
      });
      const economiesPremiereAnne = computeEcoPremiereAnnee({ ...withFresh, economiesMensuellesMoyennes });
      const economies10eAnnee = computeEco10eAnnee({ ...withFresh, economiesMensuellesMoyennes })
      return {
        ...prev,
        exponentiel: {
          ...withFresh,
          economiesRealisees10Ans,
          economiesAnnuellesMoyennes,
          economiesMensuellesMoyennes,
          economiesPremiereAnne,
          economies10eAnnee
        },
      };
    });
  }, [
    formData.evolution.depenseTotal10ans,
    formData.exponentiel.factureAujourdhui,
  ]);

  // ─── EFFET 4 : recalcule reste à charge & gain (aides) ──────────────────
  // Se déclenche aussi si economiesRealisees10Ans change (cascade depuis exponentiel)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      aides: {
        ...prev.aides,
        economiesSur10Ans: prev.exponentiel.economiesRealisees10Ans,
        resteAChargeAvantMpr: computeResteaChargeAvant(prev.aides),
        resteAChargeApresMpr: computeResteaChargeApres(prev.aides),
        gainSur10Ans: computeGain10ans({
          ...prev.aides,
          economiesSur10Ans: prev.exponentiel.economiesRealisees10Ans,
        }),
      },
    }));
  }, [
    formData.exponentiel.economiesRealisees10Ans,
    formData.aides.coutTotalInstallation,
    formData.aides.primeCEE,
    formData.aides.maPrimeRenov,
  ]);

  // ─── EFFET 5 : recalcule mensualité nette (financement) ─────────────────
  // Se déclenche aussi si economiesMensuellesMoyennes change (cascade depuis exponentiel)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      financement: {
        ...prev.financement,
        economiesMoyennesMensuelles: prev.exponentiel.economiesMensuellesMoyennes,
        mensualiteMoinsEconomies: computeEcoMoinsMensualite({
          ...prev.financement,
          economiesMoyennesMensuelles: prev.exponentiel.economiesMensuellesMoyennes,
        }),
      },
    }));
  }, [
    formData.exponentiel.economiesMensuellesMoyennes,
    formData.financement.mensualiteConfort,
  ]);

  // ─── Navigation ──────────────────────────────────────────────────────────
  const goToNextStep = () => {
    if (currentStep === 10) {
      const missing = validateSimulationForm();
      if (missing.length > 0) {
        setMissingFields(missing);
        setShowMissingModal(true);
        return;
      }
    }
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

  const handleStepClick = (stepId: number): boolean => {
    if (stepId >= 11 && currentStep < 11) {
      const missing = validateSimulationForm();
      if (missing.length > 0) {
        setMissingFields(missing);
        setShowMissingModal(true);
        return false;
      }
    }
    return true;
  };

  // ─── SETTERS SIMPLES ─────────────────────────────────────────────────────
  const updateClient = (field: keyof FormData["client"], value: string) =>
    setFormData((prev) => ({ ...prev, client: { ...prev.client, [field]: value } }));

  const updateEvolutionNrj = (field: keyof FormData["evolution"], value: string) =>
    setFormData((prev) => ({ ...prev, evolution: { ...prev.evolution, [field]: value } }));

  const updateBilan = (field: keyof FormData["bilan"], value: string) =>
    setFormData((prev) => ({ ...prev, bilan: { ...prev.bilan, [field]: value } }));

  const updateScenarios = (scenarioKey: keyof FormData["scenarios"] | string, updatedScenario: ScenarioData) => {
    setFormData((prev) => {
      const percent = Number(updatedScenario.economieAnnuelle || 0);
      return {
        ...prev,
        scenarios: {
          ...prev.scenarios,
          [scenarioKey]: {
            ...updatedScenario,
            factureApres: computefactureApres(percent, prev.evolution),
          },
        },
      };
    });
  };

  const updateDimensionnement = (
    field: keyof FormData["dimensionnement"],
    value: string | DimensionnementData[keyof DimensionnementData]
  ) =>
    setFormData((prev) => ({ ...prev, dimensionnement: { ...prev.dimensionnement, [field]: value } }));

  const updateExponentiel = (field: keyof FormData["exponentiel"] | string, value: string | ExponentielData) =>
    setFormData((prev) => ({ ...prev, exponentiel: { ...prev.exponentiel, [field]: value } }));

  const updateAides = (field: keyof FormData["aides"], value: string) =>
    setFormData((prev) => ({ ...prev, aides: { ...prev.aides, [field]: value } }));

  const updateFinancement = (field: keyof FormData["financement"], value: string) =>
    setFormData((prev) => ({ ...prev, financement: { ...prev.financement, [field]: value } }));

  // ─── Rendu ───────────────────────────────────────────────────────────────
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <StepPresentation />;
      case 2:
        return <StepClient data={formData.client} onChange={updateClient} />;
      case 3:
        return <StepBilan data={formData.bilan} onChange={updateBilan} factureNrjAnnuelle={formData.client.factureEnergieAnnuelle} />;
      case 4:
        return <StepEvolutionNrj data={formData.evolution} onChange={updateEvolutionNrj} client={formData.client} />;
      case 5:
        return <StepScenarios data={formData.scenarios} onChange={updateScenarios} />;
      case 6:
        return <StepDimensionnement data={formData.dimensionnement} onChange={updateDimensionnement} />;
      case 7:
        return <StepExponentiel data={formData.exponentiel} consommation10AnsSansTravaux={formData.evolution.depenseTotal10ans} onChange={updateExponentiel} />;
      case 8:
        return <StepAides data={formData.aides} onChange={updateAides} ecoEstimees10ans={formData.exponentiel.economiesRealisees10Ans} dispoMPR={formData.client.dispoMaPrimeRenov} currentStep={currentStep} />;
      case 9:
        return <StepFinancement data={formData.financement} onChange={updateFinancement} economiesMensuellesMoyennes={formData.exponentiel.economiesMensuellesMoyennes} aidesMaPrimeRenov={formData.aides.maPrimeRenov} aidesCEE={formData.aides.primeCEE} economiesPremiereAnne={formData.exponentiel.economiesPremiereAnne} economies10eAnnee={formData.exponentiel.economies10eAnnee} />;
      case 10:
        return <StepAvis data={formData.aides} onChange={updateAides} accompagnateur={formData.client.accompagnateur} />;
      case 11:
        return <StepDossier simulData={formData} onValidationChange={setIsStepDossierValid} />;
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
      onStepClick={handleStepClick}
    //isDossierValid={isStepDossierValid}
    >
      {renderCurrentStep()}
      <MissingFieldsModal
        isOpen={showMissingModal}
        onClose={() => setShowMissingModal(false)}
        missingFields={missingFields}
        onGoToStep={(step) => setCurrentStep(step)}
      />
    </FormLayout>
  );
};

export default Index;
