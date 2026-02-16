import React, { useState } from "react";
import { FileCheck, User, Home, Receipt, BarChart3, TrendingUp, Wallet, Banknote } from "lucide-react";
import SectionCard from "./SectionCard";
import { FormData } from "@/types/formData";
import html2pdf from "html2pdf.js";

interface PdfContentCommercialProps {
  data: FormData;
}

// Composant pour afficher une ligne de résumé
const SummaryRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-border/50 last:border-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-sm text-foreground">{value || "—"}</span>
  </div>
);

const PdfContentCommercial: React.FC<PdfContentCommercialProps> = ({ data }) => {

  const {
    dimensionnementPACaireau,
    dimensionnementPACairair,
    dimensionnementMultiplus,
    dimensionnementPoele,
    dimensionnementThermodynamique,
    dimensionnementECSSolaire,
    dimensionnementSSC,
    resultatRevolt,
    consommationPVElecAnnuelle,
    puissancePVRecommandee,
    productionPVEstimee,
    batteriePhysiqueReco,
    batterieVirtuelleReco,
    dimensionnementComblesPerdus,
    dimensionnementRampants,
    dimensionnementFenetres,
  } = data.dimensionnement;

  return (
    <div>
      <div className="a4-page">
        {/* Client */}
        <SectionCard title="Client" icon={User} className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryRow label="Accompagnateur" value={data.client.accompagnateur} />
            <SummaryRow label="Département" value={data.client.departement} />
            <SummaryRow label="Nom" value={data.client.nom} />
            <SummaryRow label="Téléphone" value={data.client.telephone} />
            <SummaryRow label="Adresse" value={`${data.client.adresse}—${data.client.codePostal} ${data.client.ville}`} />
            <SummaryRow label="Situation pro Conjoint 1" value={`${data.client.situationConjoint1}`} />
            <SummaryRow label="Âge Conjoint 1" value={`${data.client.ageConjoint1}`} />
            <SummaryRow label="Situation pro Conjoint 2" value={`${data.client.situationConjoint2}`} />
            <SummaryRow label="Âge Conjoint 2" value={`${data.client.ageConjoint2}`} />
            <SummaryRow label="Nombre de personnes" value={data.client.nbrePersonnes} />
            <SummaryRow label="Dont enfants" value={data.client.dontEnfants} />
          </div>
        </SectionCard>
        <SectionCard title="Habitation" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryRow label="Année de construction" value={data.client.anneeConstruction} />
            <SummaryRow label="Surface habitable" value={data.client.surfaceHabitable ? `${data.client.surfaceHabitable} m²` : ""} />
            <SummaryRow label="Propriétaire depuis" value={data.client.proprietaireDepuis} />
            <SummaryRow label="Nombre de pièces chauffées" value={data.client.nbrePiecesChaufees} />
            <SummaryRow label="Type de chauffage" value={data.client.typeChauffage} />
            <SummaryRow label="Âge chauffage" value={`${data.client.ageChauffage}`} />
            <SummaryRow label="Coût annuel chauffage" value={`${data.client.coutAnnuelChauffage}`} />
            <SummaryRow label="Eau chaude sanitaire" value={`${data.client.typeEauChaude}—${data.client.ageEauChaude}`} />
            <SummaryRow label="Aération" value={`${data.client.typeAeration}—${data.client.ageAeration}`} />
            <SummaryRow label="Facture électricité annuelle" value={data.client.factureElecAnnuelle ? `${data.client.factureElecAnnuelle} €` : ""} />
            <SummaryRow label="Facture électricité mensuelle" value={data.client.factureElecMensuelle ? `${data.client.factureElecMensuelle} €` : ""} />
            <SummaryRow label="Facture énergie annuelle" value={data.client.factureEnergieAnnuelle ? `${data.client.factureEnergieAnnuelle} €` : ""} />
            <SummaryRow label="Facture énergie mensuelle" value={data.client.factureEnergieMensuelle ? `${data.client.factureEnergieMensuelle} €` : ""} />
            <SummaryRow label="Travaux réalisés" value={`${data.client.travauxRealises}—${data.client.montantTravaux}`} />
            <SummaryRow label="Aides perçues" value={data.client.montantAides ? `${data.client.montantAides} €` : ""} />
          </div>
        </SectionCard>
        <div className="mt-6 text-xs text-center">Estimatif non contractuel</div>
      </div>
      <div className="a4-page">
        {/* Bilan énergétique */}
        <SectionCard title="Bilan énergétique" icon={BarChart3}>
          <div className="grid grid-cols-1 gap-x-8">
            <SummaryRow label="Classe DPE" value={data.bilan.classeEnergetique} />
          </div>
          <div className="grid grid-cols-1gap-x-8">
            <SummaryRow label="Consommation" value={data.bilan.consommationActuelle ? `${data.bilan.consommationActuelle} kWh/m²/an` : "kWh/m²/an"} />
            <SummaryRow label="Facture annuelle actuelle" value={data.bilan.factureAnnuelle ? `${data.bilan.factureAnnuelle} €/an` : "€/an"} />
            <SummaryRow label="Isolation combles" value={data.bilan.isolationCombles} />
            <SummaryRow label="Commentaires" value={data.bilan.isolationComblesCommentaire} />
            <SummaryRow label="Isolation murs" value={data.bilan.isolationMurs} />
            <SummaryRow label="Commentaires" value={data.bilan.isolationMursCommentaire} />
            <SummaryRow label="Menuiseries/ouvertures" value={data.bilan.menuiseries} />
            <SummaryRow label="Commentaires" value={data.bilan.menuiseriesCommentaire} />
            <SummaryRow label="Chauffage principal" value={data.bilan.chauffagePrincipal} />
            <SummaryRow label="Commentaires" value={data.bilan.chauffagePrincipalCommentaire} />
            <SummaryRow label="Eau chaude sanitaire" value={data.bilan.eauChaudeSanitaire} />
            <SummaryRow label="Commentaires" value={data.bilan.eauChaudeSanitaireCommentaire} />
            <SummaryRow label="Ventilation" value={data.bilan.ventilation} />
            <SummaryRow label="Commentaires" value={data.bilan.ventilationCommentaire} />
          </div>
        </SectionCard>
        <div className="mt-6 text-xs text-center">Estimatif non contractuel</div>
      </div>
      <div className="a4-page">
        {/* Evolution */}
        <SectionCard title="Répartition actuelle de la facture énergétique" icon={BarChart3}>
          <div className="grid grid-cols-1 gap-x-8">
            <SummaryRow label="Chauffage" value={data.evolution.montantChauffage ? `${data.evolution.montantChauffage} €` : ""} />
            <SummaryRow label="Eau chaude sanitaire (ECS)" value={data.evolution.montantECS ? `${data.evolution.montantECS} €` : ""} />
            <SummaryRow label="Électricité domestique" value={data.evolution.montantElecDomestique ? `${data.evolution.montantElecDomestique} €` : ""} />
            <SummaryRow label="Total" value={data.evolution.totalFactureNRJ ? `${data.evolution.totalFactureNRJ} €` : ""} />
          </div>
        </SectionCard>
        <SectionCard title="Énergie actuelle du logement" icon={BarChart3} className="my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryRow label="Chauffage" value={data.evolution.energieActuelle} />
          </div>
        </SectionCard>
        <SectionCard title="Projection des coûts de l'énergie" icon={BarChart3}>
          <div className="grid grid-cols-1 gap-x-8">
            <SummaryRow label="- 5 ans" value={data.evolution.coutNrjMoins5ans ? `${data.evolution.coutNrjMoins5ans} €` : ""} />
            <SummaryRow label="Aujourd'hui" value={data.evolution.coutNrjAujourdhui ? `${data.evolution.coutNrjAujourdhui} €` : ""} />
            <SummaryRow label="+ 5 ans" value={data.evolution.coutNrj5Ans ? `${data.evolution.coutNrj5Ans} €` : ""} />
            <SummaryRow label="+ 10 ans" value={data.evolution.coutNrj10Ans ? `${data.evolution.coutNrj10Ans} €` : ""} />
            <SummaryRow label="Dépense totale cumulée sur 10 ans" value={data.evolution.depenseTotal10ans ? `${data.evolution.depenseTotal10ans} €` : ""} />
          </div>
        </SectionCard>
        <div className="mt-6 text-xs text-center">Estimatif non contractuel</div>
      </div>
      <div className="a4-page">
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
        <div className="mt-6 text-xs text-center">Estimatif non contractuel</div>
      </div>
      <div className="a4-page">
        {/* Dimensionnement */}
        <SectionCard title="Dimensionnement" icon={Wallet}>
          <div className="grid grid-cols-1 gap-x-8">
            <SummaryRow label="PAC air-eau" value={dimensionnementPACaireau} />
            <SummaryRow label="PAC air-air" value={dimensionnementPACairair} />
            <SummaryRow label="Multi+'" value={dimensionnementMultiplus ? `${dimensionnementMultiplus} €` : ""} />
            <SummaryRow label="Poêle à bois / granulés" value={dimensionnementPoele ? `${dimensionnementPoele} €` : ""} />
            <SummaryRow label="Chauffe-eau thermodynamique" value={dimensionnementThermodynamique ? `${dimensionnementThermodynamique} €` : ""} />
            <SummaryRow label="Chauffe-eau solaire" value={dimensionnementECSSolaire ? `${dimensionnementECSSolaire} €` : ""} />
            <SummaryRow label="Système Solaire Combiné" value={dimensionnementSSC ? `${dimensionnementSSC} €` : ""} />
            <SummaryRow label="Photovoltaïque : résultat Revolt" value={resultatRevolt} />
            <SummaryRow label="Photovoltaïque : conso électrique annuelle" value={consommationPVElecAnnuelle} />
            <SummaryRow label="Photovoltaïque : puissance recommandée" value={puissancePVRecommandee} />
            <SummaryRow label="Photovoltaïque : production estimée" value={productionPVEstimee} />
            <SummaryRow label="Photovoltaïque : puissance batterie physique recommandée" value={batteriePhysiqueReco} />
            <SummaryRow label="Photovoltaïque : puissance batterie virtuelle recommandée" value={batterieVirtuelleReco} />
            <SummaryRow label="Isolation combles perdus" value={dimensionnementComblesPerdus ? `${dimensionnementComblesPerdus} €` : ""} />
            <SummaryRow label="Isolation sous-rampants" value={dimensionnementRampants ? `${dimensionnementRampants} €` : ""} />
            {dimensionnementFenetres.length > 0 &&
              dimensionnementFenetres.map((el, index) => (
                <SummaryRow key={`menuiserie-${index}`} label={`Menuiserie ${index + 1}`} value={`${el.type} - ${el.ouverture} - ${el.matiere}`} />
              ))
            }
          </div>
        </SectionCard>
        <div className="mt-6 text-xs text-center">Estimatif non contractuel</div>
      </div>
      <div className="a4-page">
        {/* Projection */}
        <SectionCard title="Projection" icon={Wallet}>
          <div className="grid grid-cols-1 gap-x-8">
            <SummaryRow label="Facture aujourd'hui" value={data.exponentiel.factureAujourdhui ? `${data.exponentiel.factureAujourdhui} €` : ""} />
            <SummaryRow label="Estimation à + 5 ans" value={data.exponentiel.facture5Ans ? `${data.exponentiel.facture5Ans} €` : ""} />
            <SummaryRow label="Estimation à + 10 ans" value={data.exponentiel.facture10Ans ? `${data.exponentiel.facture10Ans} €` : ""} />
            <SummaryRow label="Consommation énergétique sur 10 ans (avant travaux)" value={data.exponentiel.consommation10AnsSansTravaux ? `${data.exponentiel.consommation10AnsSansTravaux} €` : ""} />
            <SummaryRow label="Consommation énergétique sur 10 ans (après travaux)" value={data.exponentiel.consommation10AnsApresTravaux ? `${data.exponentiel.consommation10AnsApresTravaux} €` : ""} />
            <SummaryRow label="Économies annuelles moyennes sur 10 ans" value={data.exponentiel.economiesAnnuellesMoyennes ? `${data.exponentiel.economiesAnnuellesMoyennes} €` : ""} />
            <SummaryRow label="Économies mensuelles moyennes sur 10 ans" value={data.exponentiel.economiesMensuellesMoyennes ? `${data.exponentiel.economiesMensuellesMoyennes} €` : ""} />
            <SummaryRow label="Économies totales sur 10 ans" value={data.exponentiel.economiesRealisees10Ans ? `${data.exponentiel.economiesRealisees10Ans} €` : ""} />
          </div>
        </SectionCard>
        <div className="mt-6 text-xs text-center">Estimatif non contractuel</div>
      </div>
      <div className="a4-page">
        {/* Aides */}
        <SectionCard title="Aides estimées" icon={Wallet} className="mb-4">
          <div className="grid grid-cols-1 gap-x-8">
            <SummaryRow label="Nombre de personnes dans le foyer" value={data.aides.nbrePersonnesFoyer ? data.aides.nbrePersonnesFoyer : ""} />
            <SummaryRow label="Dernier RFR (Revenu Fiscal de Référence)" value={data.aides.dernierRFR ? `${data.aides.dernierRFR} €` : ""} />
            <SummaryRow label="Catégorie de revenus" value={data.aides.categorieRevenus ? data.aides.categorieRevenus : ""} />
            <SummaryRow label="Coût total de l'installation" value={data.aides.coutTotalInstallation ? `${data.aides.coutTotalInstallation} €` : ""} />
            <SummaryRow label="Prime CEE déduite (sous conditions)" value={data.aides.primeCEE ? `${data.aides.primeCEE} €` : ""} />
            <SummaryRow label="MaPrimeRénov' (non déduite)" value={data.aides.maPrimeRenov ? `${data.aides.maPrimeRenov} €` : ""} />
            <SummaryRow label="Reste à charge après MaPrimeRénov'" value={data.aides.resteACharge ? `${data.aides.resteACharge} €` : ""} />
            <SummaryRow label="Économies estimées sur 10 ans" value={data.aides.economiesSur10Ans ? `${data.aides.economiesSur10Ans} €` : ""} />
            <SummaryRow label="Gain sur 10 ans" value={data.aides.gainSur10Ans ? `${data.aides.gainSur10Ans} €` : ""} />
          </div>
        </SectionCard>
        {/* Financement */}
        <SectionCard title="Financement" icon={Banknote}>
          <div className="grid grid-cols-1 gap-x-8">
            <SummaryRow label="Mensualité de confort" value={data.financement.mensualiteConfort ? `${data.financement.mensualiteConfort} €/mois` : ""} />
            <SummaryRow label="Économies moyennes mensuelles sur 10 ans" value={data.financement.economiesMoyennesMensuelles ? `${data.financement.economiesMoyennesMensuelles} €/mois` : ""} />
            <SummaryRow label="Gain ou faible effort financier" value={data.financement.mensualiteMoinsEconomies ? `${data.financement.mensualiteMoinsEconomies} €/mois` : ""} />
          </div>
        </SectionCard>
        <div className="mt-6 text-xs text-center">Estimatif non contractuel</div>
      </div>
    </div>
  );
};

export default PdfContentCommercial;