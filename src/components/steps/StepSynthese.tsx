import React from "react";
import { FileCheck, User, Home, Receipt, BarChart3, TrendingUp, Wallet, Banknote } from "lucide-react";
import SectionCard from "../SectionCard";
import { FormData } from "@/types/formData";

interface StepSyntheseProps {
  data: FormData;
}

// Composant pour afficher une ligne de résumé
const SummaryRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-border/50 last:border-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground">{value || "—"}</span>
  </div>
);

const StepSynthese: React.FC<StepSyntheseProps> = ({ data }) => {
  return (
    <div className="space-y-6">

      {/* Message de confirmation */}
      <div className="p-2 bg-primary/10 border border-primary/20 rounded-xl text-center">
        <FileCheck size="40" className=" text-primary mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Audit énergétique terminé
        </h3>
      </div>

      {/* Page title */}
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Synthèse du dossier
        </h2>
      </div>

      {/* Client */}
      <SectionCard title="Client" icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <SummaryRow label="Accompagnateur" value={data.client.accompagnateur} />
          <SummaryRow label="Département" value={data.client.departement} />
          <SummaryRow label="Nom" value={data.client.nom} />
          <SummaryRow label="Téléphone" value={data.client.telephone} />
          <SummaryRow label="Adresse" value={`${data.client.adresse}, ${data.client.codePostal} ${data.client.ville}`} />
          <SummaryRow label="Conjoint 1" value={`${data.client.situationConjoint1}—${data.client.ageConjoint1}`} />
          <SummaryRow label="Conjoint 2" value={`${data.client.situationConjoint2}—${data.client.ageConjoint2}`} />
          <SummaryRow label="Année de construction" value={data.client.anneeConstruction} />
          <SummaryRow label="Surface habitable" value={data.client.surfaceHabitable ? `${data.client.surfaceHabitable} m²` : ""} />
          <SummaryRow label="Propriétaire depuis" value={data.client.proprietaireDepuis} />
          <SummaryRow label="Nombre de pièces chauffées" value={data.client.nbrePiecesChaufees} />
          <SummaryRow label="Nombre de personnes" value={data.client.nbrePersonnes} />
          <SummaryRow label="Dont enfants" value={data.client.dontEnfants} />
          <SummaryRow label="Type de chauffage" value={data.client.typeChauffage} />
          <SummaryRow label="Eau chaude" value={data.client.typeEauChaude} />
          <SummaryRow label="Ventilation" value={data.client.typeAeration} />
          <SummaryRow label="Facture électricité annuelle" value={data.client.factureElecAnnuelle ? `${data.client.factureElecAnnuelle} €` : ""} />
          <SummaryRow label="Facture énergie annuelle" value={data.client.factureEnergieAnnuelle ? `${data.client.factureEnergieAnnuelle} €` : ""} />
          <SummaryRow label="Travaux réalisés" value={data.client.travauxRealises} />
          <SummaryRow label="Aides perçues" value={data.client.montantAides ? `${data.client.montantAides} €` : ""} />
        </div>
      </SectionCard>

      {/* Bilan énergétique */}
      <SectionCard title="Bilan énergétique" icon={BarChart3}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <SummaryRow label="Classe DPE" value={data.bilan.classeEnergetique} />
          <SummaryRow label="Consommation" value={data.bilan.consommationActuelle ? `${data.bilan.consommationActuelle} kWh/m²/an` : ""} />
          <SummaryRow label="Énergie actuelle" value={data.evolution.energieActuelle} />
          <SummaryRow label="Isolation combles" value={data.bilan.isolationCombles} />
        </div>
      </SectionCard>

      {/* Evolution */}
      <SectionCard title="Évolution" icon={BarChart3}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <SummaryRow label="Classe DPE" value={data.bilan.classeEnergetique} />
          <SummaryRow label="Consommation" value={data.bilan.consommationActuelle ? `${data.bilan.consommationActuelle} kWh/m²/an` : ""} />
          <SummaryRow label="Énergie actuelle" value={data.evolution.energieActuelle} />
          <SummaryRow label="Isolation combles" value={data.bilan.isolationCombles} />
        </div>
      </SectionCard>

      {/* Scénarios */}
      <SectionCard title="Scénarios proposés" icon={TrendingUp}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.scenarios.scenario1.nom && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h5 className="font-semibold text-foreground mb-2">Scénario 1</h5>
              <p className="text-sm text-muted-foreground">{data.scenarios.scenario1.nom}</p>
              <p className="text-primary font-medium mt-2">
                {data.scenarios.scenario1.economieAnnuelle ? `Économie: ${data.scenarios.scenario1.economieAnnuelle} €/an` : ""}
              </p>
            </div>
          )}
          {data.scenarios.scenario2.nom && (
            <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
              <h5 className="font-semibold text-foreground mb-2">Scénario 2</h5>
              <p className="text-sm text-muted-foreground">{data.scenarios.scenario2.nom}</p>
              <p className="text-accent font-medium mt-2">
                {data.scenarios.scenario2.economieAnnuelle ? `Économie: ${data.scenarios.scenario2.economieAnnuelle} €/an` : ""}
              </p>
            </div>
          )}
          {data.scenarios.scenario3.nom && (
            <div className="p-4 bg-secondary rounded-lg border border-border">
              <h5 className="font-semibold text-foreground mb-2">Scénario 3</h5>
              <p className="text-sm text-muted-foreground">{data.scenarios.scenario3.nom}</p>
              <p className="text-foreground font-medium mt-2">
                {data.scenarios.scenario3.economieAnnuelle ? `Économie: ${data.scenarios.scenario3.economieAnnuelle} €/an` : ""}
              </p>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Dimensionnement */}
      <SectionCard title="Dimensionnement thermique & solaire" icon={Wallet}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <SummaryRow label="Coût total installation" value={data.aides.coutTotalInstallation ? `${data.aides.coutTotalInstallation} €` : ""} />
          <SummaryRow label="Prime CEE" value={data.aides.primeCEE ? `${data.aides.primeCEE} €` : ""} />
          <SummaryRow label="MaPrimeRénov'" value={data.aides.maPrimeRenov ? `${data.aides.maPrimeRenov} €` : ""} />
          <SummaryRow label="Gain sur 10 ans" value={data.aides.gainSur10Ans ? `${data.aides.gainSur10Ans} €` : ""} />
        </div>
      </SectionCard>

      {/* Projection */}
      <SectionCard title="Projection" icon={Wallet}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <SummaryRow label="Coût total installation" value={data.aides.coutTotalInstallation ? `${data.aides.coutTotalInstallation} €` : ""} />
          <SummaryRow label="Prime CEE" value={data.aides.primeCEE ? `${data.aides.primeCEE} €` : ""} />
          <SummaryRow label="MaPrimeRénov'" value={data.aides.maPrimeRenov ? `${data.aides.maPrimeRenov} €` : ""} />
          <SummaryRow label="Gain sur 10 ans" value={data.aides.gainSur10Ans ? `${data.aides.gainSur10Ans} €` : ""} />
        </div>
      </SectionCard>

      {/* Aides */}
      <SectionCard title="Aides estimées" icon={Wallet}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <SummaryRow label="Coût total installation" value={data.aides.coutTotalInstallation ? `${data.aides.coutTotalInstallation} €` : ""} />
          <SummaryRow label="Prime CEE" value={data.aides.primeCEE ? `${data.aides.primeCEE} €` : ""} />
          <SummaryRow label="MaPrimeRénov'" value={data.aides.maPrimeRenov ? `${data.aides.maPrimeRenov} €` : ""} />
          <SummaryRow label="Gain sur 10 ans" value={data.aides.gainSur10Ans ? `${data.aides.gainSur10Ans} €` : ""} />
        </div>
      </SectionCard>

      {/* Financement */}
      <SectionCard title="Financement" icon={Banknote}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <SummaryRow label="Mensualité de confort" value={data.financement.mensualiteConfort ? `${data.financement.mensualiteConfort} €/mois` : ""} />
          <SummaryRow label="Économies mensuelles" value={data.financement.economiesMoyennesMensuelles ? `${data.financement.economiesMoyennesMensuelles} €/mois` : ""} />
          <SummaryRow label="Effort financier" value={data.financement.mensualiteMoinsEconomies ? `${data.financement.mensualiteMoinsEconomies} €/mois` : ""} />
          <SummaryRow label="Économies sur 10 ans" value={data.exponentiel.economiesRealisees10Ans ? `${data.exponentiel.economiesRealisees10Ans} €` : ""} />
        </div>
      </SectionCard>

      {/* Bouton d'action (placeholder) */}
      <div className="flex justify-center pt-6">
        <button
          onClick={() => alert("Fonctionnalité à implémenter : export PDF, envoi par email, etc.")}
          className="nav-button nav-button--primary text-lg px-8"
        >
          <FileCheck className="w-5 h-5" />
          Valider le dossier
        </button>
      </div>
    </div>
  );
};

export default StepSynthese;