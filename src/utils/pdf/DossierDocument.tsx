import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import PdfSection, { val } from "./PdfSection";

const b = (v: unknown) => (v ? "✓" : "—");

const DossierDocument: React.FC<{ data: any }> = ({ data: d }) => {
  const splitRows = Array.isArray(d.splits)
    ? d.splits.flatMap((s: any, i: number) => [
        { label: `Split ${i + 1} — Pièce`, value: val(s.nomPiece) },
        { label: `Split ${i + 1} — Puissance`, value: val(s.puissanceKw, " kW") },
        { label: `Split ${i + 1} — Dos à dos`, value: val(s.dosADos) },
        { label: `Split ${i + 1} — Pompe relevage`, value: val(s.pompeRelevage) },
      ])
    : [];

  const radRows = Array.isArray(d.radiateurs)
    ? d.radiateurs.flatMap((r: any, i: number) => [
        { label: `Radiateur ${i + 1} — Matériau`, value: val(r.materiau) },
        { label: `Radiateur ${i + 1} — H×L×E`, value: `${val(r.hauteur)}×${val(r.largeur)}×${val(r.epaisseur)} cm` },
      ])
    : [];

  return (
    <Document>
      {/* Cover */}
      <Page size="A4" style={[styles.page, styles.coverPage]}>
        <Text style={styles.coverTitle}>Groupe HER</Text>
        <Text style={styles.coverSubtitle}>{val(d.nomClient) || "Client"}</Text>
        <Text style={styles.coverNote}>Dossier de liaison — Document généré automatiquement</Text>
      </Page>

      {/* Content */}
      <Page size="A4" style={styles.page}>
        <PdfSection title="Client" rows={[
          { label: "Conseiller", value: val(d.conseiller) },
          { label: "Perso", value: b(d.perso) },
          { label: "Nom client", value: val(d.nomClient) },
          { label: "Téléphone", value: val(d.telephone) },
          { label: "Adresse fiscale", value: val(d.adresse) },
          { label: "Adresse installation", value: val(d.adresseInstallation) },
        ]} />

        <PdfSection title="Règlement" rows={[
          { label: "Chèque", value: b(d.reglementCheque) },
          { label: "Financement", value: b(d.reglementFinancement) },
          { label: "PTZ", value: b(d.reglementPTZ) },
        ]} />

        <PdfSection title="Dossier de prime" rows={[
          { label: "Propriétaire occupant", value: b(d.proprietaireOccupant) },
          { label: "Propriétaire bailleur", value: b(d.proprietaireBailleur) },
          { label: "Résidence secondaire", value: b(d.residSecondaire) },
          { label: "SCI", value: b(d.sci) },
        ]} />

        <PdfSection title="Pièces / Attestations" rows={[
          { label: "Devis non signé", value: b(d.devisNonSigne) },
          { label: "Devis signé", value: b(d.devisSigne) },
          { label: "Carte identité", value: b(d.carteIdentite) },
          { label: "2 derniers avis d'impôts", value: b(d.deuxDerniersAvisImpots) },
          { label: "Taxe foncière / acte notarié", value: b(d.taxeFonciereActeNotarie) },
          { label: "Mandat MaPrimeRénov", value: b(d.mandatMaPrimeRenov) },
          { label: "Identité numérique", value: b(d.idNumerique) },
          { label: "Attestation fioul", value: b(d.attestationFioul) },
          { label: "Attestation indivisionnaire", value: b(d.attestationIndivisionnaire) },
          { label: "Attestation bailleur", value: b(d.attestationProprietaireBailleur) },
          { label: "Note dimensionnement", value: b(d.noteDimensionnement) },
          { label: "Revolt", value: b(d.revolt) },
          { label: "Pouvoir", value: b(d.pouvoir) },
        ]} />

        <PdfSection title="Prime EDF / MaPrimeRénov'" rows={[
          { label: "Montant Prime EDF", value: val(d.montantPrimeEDF, " €") },
          { label: "Mail Prime EDF", value: val(d.mailPrimeEDF) },
          { label: "MDP Prime EDF", value: val(d.mdpPrimeEDF) },
          { label: "Montant MaPrimeRénov", value: val(d.montantPrimeRenov, " €") },
          { label: "Mail MaPrimeRénov", value: val(d.mailPrimeRenov) },
          { label: "MDP MaPrimeRénov", value: val(d.mdpPrimeRenov) },
          { label: "Gmail créé", value: val(d.gmailCree) },
          { label: "MDP Gmail", value: val(d.mdpGmail) },
        ]} />

        <PdfSection title="Dossier de financement" rows={[
          { label: "Justificatif domicile", value: b(d.justificatifDomicile) },
          { label: "Bulletins salaires", value: b(d.bulletinsSalaires) },
          { label: "Bilan (entrepreneur)", value: b(d.bilanEntrepreneur) },
        ]} />

        <PdfSection title="Habitation" rows={[
          { label: "Année de construction", value: val(d.anneeConstruction) },
          { label: "Plain-pied", value: b(d.plainPied) },
          { label: "Étages", value: b(d.etages) },
          { label: "Nombre d'étages", value: val(d.nbEtages) },
          { label: "Sous-sol", value: b(d.sousSol) },
          { label: "Vide sanitaire", value: b(d.videSanitaire) },
          { label: "VS accessible", value: b(d.videSanitaireAccessible) },
          { label: "Menuiseries à changer (qté)", value: val(d.quantiteFenetres) },
          { label: "Menuiseries (matière)", value: val(d.matiereFenetres) },
          { label: "Volets roulants (qté)", value: val(d.quantiteVolets) },
        ]} />

        <PdfSection title="Murs" rows={[
          { label: "Type de mur", value: val(d.typeMur) },
          { label: "Épaisseur (cm)", value: val(d.epaisseurMur) },
        ]} />

        <PdfSection title="Combles" rows={[
          { label: "Combles perdus", value: b(d.comblePerdu) },
          { label: "Combles aménagés", value: b(d.combleAmenage) },
          { label: "Perdus accessibles", value: b(d.comblePerduAccessible) },
          { label: "Accès trappe", value: b(d.comblePerduTrappe) },
          { label: "Accès toit", value: b(d.comblePerduToit) },
          { label: "Accès autre", value: b(d.comblePerduAutre) },
          { label: "Précision autre", value: val(d.comblePerduAutreTexte) },
        ]} />

        <PdfSection title="Planchers" rows={[
          { label: "Plancher bois", value: b(d.plancherBois) },
          { label: "Plancher placo", value: b(d.plancherPlaco) },
          { label: "Plancher hourdis", value: b(d.plancherHourdis) },
        ]} />

        <PdfSection title="Chauffage actuel" rows={[
          { label: "Fioul", value: b(d.chauffageFioul) },
          { label: "Gaz", value: b(d.chauffageGaz) },
          { label: "Radiateurs élec", value: b(d.chauffageRadiateursElec) },
          { label: "Bois", value: b(d.chauffageBois) },
          { label: "Autre", value: b(d.chauffageAutre) },
          { label: "Précision autre", value: val(d.chauffageAutreTexte) },
          { label: "Circuit hydraulique", value: val(d.circuitHydraulique) },
          { label: "Radiateur acier", value: b(d.radiateurAcier) },
          { label: "Radiateur alu", value: b(d.radiateurAlu) },
          { label: "Radiateur fonte", value: b(d.radiateurFonte) },
          { label: "Nombre radiateurs", value: val(d.nombreRadiateurs) },
          { label: "Plancher chauffant", value: b(d.plancherChauffant) },
        ]} />

        <PdfSection title="Thermostats" rows={[
          { label: "Bi-zone", value: b(d.thermostatBiZone) },
          { label: "Filaire", value: b(d.thermostatFilaire) },
          { label: "Non filaire", value: b(d.thermostatNonFilaire) },
          { label: "Pas de thermostat", value: b(d.pasDeThermostat) },
        ]} />

        <PdfSection title="Électricité" rows={[
          { label: "Monophasé", value: b(d.monophase) },
          { label: "Triphasé", value: b(d.triphase) },
          { label: "Aux normes", value: val(d.installationAuxNormes) },
          { label: "Ampérage disjoncteur", value: val(d.amperageDisjoncteur) },
          { label: "Ampérage max", value: val(d.amperageMax) },
          { label: "Emplacement tableau", value: val(d.emplacementTableauPrincipal) },
          { label: "Linky", value: val(d.linky) },
          { label: "Abonnement kVA", value: val(d.abonnementKva) },
        ]} />

        <PdfSection title="PAC air-eau" rows={[
          { label: "Monobloc Hybea", value: b(d.pacMonoblocHybea) },
          { label: "Bi-bloc", value: b(d.pacBiBloc) },
          { label: "Unité ext.", value: val(d.emplacementUniteExterieure) },
          { label: "Unité int.", value: val(d.emplacementUniteInterieure) },
          { label: "Distance modules", value: val(d.distanceEntreModules) },
          { label: "Distance PAC-tableau", value: val(d.distancePacTableau) },
          { label: "Passage liaisons", value: [
            d.passageLiaisonsComble ? "Comble" : "",
            d.passageLiaisonsDirect ? "Direct" : "",
            d.passageLiaisonsInterieur ? "Intérieur" : "",
            d.passageLiaisonsAutres ? d.passageLiaisonsAutresTexte || "Autres" : "",
          ].filter(Boolean).join(", ") || "—" },
          { label: "Tranchée", value: val(d.trancheeAFairePac) },
          { label: "Pose sol", value: b(d.typePosePacSol) },
          { label: "Pose mur", value: b(d.typePosePacMur) },
          { label: "Hauteur local", value: val(d.hauteurLocalPac) },
        ]} />

        <PdfSection title="BTD" rows={[
          { label: "Monobloc", value: b(d.btdMonobloc) },
          { label: "Bi-bloc", value: b(d.btdBiBloc) },
          { label: "Groupe ext. sol", value: b(d.btdGroupeExtSol) },
          { label: "Groupe ext. mur", value: b(d.btdGroupeExtMur) },
          { label: "Hauteur", value: val(d.btdGroupeExtHauteur) },
          { label: "Dalle existe", value: val(d.btdDalleExiste) },
          { label: "Accessible", value: val(d.btdAccessible) },
        ]} />

        {splitRows.length > 0 && (
          <PdfSection title="PAC air-air — Splits" rows={splitRows} />
        )}

        <PdfSection title="PAC air-air" rows={[
          { label: "Mono-split", value: b(d.pacAirAirMonoSplit) },
          { label: "Multi-split", value: b(d.pacAirAirMultiSplit) },
          { label: "Console", value: b(d.pacAirAirConsole) },
          { label: "Gainable", value: b(d.pacAirAirGainable) },
          { label: "Groupe ext. sol", value: b(d.pacAirAirGroupeExtSol) },
          { label: "Groupe ext. mur", value: b(d.pacAirAirGroupeExtMur) },
          { label: "Distance", value: val(d.pacAirAirDistance) },
          { label: "Tranchée", value: val(d.pacAirAirTranchee) },
        ]} />

        <PdfSection title="PV / SSC" rows={[
          { label: "Pose au sol", value: b(d.pvTypePoseAuSol) },
          { label: "Pose toiture", value: b(d.pvTypePoseToiture) },
          { label: "Murale SSC", value: b(d.pvTypePoseMuraleSsc) },
          { label: "Format portrait", value: b(d.pvFormatPortrait) },
          { label: "Format paysage", value: b(d.pvFormatPaysage) },
          { label: "Bac acier", value: b(d.pvToitureBacAcier) },
          { label: "Everite", value: b(d.pvToitureEverite) },
          { label: "Tuile", value: b(d.pvToitureTuile) },
          { label: "Raccordement enterré", value: b(d.pvRaccordementEnterre) },
          { label: "Raccordement aérien", value: b(d.pvRaccordementAerien) },
          { label: "Taille SSC", value: val(d.pvSscTaille) },
        ]} />

        {radRows.length > 0 && (
          <PdfSection title="Radiateurs" rows={radRows} />
        )}

        {d.commentaires && (
          <PdfSection title="Commentaires" rows={[
            { label: "Commentaires", value: val(d.commentaires) },
          ]} />
        )}

        <View style={styles.footer} fixed>
          <Text>Estimatif non contractuel</Text>
        </View>
      </Page>
    </Document>
  );
};

export default DossierDocument;
