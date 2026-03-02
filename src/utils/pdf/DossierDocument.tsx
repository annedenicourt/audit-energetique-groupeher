/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { styles } from "./styles";
import PdfSection, { val } from "./PdfSection";
import { Check } from "lucide-react";

/* const b = (v: unknown) => (v ? "✓" : "—");
 */

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
      { label: `Radiateur ${i + 1} — Dimensions`, value: `${val(r.hauteur)}×${val(r.largeur)}×${val(r.epaisseur)} cm` },
    ])
    : [];

  return (
    <Document>
      {/* Cover */}
      <Page size="A4" style={[styles.page, styles.coverPage]}>
        <Image src={"/images/couv_dossier_liaison.png"}></Image>
      </Page>

      {/* Content */}
      <Page size="A4" style={styles.page}>
        <PdfSection title="Client" rows={[
          { label: "Accompagnateur", value: val(d.conseiller) },
          { label: "Perso", value: d.perso },
          { label: "Nom client", value: val(d.nomClient) },
          { label: "Téléphone", value: val(d.telephone) },
          { label: "Adresse fiscale", value: val(d.adresse) },
          { label: "Adresse de chantier", value: val(d.adresseInstallation) },
        ]} />

        <PdfSection title="Règlement" rows={[
          { label: "Chèque", value: d.reglementCheque },
          { label: "Financement", value: d.reglementFinancement },
          { label: "PTZ", value: d.reglementPTZ },
        ]} />

        <PdfSection title="Dossier de prime" rows={[
          { label: "Propriétaire occupant", value: d.proprietaireOccupant },
          { label: "Propriétaire bailleur", value: d.proprietaireBailleur },
          { label: "Résidence secondaire", value: d.residSecondaire },
          { label: "SCI", value: d.sci },
        ]} />

        <PdfSection title="Pièces / Attestations" rows={[
          { label: "Devis non signé", value: d.devisNonSigne },
          { label: "Devis signé", value: d.devisSigne },
          { label: "Carte identité", value: d.carteIdentite },
          { label: "2 derniers avis d'impôts", value: d.deuxDerniersAvisImpots },
          { label: "Taxe foncière / acte notarié", value: d.taxeFonciereActeNotarie },
          { label: "Mandat MaPrimeRénov", value: d.mandatMaPrimeRenov },
          { label: "Identité numérique", value: d.idNumerique },
          { label: "Attestation fioul", value: d.attestationFioul },
          { label: "Attestation indivisionnaire", value: d.attestationIndivisionnaire },
          { label: "Attestation bailleur", value: d.attestationProprietaireBailleur },
          { label: "Note dimensionnement", value: d.noteDimensionnement },
          { label: "Revolt", value: d.revolt },
          { label: "Pouvoir", value: d.pouvoir },
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
          { label: "Justificatif domicile", value: d.justificatifDomicile },
          { label: "Bulletins salaires", value: d.bulletinsSalaires },
          { label: "Bilan (entrepreneur)", value: d.bilanEntrepreneur },
        ]} />

        <PdfSection title="Habitation" rows={[
          { label: "Année de construction", value: val(d.anneeConstruction) },
          { label: "Plain-pied", value: d.plainPied },
          { label: "Étages", value: d.etages },
          { label: "Nombre d'étages", value: val(d.nbEtages) },
          { label: "Sous-sol", value: d.sousSol },
          { label: "Vide sanitaire", value: d.videSanitaire },
          { label: "VS accessible", value: d.videSanitaireAccessible },
          { label: "Menuiseries à changer (qté)", value: val(d.quantiteFenetres) },
          { label: "Menuiseries (matière)", value: val(d.matiereFenetres) },
          { label: "Volets roulants (qté)", value: val(d.quantiteVolets) },
        ]} />

        <PdfSection title="Murs" rows={[
          { label: "Type de mur", value: val(d.typeMur) },
          { label: "Épaisseur (cm)", value: val(d.epaisseurMur) },
        ]} />

        <PdfSection title="Combles" rows={[
          { label: "Combles perdus", value: d.comblePerdu },
          { label: "Combles aménagés", value: d.combleAmenage },
          { label: "Perdus accessibles", value: d.comblePerduAccessible },
          { label: "Accès trappe", value: d.comblePerduTrappe },
          { label: "Accès toit", value: d.comblePerduToit },
          { label: "Accès autre", value: d.comblePerduAutre },
          { label: "Précision autre", value: val(d.comblePerduAutreTexte) },
        ]} />

        <PdfSection title="Planchers" rows={[
          { label: "Plancher bois", value: d.plancherBois },
          { label: "Plancher placo", value: d.plancherPlaco },
          { label: "Plancher hourdis", value: d.plancherHourdis },
        ]} />

        <PdfSection title="Chauffage actuel" rows={[
          { label: "Fioul", value: d.chauffageFioul },
          { label: "Gaz", value: d.chauffageGaz },
          { label: "Radiateurs élec", value: d.chauffageRadiateursElec },
          { label: "Bois", value: d.chauffageBois },
          { label: "Autre", value: d.chauffageAutre },
          { label: "Précision autre", value: val(d.chauffageAutreTexte) },
          { label: "Circuit hydraulique", value: val(d.circuitHydraulique) },
          { label: "Radiateur acier", value: d.radiateurAcier },
          { label: "Radiateur alu", value: d.radiateurAlu },
          { label: "Radiateur fonte", value: d.radiateurFonte },
          { label: "Nombre radiateurs", value: val(d.nombreRadiateurs) },
          { label: "Plancher chauffant", value: d.plancherChauffant },
        ]} />

        <PdfSection title="Thermostats" rows={[
          { label: "Bi-zone", value: d.thermostatBiZone },
          { label: "Filaire", value: d.thermostatFilaire },
          { label: "Non filaire", value: d.thermostatNonFilaire },
          { label: "Pas de thermostat", value: d.pasDeThermostat },
        ]} />

        <PdfSection title="Électricité" rows={[
          { label: "Monophasé", value: d.monophase },
          { label: "Triphasé", value: d.triphase },
          { label: "Aux normes", value: val(d.installationAuxNormes) },
          { label: "Ampérage disjoncteur", value: val(d.amperageDisjoncteur) },
          { label: "Ampérage max", value: val(d.amperageMax) },
          { label: "Emplacement tableau", value: val(d.emplacementTableauPrincipal) },
          { label: "Linky", value: val(d.linky) },
          { label: "Abonnement kVA", value: val(d.abonnementKva) },
        ]} />

        <PdfSection title="PAC air-eau" rows={[
          { label: "Monobloc Hybea", value: d.pacMonoblocHybea },
          { label: "Bi-bloc", value: d.pacBiBloc },
          { label: "Unité ext.", value: val(d.emplacementUniteExterieure) },
          { label: "Unité int.", value: val(d.emplacementUniteInterieure) },
          { label: "Distance modules", value: val(d.distanceEntreModules) },
          { label: "Distance PAC-tableau", value: val(d.distancePacTableau) },
          {
            label: "Passage liaisons", value: [
              d.passageLiaisonsComble ? "Comble" : "",
              d.passageLiaisonsDirect ? "Direct" : "",
              d.passageLiaisonsInterieur ? "Intérieur" : "",
              d.passageLiaisonsAutres ? d.passageLiaisonsAutresTexte || "Autres" : "",
            ].filter(Boolean).join(", ") || "—"
          },
          { label: "Tranchée", value: val(d.trancheeAFairePac) },
          { label: "Pose sol", value: d.typePosePacSol },
          { label: "Pose mur", value: d.typePosePacMur },
          { label: "Hauteur local", value: val(d.hauteurLocalPac) },
        ]} />

        <PdfSection title="BTD" rows={[
          { label: "Monobloc", value: d.btdMonobloc },
          { label: "Bi-bloc", value: d.btdBiBloc },
          { label: "Groupe ext. sol", value: d.btdGroupeExtSol },
          { label: "Groupe ext. mur", value: d.btdGroupeExtMur },
          { label: "Hauteur", value: val(d.btdGroupeExtHauteur) },
          { label: "Dalle existe", value: val(d.btdDalleExiste) },
          { label: "Accessible", value: val(d.btdAccessible) },
        ]} />

        {splitRows.length > 0 && (
          <PdfSection title="PAC air-air — Splits" rows={splitRows} />
        )}

        <PdfSection title="PAC air-air" rows={[
          { label: "Mono-split", value: d.pacAirAirMonoSplit },
          { label: "Multi-split", value: d.pacAirAirMultiSplit },
          { label: "Console", value: d.pacAirAirConsole },
          { label: "Gainable", value: d.pacAirAirGainable },
          { label: "Groupe ext. sol", value: d.pacAirAirGroupeExtSol },
          { label: "Groupe ext. mur", value: d.pacAirAirGroupeExtMur },
          { label: "Distance", value: val(d.pacAirAirDistance) },
          { label: "Tranchée", value: val(d.pacAirAirTranchee) },
        ]} />

        <PdfSection title="PV / SSC" rows={[
          { label: "Pose au sol", value: d.pvTypePoseAuSol },
          { label: "Pose toiture", value: d.pvTypePoseToiture },
          { label: "Murale SSC", value: d.pvTypePoseMuraleSsc },
          { label: "Format portrait", value: d.pvFormatPortrait },
          { label: "Format paysage", value: d.pvFormatPaysage },
          { label: "Bac acier", value: d.pvToitureBacAcier },
          { label: "Everite", value: d.pvToitureEverite },
          { label: "Tuile", value: d.pvToitureTuile },
          { label: "Raccordement enterré", value: d.pvRaccordementEnterre },
          { label: "Raccordement aérien", value: d.pvRaccordementAerien },
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
