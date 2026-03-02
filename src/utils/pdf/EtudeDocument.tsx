import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import PdfSection, { val } from "./PdfSection";

const EtudeDocument: React.FC<{ data: any }> = ({ data }) => {
  const c = data.client || {};
  const b = data.bilan || {};
  const ev = data.evolution || {};
  const sc = data.scenarios || {};
  const dim = data.dimensionnement || {};
  const exp = data.exponentiel || {};
  const ai = data.aides || {};
  const fin = data.financement || {};

  const scenarioRows = (s: any, name: string) => [
    { label: `${name} — Nom`, value: val(s?.nom) },
    { label: `${name} — Plus-value logement`, value: val(s?.plusValueLogement, "%") },
    { label: `${name} — Économies`, value: val(s?.economieAnnuelle, "%") },
    { label: `${name} — Facture après travaux`, value: val(s?.factureApres, " €/an") },
    { label: `${name} — Lettre après travaux`, value: val(s?.lettreApres) },
  ];

  const fenetresRows = Array.isArray(dim.dimensionnementFenetres)
    ? dim.dimensionnementFenetres.map((f: any, i: number) => ({
        label: `Menuiseries ${i + 1} (Qté-Matière)`,
        value: `${val(f.quantite)} - ${val(f.matiere)}`,
      }))
    : [];

  return (
    <Document>
      {/* Cover */}
      <Page size="A4" style={[styles.page, styles.coverPage]}>
        <Text style={styles.coverTitle}>Groupe HER</Text>
        <Text style={styles.coverSubtitle}>{val(c.nom, "") || "Client"}</Text>
        <Text style={styles.coverNote}>Étude énergétique — Document généré automatiquement</Text>
      </Page>

      {/* Content */}
      <Page size="A4" style={styles.page}>
        <PdfSection title="Client" rows={[
          { label: "Accompagnateur", value: val(c.accompagnateur) },
          { label: "Département", value: val(c.departement) },
          { label: "Nom", value: val(c.nom) },
          { label: "Téléphone", value: val(c.telephone) },
          { label: "Adresse fiscale", value: val(c.adresseFiscale) },
          { label: "Adresse chantier", value: `${val(c.adresse)}—${val(c.codePostal)} ${val(c.ville)}` },
          { label: "Situation pro C1", value: val(c.situationConjoint1) },
          { label: "Âge C1", value: val(c.ageConjoint1) },
          { label: "Situation pro C2", value: val(c.situationConjoint2) },
          { label: "Âge C2", value: val(c.ageConjoint2) },
          { label: "Nombre de personnes", value: val(c.nbrePersonnes) },
          { label: "Dont enfants", value: val(c.dontEnfants) },
        ]} />

        <PdfSection title="Habitation" rows={[
          { label: "Année de construction", value: val(c.anneeConstruction) },
          { label: "Surface habitable", value: val(c.surfaceHabitable, " m²") },
          { label: "Propriétaire depuis", value: val(c.proprietaireDepuis) },
          { label: "Pièces chauffées", value: val(c.nbrePiecesChaufees) },
          { label: "Type chauffage", value: val(c.typeChauffage) },
          { label: "Âge chauffage", value: val(c.ageChauffage) },
          { label: "Coût annuel chauffage", value: val(c.coutAnnuelChauffage) },
          { label: "ECS", value: `${val(c.typeEauChaude)}—${val(c.ageEauChaude)}` },
          { label: "Aération", value: `${val(c.typeAeration)}—${val(c.ageAeration)}` },
          { label: "Facture élec annuelle", value: val(c.factureElecAnnuelle, " €") },
          { label: "Facture élec mensuelle", value: val(c.factureElecMensuelle, " €") },
          { label: "Facture énergie annuelle", value: val(c.factureEnergieAnnuelle, " €") },
          { label: "Facture énergie mensuelle", value: val(c.factureEnergieMensuelle, " €") },
          { label: "Travaux réalisés", value: `${val(c.travauxRealises)}—${val(c.montantTravaux)}` },
          { label: "Aides perçues", value: val(c.montantAides, " €") },
        ]} />

        <PdfSection title="Bilan énergétique" rows={[
          { label: "Classe DPE", value: val(b.classeEnergetique) },
          { label: "Facture énergétique annuelle", value: val(c.factureEnergieAnnuelle, " €/an") },
          { label: "Isolation combles", value: val(b.isolationCombles) },
          { label: "Commentaires combles", value: val(b.isolationComblesCommentaire) },
          { label: "Isolation murs", value: val(b.isolationMurs) },
          { label: "Commentaires murs", value: val(b.isolationMursCommentaire) },
          { label: "Menuiseries", value: val(b.menuiseries) },
          { label: "Commentaires menuiseries", value: val(b.menuiseriesCommentaire) },
          { label: "Chauffage principal", value: val(b.chauffagePrincipal) },
          { label: "Commentaires chauffage", value: val(b.chauffagePrincipalCommentaire) },
          { label: "ECS", value: val(b.eauChaudeSanitaire) },
          { label: "Commentaires ECS", value: val(b.eauChaudeSanitaireCommentaire) },
          { label: "Ventilation", value: val(b.ventilation) },
          { label: "Commentaires ventilation", value: val(b.ventilationCommentaire) },
        ]} />

        <PdfSection title="Projection coûts énergie" rows={[
          { label: "- 5 ans", value: val(ev.coutNrjMoins5ans, " €") },
          { label: "Aujourd'hui", value: val(ev.coutNrjAujourdhui, " €") },
          { label: "+ 5 ans", value: val(ev.coutNrj5Ans, " €") },
          { label: "+ 10 ans", value: val(ev.coutNrj10Ans, " €") },
          { label: "Dépense cumulée 10 ans", value: val(ev.depenseTotal10ans, " €") },
        ]} />

        <PdfSection title="Scénarios proposés" rows={[
          ...scenarioRows(sc.scenario1, "Scénario 1"),
          ...scenarioRows(sc.scenario2, "Scénario 2"),
          ...scenarioRows(sc.scenario3, "Scénario 3"),
        ]} />

        <PdfSection title="Dimensionnement" rows={[
          { label: "PAC air-eau", value: val(dim.dimensionnementPACaireau) },
          { label: "PAC air-air", value: val(dim.dimensionnementPACairair) },
          { label: "Multi+'", value: val(dim.dimensionnementMultiplus, " €") },
          { label: "Poêle bois/granulés", value: val(dim.dimensionnementPoele, " €") },
          { label: "CE thermodynamique", value: val(dim.dimensionnementThermodynamique, " €") },
          { label: "CE solaire", value: val(dim.dimensionnementECSSolaire, " €") },
          { label: "SSC", value: val(dim.dimensionnementSSC, " €") },
          { label: "PV conso élec annuelle", value: val(dim.consommationPVElecAnnuelle, " kW/an") },
          { label: "PV puissance reco", value: val(dim.puissancePVRecommandee, " kWc") },
          { label: "PV production estimée", value: val(dim.productionPVEstimee, " kW/an") },
          { label: "PV batterie physique reco", value: val(dim.batteriePhysiqueReco, " kW") },
          { label: "PV batterie virtuelle reco", value: val(dim.batterieVirtuelleReco, " kW/mois") },
          { label: "Isolation combles perdus", value: val(dim.dimensionnementComblesPerdus, " €") },
          { label: "Isolation sous-rampants", value: val(dim.dimensionnementRampants, " €") },
          ...fenetresRows,
          { label: "Volets roulants (Qté)", value: val(dim.quantiteVolets) },
        ]} />

        <PdfSection title="Projection" rows={[
          { label: "Facture aujourd'hui", value: val(exp.factureAujourdhui, " €") },
          { label: "Estimation + 5 ans", value: val(exp.facture5Ans, " €") },
          { label: "Estimation + 10 ans", value: val(exp.facture10Ans, " €") },
          { label: "Conso 10 ans avant travaux", value: val(exp.consommation10AnsSansTravaux, " €") },
          { label: "Conso 10 ans après travaux", value: val(exp.consommation10AnsApresTravaux, " €") },
          { label: "Économies annuelles moy. 10 ans", value: val(exp.economiesAnnuellesMoyennes, " €") },
          { label: "Économies mensuelles moy. 10 ans", value: val(exp.economiesMensuellesMoyennes, " €") },
          { label: "Économies totales 10 ans", value: val(exp.economiesRealisees10Ans, " €") },
        ]} />

        <PdfSection title="Aides estimées" rows={[
          { label: "Personnes dans le foyer", value: val(ai.nbrePersonnesFoyer) },
          { label: "Dernier RFR", value: val(ai.dernierRFR, " €") },
          { label: "Catégorie revenus", value: val(ai.categorieRevenus) },
          { label: "Coût total installation", value: val(ai.coutTotalInstallation, " €") },
          { label: "Prime CEE déduite", value: val(ai.primeCEE, " €") },
          { label: "Reste avant MPR", value: val(ai.resteAChargeAvantMpr, " €") },
          { label: "MaPrimeRénov'", value: val(ai.maPrimeRenov, " €") },
          { label: "Reste après MPR", value: val(ai.resteAChargeApresMpr, " €") },
          { label: "Économies 10 ans", value: val(ai.economiesSur10Ans, " €") },
          { label: "Gain 10 ans", value: val(ai.gainSur10Ans, " €") },
        ]} />

        <PdfSection title="Financement" rows={[
          { label: "Mensualité de confort", value: val(fin.mensualiteConfort, " €/mois") },
          { label: "Économies moy. mensuelles 10 ans", value: val(fin.economiesMoyennesMensuelles, " €/mois") },
          { label: "Gain ou faible effort", value: val(fin.mensualiteMoinsEconomies, " €/mois") },
        ]} />

        <View style={styles.footer} fixed>
          <Text>Estimatif non contractuel</Text>
        </View>
      </Page>
    </Document>
  );
};

export default EtudeDocument;
