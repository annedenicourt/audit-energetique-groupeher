import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { jsPDF } from "https://esm.sh/jspdf@2.5.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/* ------------------------------------------------------------------ */
/*  PDF helpers                                                        */
/* ------------------------------------------------------------------ */

const A4_W = 210;
const A4_H = 297;
const MARGIN = 15;
const CONTENT_W = A4_W - MARGIN * 2;
const LINE_H = 6;
const SECTION_GAP = 4;

interface Section {
  title: string;
  rows: { label: string; value: string }[];
}

function val(v: unknown, suffix = ""): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "✓" : "—";
  return `${v}${suffix}`;
}

function buildPdf(sections: Section[], clientName: string): Uint8Array {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Cover page
  pdf.setFillColor(30, 41, 59); // slate-800
  pdf.rect(0, 0, A4_W, A4_H, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.text("Groupe HER", A4_W / 2, A4_H / 2 - 20, { align: "center" });
  pdf.setFontSize(16);
  pdf.text(clientName || "Client", A4_W / 2, A4_H / 2 + 5, { align: "center" });
  pdf.setFontSize(10);
  pdf.text("Document généré automatiquement", A4_W / 2, A4_H / 2 + 20, { align: "center" });

  let curY = MARGIN;
  let pageNum = 1;
  const totalSections = sections.length;

  const ensureSpace = (needed: number) => {
    if (curY + needed > A4_H - MARGIN - 10) {
      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text("Estimatif non contractuel", A4_W / 2, A4_H - 12, { align: "center" });
      pdf.text(`Page ${pageNum}`, A4_W / 2, A4_H - 7, { align: "center" });
      pdf.addPage();
      pageNum++;
      curY = MARGIN;
    }
  };

  for (const section of sections) {
    // New page for each section group? No — pack them.
    const sectionHeaderH = 10;
    const sectionBodyH = section.rows.length * LINE_H + 4;
    const totalH = sectionHeaderH + sectionBodyH;

    ensureSpace(Math.min(totalH, 60)); // at least first rows

    // Section title
    pdf.setFillColor(249, 115, 22); // orange-500
    pdf.roundedRect(MARGIN, curY, CONTENT_W, 8, 1, 1, "F");
    pdf.setFontSize(11);
    pdf.setTextColor(255, 255, 255);
    pdf.text(section.title, MARGIN + 4, curY + 5.5);
    curY += 10;

    // Rows
    pdf.setFontSize(9);
    for (const row of section.rows) {
      ensureSpace(LINE_H + 2);

      // Alternate row bg
      pdf.setFillColor(248, 248, 248);
      pdf.rect(MARGIN, curY - 1, CONTENT_W, LINE_H, "F");

      // Label
      pdf.setTextColor(100, 100, 100);
      pdf.text(row.label, MARGIN + 2, curY + 3.5);

      // Value (right-aligned, truncated)
      pdf.setTextColor(30, 30, 30);
      const maxValueW = CONTENT_W / 2 - 4;
      const valueText = row.value.length > 50 ? row.value.substring(0, 47) + "…" : row.value;
      pdf.text(valueText, MARGIN + CONTENT_W - 2, curY + 3.5, { align: "right" });

      // Bottom border
      pdf.setDrawColor(230, 230, 230);
      pdf.line(MARGIN, curY + LINE_H - 1, MARGIN + CONTENT_W, curY + LINE_H - 1);

      curY += LINE_H;
    }

    curY += SECTION_GAP;
  }

  // Last page footer
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text("Estimatif non contractuel", A4_W / 2, A4_H - 12, { align: "center" });
  pdf.text(`Page ${pageNum}`, A4_W / 2, A4_H - 7, { align: "center" });

  return pdf.output("arraybuffer") as unknown as Uint8Array;
}

/* ------------------------------------------------------------------ */
/*  Étude → sections                                                   */
/* ------------------------------------------------------------------ */

function buildEtudeSections(d: any): Section[] {
  const c = d.client || {};
  const b = d.bilan || {};
  const ev = d.evolution || {};
  const sc = d.scenarios || {};
  const dim = d.dimensionnement || {};
  const exp = d.exponentiel || {};
  const ai = d.aides || {};
  const fin = d.financement || {};

  const scenarioRows = (s: any, name: string) => [
    { label: `${name} — Nom`, value: val(s?.nom) },
    { label: `${name} — Plus-value logement`, value: val(s?.plusValueLogement, "%") },
    { label: `${name} — Économies`, value: val(s?.economieAnnuelle, "%") },
    { label: `${name} — Facture après travaux`, value: val(s?.factureApres, " €/an") },
    { label: `${name} — Lettre après travaux`, value: val(s?.lettreApres) },
  ];

  return [
    {
      title: "Client",
      rows: [
        { label: "Accompagnateur", value: val(c.accompagnateur) },
        { label: "Département", value: val(c.departement) },
        { label: "Nom", value: val(c.nom) },
        { label: "Téléphone", value: val(c.telephone) },
        { label: "Adresse fiscale", value: val(c.adresseFiscale) },
        { label: "Adresse de chantier", value: `${val(c.adresse)}—${val(c.codePostal)} ${val(c.ville)}` },
        { label: "Situation pro Conjoint 1", value: val(c.situationConjoint1) },
        { label: "Âge Conjoint 1", value: val(c.ageConjoint1) },
        { label: "Situation pro Conjoint 2", value: val(c.situationConjoint2) },
        { label: "Âge Conjoint 2", value: val(c.ageConjoint2) },
        { label: "Nombre de personnes", value: val(c.nbrePersonnes) },
        { label: "Dont enfants à charge", value: val(c.dontEnfants) },
      ],
    },
    {
      title: "Habitation",
      rows: [
        { label: "Année de construction", value: val(c.anneeConstruction) },
        { label: "Surface habitable", value: val(c.surfaceHabitable, " m²") },
        { label: "Propriétaire depuis", value: val(c.proprietaireDepuis) },
        { label: "Nombre de pièces chauffées", value: val(c.nbrePiecesChaufees) },
        { label: "Type de chauffage", value: val(c.typeChauffage) },
        { label: "Âge chauffage", value: val(c.ageChauffage) },
        { label: "Coût annuel chauffage", value: val(c.coutAnnuelChauffage) },
        { label: "Eau chaude sanitaire", value: `${val(c.typeEauChaude)}—${val(c.ageEauChaude)}` },
        { label: "Aération", value: `${val(c.typeAeration)}—${val(c.ageAeration)}` },
        { label: "Facture électricité annuelle", value: val(c.factureElecAnnuelle, " €") },
        { label: "Facture électricité mensuelle", value: val(c.factureElecMensuelle, " €") },
        { label: "Facture énergie annuelle", value: val(c.factureEnergieAnnuelle, " €") },
        { label: "Facture énergie mensuelle", value: val(c.factureEnergieMensuelle, " €") },
        { label: "Travaux réalisés", value: `${val(c.travauxRealises)}—${val(c.montantTravaux)}` },
        { label: "Aides perçues", value: val(c.montantAides, " €") },
      ],
    },
    {
      title: "Bilan énergétique",
      rows: [
        { label: "Classe DPE", value: val(b.classeEnergetique) },
        { label: "Facture énergétique annuelle", value: val(c.factureEnergieAnnuelle, " €/an") },
        { label: "Isolation combles", value: val(b.isolationCombles) },
        { label: "Commentaires combles", value: val(b.isolationComblesCommentaire) },
        { label: "Isolation murs", value: val(b.isolationMurs) },
        { label: "Commentaires murs", value: val(b.isolationMursCommentaire) },
        { label: "Menuiseries/ouvertures", value: val(b.menuiseries) },
        { label: "Commentaires menuiseries", value: val(b.menuiseriesCommentaire) },
        { label: "Chauffage principal", value: val(b.chauffagePrincipal) },
        { label: "Commentaires chauffage", value: val(b.chauffagePrincipalCommentaire) },
        { label: "Eau chaude sanitaire", value: val(b.eauChaudeSanitaire) },
        { label: "Commentaires ECS", value: val(b.eauChaudeSanitaireCommentaire) },
        { label: "Ventilation", value: val(b.ventilation) },
        { label: "Commentaires ventilation", value: val(b.ventilationCommentaire) },
      ],
    },
    {
      title: "Projection des coûts de l'énergie",
      rows: [
        { label: "- 5 ans", value: val(ev.coutNrjMoins5ans, " €") },
        { label: "Aujourd'hui", value: val(ev.coutNrjAujourdhui, " €") },
        { label: "+ 5 ans", value: val(ev.coutNrj5Ans, " €") },
        { label: "+ 10 ans", value: val(ev.coutNrj10Ans, " €") },
        { label: "Dépense totale cumulée sur 10 ans", value: val(ev.depenseTotal10ans, " €") },
      ],
    },
    {
      title: "Scénarios proposés",
      rows: [
        ...scenarioRows(sc.scenario1, "Scénario 1"),
        ...scenarioRows(sc.scenario2, "Scénario 2"),
        ...scenarioRows(sc.scenario3, "Scénario 3"),
      ],
    },
    {
      title: "Dimensionnement",
      rows: [
        { label: "PAC air-eau", value: val(dim.dimensionnementPACaireau) },
        { label: "PAC air-air", value: val(dim.dimensionnementPACairair) },
        { label: "Multi+'", value: val(dim.dimensionnementMultiplus, " €") },
        { label: "Poêle à bois / granulés", value: val(dim.dimensionnementPoele, " €") },
        { label: "Chauffe-eau thermodynamique", value: val(dim.dimensionnementThermodynamique, " €") },
        { label: "Chauffe-eau solaire", value: val(dim.dimensionnementECSSolaire, " €") },
        { label: "Système Solaire Combiné", value: val(dim.dimensionnementSSC, " €") },
        { label: "PV : conso électrique annuelle", value: val(dim.consommationPVElecAnnuelle, " kW/an") },
        { label: "PV : puissance recommandée", value: val(dim.puissancePVRecommandee, " kWc") },
        { label: "PV : production estimée", value: val(dim.productionPVEstimee, " kW/an") },
        { label: "PV : batterie physique reco", value: val(dim.batteriePhysiqueReco, " kW") },
        { label: "PV : batterie virtuelle reco", value: val(dim.batterieVirtuelleReco, " kW/mois") },
        { label: "Isolation combles perdus", value: val(dim.dimensionnementComblesPerdus, " €") },
        { label: "Isolation sous-rampants", value: val(dim.dimensionnementRampants, " €") },
        ...(Array.isArray(dim.dimensionnementFenetres)
          ? dim.dimensionnementFenetres.map((f: any, i: number) => ({
              label: `Menuiseries ${i + 1} (Qté-Matière)`,
              value: `${val(f.quantite)} - ${val(f.matiere)}`,
            }))
          : []),
        { label: "Volets roulants (Quantité)", value: val(dim.quantiteVolets) },
      ],
    },
    {
      title: "Projection",
      rows: [
        { label: "Facture aujourd'hui", value: val(exp.factureAujourdhui, " €") },
        { label: "Estimation à + 5 ans", value: val(exp.facture5Ans, " €") },
        { label: "Estimation à + 10 ans", value: val(exp.facture10Ans, " €") },
        { label: "Conso sur 10 ans (avant travaux)", value: val(exp.consommation10AnsSansTravaux, " €") },
        { label: "Conso sur 10 ans (après travaux)", value: val(exp.consommation10AnsApresTravaux, " €") },
        { label: "Économies annuelles moyennes sur 10 ans", value: val(exp.economiesAnnuellesMoyennes, " €") },
        { label: "Économies mensuelles moyennes sur 10 ans", value: val(exp.economiesMensuellesMoyennes, " €") },
        { label: "Économies totales sur 10 ans", value: val(exp.economiesRealisees10Ans, " €") },
      ],
    },
    {
      title: "Aides estimées",
      rows: [
        { label: "Nombre de personnes dans le foyer", value: val(ai.nbrePersonnesFoyer) },
        { label: "Dernier RFR", value: val(ai.dernierRFR, " €") },
        { label: "Catégorie de revenus", value: val(ai.categorieRevenus) },
        { label: "Coût total de l'installation", value: val(ai.coutTotalInstallation, " €") },
        { label: "Prime CEE déduite", value: val(ai.primeCEE, " €") },
        { label: "Reste à charge avant MPR", value: val(ai.resteAChargeAvantMpr, " €") },
        { label: "MaPrimeRénov'", value: val(ai.maPrimeRenov, " €") },
        { label: "Reste à charge après MPR", value: val(ai.resteAChargeApresMpr, " €") },
        { label: "Économies estimées sur 10 ans", value: val(ai.economiesSur10Ans, " €") },
        { label: "Gain sur 10 ans", value: val(ai.gainSur10Ans, " €") },
      ],
    },
    {
      title: "Financement",
      rows: [
        { label: "Mensualité de confort", value: val(fin.mensualiteConfort, " €/mois") },
        { label: "Économies moyennes mensuelles sur 10 ans", value: val(fin.economiesMoyennesMensuelles, " €/mois") },
        { label: "Gain ou faible effort financier", value: val(fin.mensualiteMoinsEconomies, " €/mois") },
      ],
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Dossier → sections                                                 */
/* ------------------------------------------------------------------ */

function buildDossierSections(d: any): Section[] {
  const b = (v: unknown) => (v ? "✓" : "—");

  return [
    {
      title: "Client",
      rows: [
        { label: "Conseiller", value: val(d.conseiller) },
        { label: "Perso", value: b(d.perso) },
        { label: "Nom client", value: val(d.nomClient) },
        { label: "Téléphone", value: val(d.telephone) },
        { label: "Adresse fiscale", value: val(d.adresse) },
        { label: "Adresse de chantier", value: val(d.adresseInstallation) },
      ],
    },
    {
      title: "Règlement",
      rows: [
        { label: "Chèque", value: b(d.reglementCheque) },
        { label: "Financement", value: b(d.reglementFinancement) },
        { label: "PTZ", value: b(d.reglementPTZ) },
      ],
    },
    {
      title: "Dossier de prime",
      rows: [
        { label: "Propriétaire occupant", value: b(d.proprietaireOccupant) },
        { label: "Propriétaire bailleur", value: b(d.proprietaireBailleur) },
        { label: "Résidence secondaire", value: b(d.residSecondaire) },
        { label: "SCI", value: b(d.sci) },
      ],
    },
    {
      title: "Pièces / Attestations",
      rows: [
        { label: "Devis non signé", value: b(d.devisNonSigne) },
        { label: "Devis signé", value: b(d.devisSigne) },
        { label: "Carte identité", value: b(d.carteIdentite) },
        { label: "2 derniers avis d'impôts", value: b(d.deuxDerniersAvisImpots) },
        { label: "Taxe foncière ou acte notarié", value: b(d.taxeFonciereActeNotarie) },
        { label: "Mandat MaPrimeRénov", value: b(d.mandatMaPrimeRenov) },
        { label: "Identité numérique", value: b(d.idNumerique) },
        { label: "Attestation fioul", value: b(d.attestationFioul) },
        { label: "Attestation indivisionnaire", value: b(d.attestationIndivisionnaire) },
        { label: "Attestation bailleur", value: b(d.attestationProprietaireBailleur) },
        { label: "Note de dimensionnement", value: b(d.noteDimensionnement) },
        { label: "Revolt", value: b(d.revolt) },
        { label: "Pouvoir", value: b(d.pouvoir) },
      ],
    },
    {
      title: "Prime EDF / MaPrimeRénov'",
      rows: [
        { label: "Montant Prime EDF", value: val(d.montantPrimeEDF, " €") },
        { label: "Mail Prime EDF", value: val(d.mailPrimeEDF) },
        { label: "MDP Prime EDF", value: val(d.mdpPrimeEDF) },
        { label: "Montant MaPrimeRénov", value: val(d.montantPrimeRenov, " €") },
        { label: "Mail MaPrimeRénov", value: val(d.mailPrimeRenov) },
        { label: "MDP MaPrimeRénov", value: val(d.mdpPrimeRenov) },
        { label: "Gmail créé", value: val(d.gmailCree) },
        { label: "MDP Gmail", value: val(d.mdpGmail) },
      ],
    },
    {
      title: "Dossier de financement",
      rows: [
        { label: "Justificatif domicile", value: b(d.justificatifDomicile) },
        { label: "Bulletins salaires", value: b(d.bulletinsSalaires) },
        { label: "Bilan (entrepreneur)", value: b(d.bilanEntrepreneur) },
      ],
    },
    {
      title: "Habitation",
      rows: [
        { label: "Année de construction", value: val(d.anneeConstruction) },
        { label: "Plain-pied", value: b(d.plainPied) },
        { label: "Étages", value: b(d.etages) },
        { label: "Nombre d'étages", value: val(d.nbEtages) },
        { label: "Sous-sol", value: b(d.sousSol) },
        { label: "Vide sanitaire", value: b(d.videSanitaire) },
        { label: "Vide sanitaire accessible", value: b(d.videSanitaireAccessible) },
        { label: "Menuiseries à changer (qté)", value: val(d.quantiteFenetres) },
        { label: "Menuiseries à changer (matière)", value: val(d.matiereFenetres) },
        { label: "Volets roulants (qté)", value: val(d.quantiteVolets) },
      ],
    },
    {
      title: "Murs",
      rows: [
        { label: "Type de mur", value: val(d.typeMur) },
        { label: "Épaisseur mur (cm)", value: val(d.epaisseurMur) },
      ],
    },
    {
      title: "Combles",
      rows: [
        { label: "Combles perdus", value: b(d.comblePerdu) },
        { label: "Combles aménagés", value: b(d.combleAmenage) },
        { label: "Combles perdus accessibles", value: b(d.comblePerduAccessible) },
        { label: "Accès trappe", value: b(d.comblePerduTrappe) },
        { label: "Accès toit", value: b(d.comblePerduToit) },
        { label: "Accès autre", value: b(d.comblePerduAutre) },
        { label: "Précision autre", value: val(d.comblePerduAutreTexte) },
      ],
    },
    {
      title: "Planchers",
      rows: [
        { label: "Plancher bois", value: b(d.plancherBois) },
        { label: "Plancher placo", value: b(d.plancherPlaco) },
        { label: "Plancher hourdis", value: b(d.plancherHourdis) },
      ],
    },
    {
      title: "Chauffage actuel",
      rows: [
        { label: "Bois", value: b(d.chauffageBois) },
        { label: "Fioul", value: b(d.chauffageFioul) },
        { label: "Gaz", value: b(d.chauffageGaz) },
        { label: "Radiateurs électriques", value: b(d.chauffageRadiateursElec) },
        { label: "Autre chauffage", value: b(d.chauffageAutre) },
        { label: "Précision autre", value: val(d.chauffageAutreTexte) },
        { label: "Circuit hydraulique fonctionnel", value: val(d.circuitHydraulique) },
      ],
    },
    {
      title: "Type de radiateurs",
      rows: [
        { label: "Radiateurs alu", value: b(d.radiateurAlu) },
        { label: "Radiateurs acier", value: b(d.radiateurAcier) },
        { label: "Radiateurs fonte", value: b(d.radiateurFonte) },
        { label: "Plancher chauffant", value: b(d.plancherChauffant) },
        { label: "Nombre de radiateurs", value: val(d.nombreRadiateurs) },
      ],
    },
    {
      title: "Thermostats",
      rows: [
        { label: "Kit bi-zone", value: b(d.thermostatBiZone) },
        { label: "Thermostat filaire", value: b(d.thermostatFilaire) },
        { label: "Thermostat non filaire", value: b(d.thermostatNonFilaire) },
        { label: "Pas de thermostat", value: b(d.pasDeThermostat) },
      ],
    },
    {
      title: "Électricité",
      rows: [
        { label: "Monophasé", value: b(d.monophase) },
        { label: "Triphasé", value: b(d.triphase) },
        { label: "Installation aux normes", value: val(d.installationAuxNormes) },
        { label: "Ampérage disjoncteur général", value: val(d.amperageDisjoncteur, " A") },
        { label: "Ampérage max", value: val(d.amperageMax, " A") },
        { label: "Emplacement tableau principal", value: val(d.emplacementTableauPrincipal) },
        { label: "Linky", value: val(d.linky) },
        { label: "Abonnement kVA", value: val(d.abonnementKva, " kVA") },
      ],
    },
    {
      title: "PAC Air-eau",
      rows: [
        { label: "Monobloc Hybea", value: b(d.pacMonoblocHybea) },
        { label: "Bi-bloc", value: b(d.pacBiBloc) },
        { label: "Emplacement unité extérieure", value: val(d.emplacementUniteExterieure) },
        { label: "Emplacement unité intérieure", value: val(d.emplacementUniteInterieure) },
        { label: "Distance entre modules", value: val(d.distanceEntreModules) },
        { label: "Distance PAC ↔ tableau", value: val(d.distancePacTableau) },
        { label: "Difficulté passage tableaux", value: val(d.difficultePasaggeTableaux) },
        { label: "Chape à faire PAC", value: val(d.chapeAFairePac) },
        { label: "Passage liaisons combles", value: b(d.passageLiaisonsComble) },
        { label: "Passage liaisons direct", value: b(d.passageLiaisonsDirect) },
        { label: "Passage liaisons intérieur", value: b(d.passageLiaisonsInterieur) },
        ...(d.passageLiaisonsAutres ? [{ label: "Passage liaisons autres", value: val(d.passageLiaisonsAutresTexte) }] : []),
        { label: "Tranchée à faire", value: val(d.trancheeAFairePac) },
        { label: "Sol", value: b(d.typePosePacSol) },
        { label: "Mur", value: b(d.typePosePacMur) },
        { label: "Hauteur local PAC", value: val(d.hauteurLocalPac) },
        { label: "Lève groupe PAC", value: b(d.leveGroupePac) },
        { label: "Nacelle PAC", value: b(d.nacellePac) },
      ],
    },
    {
      title: "Ballon thermodynamique",
      rows: [
        { label: "Monobloc", value: b(d.btdMonobloc) },
        { label: "Bi-bloc", value: b(d.btdBiBloc) },
        { label: "Local technique", value: b(d.btdEmplacementLocalTech) },
        { label: "Garage", value: b(d.btdEmplacementGarage) },
        { label: "Cellier", value: b(d.btdEmplacementCellier) },
        { label: "Autre", value: b(d.btdEmplacementAutre) },
        ...(d.btdEmplacementAutre ? [{ label: "Emplacement autre", value: val(d.btdEmplacementAutreTexte) }] : []),
        { label: "Unité ext au sol", value: b(d.btdGroupeExtSol) },
        { label: "Unité ext au mur", value: b(d.btdGroupeExtMur) },
        { label: "Hauteur", value: val(d.btdGroupeExtHauteur) },
        { label: "Dalle existe", value: val(d.btdDalleExiste) },
      ],
    },
    {
      title: "PAC air/air",
      rows: [
        { label: "Mono-split", value: b(d.pacAirAirMonoSplit) },
        { label: "Multi-split", value: b(d.pacAirAirMultiSplit) },
        { label: "Gainable", value: b(d.pacAirAirGainable) },
        { label: "Console", value: b(d.pacAirAirConsole) },
        { label: "Groupe ext au sol", value: b(d.pacAirAirGroupeExtSol) },
        { label: "Groupe ext au mur", value: b(d.pacAirAirGroupeExtMur) },
        { label: "Lève-groupe", value: b(d.pacAirAirLeveGroupe) },
        { label: "Nacelle", value: b(d.pacAirAirNacelle) },
        { label: "Distance", value: val(d.pacAirAirDistance) },
        { label: "Nature sol", value: val(d.pacAirAirNatureSol) },
        { label: "Hauteur", value: val(d.pacAirAirHauteur) },
        { label: "Type mur", value: val(d.pacAirAirTypeMur) },
        { label: "Tranchée longueur", value: val(d.pacAirAirTranchee) },
        { label: "Chape existante", value: b(d.pacAirAirChapeExistante) },
        { label: "Chape à faire", value: b(d.pacAirAirChapeAFaire) },
      ],
    },
    {
      title: "Splits PAC air-air (détail)",
      rows: Array.isArray(d.splits) && d.splits.length > 0
        ? d.splits.map((s: any, i: number) => ({
            label: `Split ${i + 1} — ${val(s.nomPiece)}`,
            value: `${val(s.puissanceKw, " kW")} | Dos à dos: ${val(s.dosADos)} | Pompe: ${val(s.pompeRelevage)}`,
          }))
        : [{ label: "Aucun split", value: "—" }],
    },
    {
      title: "Radiateurs (détail)",
      rows: Array.isArray(d.radiateurs) && d.radiateurs.length > 0
        ? d.radiateurs.map((r: any, i: number) => ({
            label: `Radiateur ${i + 1}`,
            value: `${val(r.materiau)} | H:${val(r.hauteur)}cm L:${val(r.largeur)}cm E:${val(r.epaisseur)}cm`,
          }))
        : [{ label: "Aucun radiateur", value: "—" }],
    },
    {
      title: "Photovoltaïque",
      rows: [
        { label: "Pose au sol", value: b(d.pvTypePoseAuSol) },
        { label: "Pose murale SSC", value: b(d.pvTypePoseMuraleSsc) },
        { label: "Pose toiture", value: b(d.pvTypePoseToiture) },
        { label: "Paysage", value: b(d.pvFormatPaysage) },
        { label: "Portrait", value: b(d.pvFormatPortrait) },
        { label: "Toiture bac acier", value: b(d.pvToitureBacAcier) },
        { label: "Toiture tuiles", value: b(d.pvToitureTuile) },
        { label: "Toiture éverite", value: b(d.pvToitureEverite) },
        { label: "Raccordement aérien", value: b(d.pvRaccordementAerien) },
        { label: "Raccordement enterré", value: b(d.pvRaccordementEnterre) },
        { label: "Devis signé", value: b(d.pvDocDevisSigne) },
        { label: "Facture EDF", value: b(d.pvDocFactureEdf) },
        { label: "Parcelle", value: b(d.pvDocParcelle) },
        { label: "Pouvoir", value: b(d.pvDocPouvoir) },
        { label: "Taxe foncière", value: b(d.pvDocTaxeFonciere) },
        { label: "Nacelle +4m", value: b(d.pvNacellePlus4m) },
      ],
    },
    {
      title: "Commentaires & particularités chantier",
      rows: [{ label: "Commentaires", value: val(d.commentaires) }],
    },
    {
      title: "Photos à faire (obligatoire)",
      rows: [
        { label: "Compteur", value: b(d.photoCompteur) },
        { label: "Chaudière à remplacer", value: b(d.photoChaudiere) },
        { label: "Emplacement groupe ext", value: b(d.photoGroupeExt) },
        { label: "Maison vue de la rue", value: b(d.photoMaison) },
        { label: "Combles", value: b(d.photoCombles) },
        { label: "Système ECS", value: b(d.photoECS) },
        { label: "Disjoncteur", value: b(d.photoDisjoncteur) },
        { label: "Tuyauterie chaudière", value: b(d.photoTuyauterie) },
        { label: "Radiateurs", value: b(d.photoRadiateurs) },
        { label: "Plafonds", value: b(d.photoPlafonds) },
        { label: "Sous-sol", value: b(d.photoSousSol) },
        { label: "Tableaux électriques", value: b(d.photoTableauElec) },
        { label: "Ventilation", value: b(d.photoVentilation) },
        { label: "Unités intérieures", value: b(d.photoUniteInt) },
        { label: "Planchers", value: b(d.photoPlancher) },
        { label: "Rez-de-chaussée", value: b(d.photoRDC) },
        { label: "Fenêtres", value: b(d.photoFenetres) },
        { label: "Portes-fenêtres", value: b(d.photoPorteFenetre) },
        { label: "Façades extérieures", value: b(d.photoFacade) },
        { label: "Porte", value: b(d.photoPorte) },
      ],
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Main handler                                                       */
/* ------------------------------------------------------------------ */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // Verify caller is admin
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Accès réservé aux administrateurs" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request
    const { type, id } = await req.json();
    if (!type || !id) {
      return new Response(JSON.stringify({ error: "type et id requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let payload: any;
    let clientName: string;
    let userId: string;

    if (type === "etude") {
      const { data, error } = await supabaseAdmin
        .from("etudes_energetiques")
        .select("payload, client_name, user_id")
        .eq("id", id)
        .single();
      if (error || !data) {
        return new Response(JSON.stringify({ error: "Étude introuvable" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      payload = data.payload;
      clientName = data.client_name || "Client";
      userId = data.user_id;
    } else if (type === "dossier") {
      const { data, error } = await supabaseAdmin
        .from("dossiers")
        .select("payload, client_name, user_id")
        .eq("id", id)
        .single();
      if (error || !data) {
        return new Response(JSON.stringify({ error: "Dossier introuvable" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      payload = data.payload;
      clientName = data.client_name || "Client";
      userId = data.user_id;
    } else {
      return new Response(JSON.stringify({ error: "type doit être 'etude' ou 'dossier'" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build PDF
    const sections = type === "etude"
      ? buildEtudeSections(payload)
      : buildDossierSections(payload);

    const pdfTitle = type === "etude" ? `Étude — ${clientName}` : `Dossier de liaison — ${clientName}`;
    const pdfBytes = buildPdf(sections, pdfTitle);
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

    // Upload to storage
    const now = new Date();
    const ts = now.toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const prefix = type === "etude" ? "etudes" : "liaison";
    const filename = type === "etude"
      ? `Etude_NRJ_${clientName}_serveur.pdf`
      : `Dossier_Liaison_${clientName}_serveur.pdf`;
    const storagePath = `${userId}/${prefix}/${filename}-${ts}`;

    const { error: uploadErr } = await supabaseAdmin.storage
      .from("pdfs")
      .upload(storagePath, pdfBlob, { contentType: "application/pdf", upsert: false });

    if (uploadErr) {
      return new Response(JSON.stringify({ error: `Upload échoué: ${uploadErr.message}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update record with new pdf_path
    const table = type === "etude" ? "etudes_energetiques" : "dossiers";
    const { error: updateErr } = await supabaseAdmin
      .from(table)
      .update({ pdf_path: storagePath })
      .eq("id", id);

    if (updateErr) {
      await supabaseAdmin.storage.from("pdfs").remove([storagePath]);
      return new Response(JSON.stringify({ error: `Mise à jour échouée: ${updateErr.message}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create signed URL for immediate download
    const { data: signedData } = await supabaseAdmin.storage
      .from("pdfs")
      .createSignedUrl(storagePath, 120);

    return new Response(
      JSON.stringify({
        success: true,
        pdf_path: storagePath,
        signed_url: signedData?.signedUrl ?? null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[generate-pdf] Error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Erreur interne" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
