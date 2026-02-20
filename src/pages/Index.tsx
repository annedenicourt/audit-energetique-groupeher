import React, { useEffect, useMemo, useState } from "react";
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
  computeCoutNrj10ans,
  computeCoutNrj5ans,
  computeDepenseTotale10ans,
  computeEcoAnnuellesMoy,
  computeEcoMensuellesMoy,
  computefacture10Ans,
  computefacture5Ans,
  computeFactureTotale10ans,
  computeEcoTotal10ans,
  computeDispoMPR,
  computeTotalAides,
  computeResteaChargeAvant,
  computeResteaChargeApres,
  computeGain10ans,
  computeEcoMoinsMensualite,
  computeCoutNrjMoins5ans,
  computeNRJAnnuel,
  computeTotalChauffage,
  computefactureApres,
} from "@/utils/energyCalculation";
import { STEPS } from "@/utils/handleForm";
import StepPresentation from "@/components/steps/StepPresentation";
import StepDossier from "@/components/steps/StepDossier";

const STORAGE_KEY = "simulation_form";

const Index: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { return JSON.parse(stored); } catch { /* ignore */ }
    }
    return initialFormData;
  });

  const [currentStep, setCurrentStep] = useState(1);

  // Persistance automatique
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // ─── Handlers : simples setters, aucun calcul ──────────────────────────────

  const updateClient = (field: keyof FormData["client"], value: string) =>
    setFormData((prev) => ({ ...prev, client: { ...prev.client, [field]: value } }));

  const updateEvolutionNrj = (field: keyof FormData["evolution"], value: string) =>
    setFormData((prev) => ({ ...prev, evolution: { ...prev.evolution, [field]: value } }));

  const updateBilan = (field: keyof FormData["bilan"], value: string) =>
    setFormData((prev) => ({ ...prev, bilan: { ...prev.bilan, [field]: value } }));

  const updateScenarios = (scenarioKey: keyof FormData["scenarios"] | string, updatedScenario: ScenarioData) =>
    setFormData((prev) => ({
      ...prev,
      scenarios: { ...prev.scenarios, [scenarioKey]: updatedScenario },
    }));

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

  // ─── Valeurs calculées via useMemo ────────────────────────────────────────

  // Client
  const clientCalc = useMemo(() => ({
    ...formData.client,
    dispoMaPrimeRenov:      computeDispoMPR(formData.client),
    montantAides:           computeTotalAides(formData.client),
    factureEnergieAnnuelle: computeNRJAnnuel(formData.client),
    montantChauffage:       computeTotalChauffage(formData.client),
  }), [formData.client]);

  // Evolution NRJ (avant travaux) — valeurs calculées injectées dans l'objet data
  const evolutionCalc = useMemo(() => ({
    ...formData.evolution,
    totalFactureNRJ:    clientCalc.factureEnergieAnnuelle,
    coutNrjMoins5ans:  computeCoutNrjMoins5ans(formData.evolution),
    coutNrj5Ans:       computeCoutNrj5ans(formData.evolution),
    coutNrj10Ans:      computeCoutNrj10ans(formData.evolution),
    depenseTotal10ans: computeDepenseTotale10ans(formData.evolution),
  }), [formData.evolution, clientCalc.factureEnergieAnnuelle]);

  // Scénarios : factureApres calculée pour chacun
  const scenariosCalc = useMemo(() => ({
    scenario1: {
      ...formData.scenarios.scenario1,
      factureApres: computefactureApres(Number(formData.scenarios.scenario1.economieAnnuelle || 0), formData.evolution),
    },
    scenario2: {
      ...formData.scenarios.scenario2,
      factureApres: computefactureApres(Number(formData.scenarios.scenario2.economieAnnuelle || 0), formData.evolution),
    },
    scenario3: {
      ...formData.scenarios.scenario3,
      factureApres: computefactureApres(Number(formData.scenarios.scenario3.economieAnnuelle || 0), formData.evolution),
    },
  }), [formData.scenarios, formData.evolution]);

  // Exponentiel (après travaux)
  const exponentielCalc = useMemo(() => {
    const facture5Ans               = computefacture5Ans(formData.exponentiel);
    const facture10Ans              = computefacture10Ans(formData.exponentiel);
    const consommation10AnsSansTravaux  = evolutionCalc.depenseTotal10ans;
    const consommation10AnsApresTravaux = computeFactureTotale10ans(formData.exponentiel);

    const withBase = {
      ...formData.exponentiel,
      facture5Ans,
      facture10Ans,
      consommation10AnsSansTravaux,
      consommation10AnsApresTravaux,
    };

    const economiesRealisees10Ans    = computeEcoTotal10ans(withBase);
    const economiesAnnuellesMoyennes = computeEcoAnnuellesMoy(withBase);
    const economiesMensuellesMoyennes = computeEcoMensuellesMoy({ ...withBase, economiesAnnuellesMoyennes });

    return {
      ...withBase,
      economiesRealisees10Ans,
      economiesAnnuellesMoyennes,
      economiesMensuellesMoyennes,
    };
  }, [formData.exponentiel, evolutionCalc.depenseTotal10ans]);

  // Aides
  const aidesCalc = useMemo(() => {
    const withEco = {
      ...formData.aides,
      economiesSur10Ans: exponentielCalc.economiesRealisees10Ans,
    };
    return {
      ...withEco,
      resteAChargeAvantMpr: computeResteaChargeAvant(withEco),
      resteAChargeApresMpr: computeResteaChargeApres(withEco),
      gainSur10Ans:         computeGain10ans(withEco),
    };
  }, [formData.aides, exponentielCalc.economiesRealisees10Ans]);

  // Financement
  const financementCalc = useMemo(() => {
    const withEco = {
      ...formData.financement,
      economiesMoyennesMensuelles: exponentielCalc.economiesMensuellesMoyennes,
    };
    return {
      ...withEco,
      mensualiteMoinsEconomies: computeEcoMoinsMensualite(withEco),
    };
  }, [formData.financement, exponentielCalc.economiesMensuellesMoyennes]);

  // ─── Navigation ───────────────────────────────────────────────────────────

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

  // ─── Rendu ────────────────────────────────────────────────────────────────

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <StepPresentation />;
      case 2:
        return <StepClient data={clientCalc} onChange={updateClient} />;
      case 3:
        return <StepBilan data={formData.bilan} onChange={updateBilan} factureNrjAnnuelle={clientCalc.factureEnergieAnnuelle} />;
      case 4:
        return <StepEvolutionNrj data={evolutionCalc} onChange={updateEvolutionNrj} client={clientCalc} />;
      case 5:
        return <StepScenarios data={scenariosCalc} onChange={updateScenarios} />;
      case 6:
        return <StepDimensionnement data={formData.dimensionnement} onChange={updateDimensionnement} />;
      case 7:
        return (
          <StepExponentiel
            data={exponentielCalc}
            onChange={updateExponentiel}
            consommation10AnsSansTravaux={evolutionCalc.depenseTotal10ans}
          />
        );
      case 8:
        return <StepAides data={aidesCalc} onChange={updateAides} ecoEstimees10ans={exponentielCalc.economiesRealisees10Ans} />;
      case 9:
        return (
          <StepFinancement
            data={financementCalc}
            onChange={updateFinancement}
            economiesMensuellesMoyennes={exponentielCalc.economiesMensuellesMoyennes}
            aidesMaPrimeRenov={formData.aides.maPrimeRenov}
            aidesCEE={formData.aides.primeCEE}
          />
        );
      case 10:
        return <StepDossier data={formData} />;
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
