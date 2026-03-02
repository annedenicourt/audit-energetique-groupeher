import React, { useEffect, useRef, useState } from "react";
import { FileCheck, User, Home, Receipt, BarChart3, TrendingUp, Wallet, Banknote, Layers, Grid3X3, Flame, Zap, Building2, Thermometer, Wind, BadgeEuro, FileText, Sun, CreditCard, Check, X, NotebookTabs } from "lucide-react";
import SectionCard from "./SectionCard";
import { FormData } from "@/types/formData";
import html2pdf from "html2pdf.js";
import { DossierFormData } from "@/types/dossierFormData";

interface PdfContentCommercialProps {
  data: DossierFormData;
}

// Composant pour afficher une ligne de résumé
const SummaryRow: React.FC<{ label: string; value }> = ({ label, value }) => (
  <div className="flex justify-between py-1 border-b border-border/50 last:border-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-sm text-foreground">{value || "—"}</span>
  </div>
);
const DisplayTrue = <Check className="text-lime-500" strokeWidth={6} />
//const DisplayFalse = <X className="text-red-500" strokeWidth={6} />
const DisplayFalse = "—"

const PdfContentDossier: React.FC<PdfContentCommercialProps> = ({ data }) => {
  const pagesRef = useRef<HTMLDivElement | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!pagesRef.current) return;
    const pages =
      pagesRef.current.querySelectorAll(".a4-page");
    setTotalPages(pages.length);
  }, []);

  return (
    <div ref={pagesRef}>
      <div className="a4-page flex flex-col justify-between ">
        <div className="space-y-1">
          {/* Client */}
          <SectionCard title="Client" icon={User} className="">
            <div className="grid gap-x-8">
              <SummaryRow label="Conseiller" value={data.conseiller} />
              <SummaryRow label="Perso" value={data.perso} />
              <SummaryRow label="Nom client" value={data.nomClient} />
              <SummaryRow label="Téléphone" value={data.telephone} />
            </div>
            <div>
              <SummaryRow label="Adresse fiscale" value={data.adresse} />
              <SummaryRow label="Adresse de chantier" value={data.adresseInstallation} />
            </div>
          </SectionCard>
          {/* Règlement */}
          <SectionCard title="Règlement" icon={CreditCard} className="">
            <div className="grid gap-x-8">
              <SummaryRow label="Chèque" value={data.reglementCheque ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Financement" value={data.reglementFinancement ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="PTZ" value={data.reglementPTZ ? DisplayTrue : DisplayFalse} />
            </div>
          </SectionCard>
          {/* Dossier de prime */}
          <SectionCard title="Dossier de prime" icon={CreditCard} className="">
            <div className="grid gap-x-8">
              <SummaryRow label="Propriétaire occupant" value={data.proprietaireOccupant ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Propriétaire bailleur" value={data.proprietaireBailleur ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Résidence secondaire" value={data.residSecondaire ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="SCI" value={data.sci ? DisplayTrue : DisplayFalse} />
            </div>
          </SectionCard>
        </div>
        <div className="mt-4 text-white text-center">
          Page 1 / {totalPages}
        </div>
      </div>
      <div className="a4-page flex flex-col justify-between">
        <div className="space-y-1">
          {/* Pièces / Attestations */}
          <SectionCard title="Pièces / Attestations" icon={FileText}>
            <div className="grid gap-x-8">
              <SummaryRow label="Devis non signé" value={data.devisNonSigne ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Devis signé" value={data.devisSigne ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Carte identité" value={data.carteIdentite ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="2 derniers avis d'impôts" value={data.deuxDerniersAvisImpots ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Taxe foncière ou acte notarié" value={data.taxeFonciereActeNotarie ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Mandat MaPrimeRénov" value={data.mandatMaPrimeRenov ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Identité numérique" value={data.idNumerique ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Attestation fioul" value={data.attestationFioul ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Attestation indivisionnaire" value={data.attestationIndivisionnaire ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Attestation bailleur" value={data.attestationProprietaireBailleur ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Note de dimensionnement" value={data.noteDimensionnement ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Revolt" value={data.revolt ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Pouvoir" value={data.pouvoir ? DisplayTrue : DisplayFalse} />
            </div>
          </SectionCard>
          {/* Aides / Mails */}
          <SectionCard title="Prime EDF / MaPrimeRénov'" icon={BadgeEuro}>
            <SummaryRow label="Montant Prime EDF" value={data.montantPrimeEDF ? `${data.montantPrimeEDF} €` : ""} />
            <SummaryRow label="Mail Prime EDF" value={data.mailPrimeEDF} />
            <SummaryRow label="MDP Prime EDF" value={data.mdpPrimeEDF} />
            <SummaryRow label="Montant MaPrimeRénov" value={data.montantPrimeRenov ? `${data.montantPrimeRenov} €` : ""} />
            <SummaryRow label="Mail MaPrimeRénov" value={data.mailPrimeRenov} />
            <SummaryRow label="MDP MaPrimeRénov" value={data.mdpPrimeRenov} />
            <SummaryRow label="Gmail créé" value={data.gmailCree} />
            <SummaryRow label="MDP Gmail" value={data.mdpGmail} />
          </SectionCard>
        </div>
        <div className="mt-4 text-white text-center">
          Page 2 / {totalPages}
        </div>
      </div>
      <div className="a4-page flex flex-col justify-between space-y-1">
        <div className="space-y-1">
          {/* Dossier de financement */}
          <SectionCard title="Dossier de financement">
            <SummaryRow label="Justificatif domicile" value={data.justificatifDomicile ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Bulletins salaires" value={data.bulletinsSalaires ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Bilan (entrepreneur)" value={data.bilanEntrepreneur ? DisplayTrue : DisplayFalse} />
          </SectionCard>
          {/* Habitation */}
          <SectionCard title="Habitation" icon={Home}>
            <div className="grid gap-x-8">
              <SummaryRow label="Année de construction" value={data.anneeConstruction} />
              <SummaryRow label="Plain-pied" value={data.plainPied ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Étages" value={data.etages ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Nombre d'étages" value={data.nbEtages} />
              <SummaryRow label="Sous-sol" value={data.sousSol ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Vide sanitaire" value={data.videSanitaire ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Vide sanitaire accessible" value={data.videSanitaireAccessible ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Menuiseries à changer (quantité)" value={data.quantiteFenetres} />
              <SummaryRow label="Menuiseries à changer (matière)" value={data.matiereFenetres} />
              <SummaryRow label="Volets roulants (quantité)" value={data.quantiteVolets} />
            </div>
          </SectionCard>
          {/* Murs */}
          <SectionCard title="Murs" icon={Layers}>
            <div className="grid gap-x-8">
              <SummaryRow label="Type de mur" value={data.typeMur} />
              <SummaryRow label="Épaisseur mur (en cm)" value={data.epaisseurMur} />
            </div>
          </SectionCard>
        </div>
        <div className="mt-4 text-white text-center">
          Page 3 / {totalPages}
        </div>
      </div>
      <div className="a4-page flex flex-col justify-between space-y-1">
        <div className="space-y-1">
          {/* Combles */}
          <SectionCard title="Combles" icon={Layers}>
            <div className="grid gap-x-8">
              <SummaryRow label="Combles perdus" value={data.comblePerdu ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Combles aménagés" value={data.combleAmenage ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Combles perdus accessibles" value={data.comblePerduAccessible ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Accès trappe" value={data.comblePerduTrappe ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Accès toit" value={data.comblePerduToit ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Accès autre" value={data.comblePerduAutre ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Précision autre" value={data.comblePerduAutreTexte} />
            </div>
          </SectionCard>
          {/* Planchers */}
          <SectionCard title="Planchers" icon={Grid3X3}>
            <div className="grid gap-x-8">
              <SummaryRow label="Plancher bois" value={data.plancherBois ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Plancher placo" value={data.plancherPlaco ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Plancher hourdis" value={data.plancherHourdis ? DisplayTrue : DisplayFalse} />
            </div>
          </SectionCard>
          {/* Chauffage actuel */}
          <SectionCard title="Chauffage actuel" icon={Flame}>
            <div className="grid gap-x-8">
              <SummaryRow label="Bois" value={data.chauffageBois ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Fioul" value={data.chauffageFioul ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Gaz" value={data.chauffageGaz ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Radiateurs électriques" value={data.chauffageRadiateursElec ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Autre chauffage" value={data.chauffageAutre ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Précision autre" value={data.chauffageAutreTexte} />
              <SummaryRow label="Circuit hydraulique fonctionnel" value={data.circuitHydraulique} />
            </div>
          </SectionCard>

        </div>
        <div className="mt-4 text-white text-center">
          Page 4 / {totalPages}
        </div>
      </div>
      <div className="a4-page flex flex-col justify-between space-y-1">
        <div className="space-y-1">
          {/* Type de radiateurs */}
          <SectionCard title="Type de radiateurs" icon={Flame}>
            <div className="grid gap-x-8">
              <SummaryRow label="Radiateurs alu" value={data.radiateurAlu ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Radiateurs acier" value={data.radiateurAcier ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Radiateurs fonte" value={data.radiateurFonte ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Plancher chauffant" value={data.plancherChauffant ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Nombre de radiateurs" value={data.nombreRadiateurs} />
            </div>
          </SectionCard>
          {/* Thermostats */}
          <SectionCard title="Thermostats" icon={Flame}>
            <div className="grid gap-x-8">
              <SummaryRow label="Kit bi-zone" value={data.thermostatBiZone ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Thermostat filaire" value={data.thermostatFilaire ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Thermostat non filaire" value={data.thermostatNonFilaire ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Plancher chauffant" value={data.plancherChauffant ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Pas de thermostat" value={data.pasDeThermostat} />
            </div>
          </SectionCard>
          {/* Électricité */}
          <SectionCard title="Électricité" icon={Zap}>
            <div className="grid gap-x-8">
              <SummaryRow label="Monophasé" value={data.monophase ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Triphasé" value={data.triphase ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Installation aux normes" value={data.installationAuxNormes} />
              <SummaryRow label="Ampérage disjoncteur général" value={data.amperageDisjoncteur ? `${data.amperageDisjoncteur} A` : ""} />
              <SummaryRow label="Ampérage max" value={data.amperageMax ? `${data.amperageMax} A` : ""} />
              <SummaryRow label="Emplacement tableau principal" value={data.emplacementTableauPrincipal} />
              <SummaryRow label="Linky" value={data.linky} />
              <SummaryRow label="Abonnement kVA" value={data.abonnementKva ? `${data.abonnementKva} kVA` : ""} />
            </div>
          </SectionCard>
        </div>
        <div className="mt-4 text-white text-center">
          Page 5 / {totalPages}
        </div>
      </div>
      <div className="a4-page flex flex-col justify-between space-y-1">
        <div className="space-y-1">
          {/* PAC Air-eau */}
          <SectionCard title="PAC Air-eau" icon={Thermometer}>
            <div className="grid gap-x-8">
              <SummaryRow label="Monobloc Hybea" value={data.pacMonoblocHybea ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Bi-bloc" value={data.pacBiBloc ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Emplacement unité extérieure" value={data.emplacementUniteExterieure} />
              <SummaryRow label="Emplacement unité intérieure" value={data.emplacementUniteInterieure} />
              <SummaryRow label="Distance entre les 2 modules" value={data.distanceEntreModules} />
              <SummaryRow label="Distance PAC ↔ tableau" value={data.distancePacTableau} />
              <SummaryRow label="Difficulté passage tableaux" value={data.difficultePasaggeTableaux} />
              <SummaryRow label="Chape à faire PAC" value={data.chapeAFairePac} />
              <SummaryRow label="Passage liaisons combles" value={data.passageLiaisonsComble ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Passage liaisons direct" value={data.passageLiaisonsDirect ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Passage liaisons intérieur" value={data.passageLiaisonsInterieur ? DisplayTrue : DisplayFalse} />
              {data.passageLiaisonsAutres &&
                <SummaryRow label="Passage liaisons autres" value={data.passageLiaisonsAutresTexte} />
              }
              <SummaryRow label="Tranchée à faire" value={data.trancheeAFairePac} />
              <SummaryRow label="Sol" value={data.typePosePacSol ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Mur" value={data.typePosePacMur ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Hauteur local PAC" value={data.hauteurLocalPac} />
              <SummaryRow label="Lève groupe PAC" value={data.leveGroupePac ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Nacelle PAC" value={data.nacellePac ? DisplayTrue : DisplayFalse} />
            </div>
          </SectionCard>
        </div>
        <div className="mt-4 text-white text-center">
          Page 6 / {totalPages}
        </div>
      </div>
      <div className="a4-page flex flex-col justify-between space-y-1">
        <div className="space-y-1">
          {/* BTD */}
          <SectionCard title="Ballon thermodynamique" icon={Thermometer}>
            <div className="grid gap-x-8">
              <SummaryRow label="Monobloc" value={data.btdMonobloc ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Bi-bloc" value={data.btdBiBloc ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Emplacement ballon local technique" value={data.btdEmplacementLocalTech ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Emplacement ballon garage" value={data.btdEmplacementGarage ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Emplacement ballon cellier" value={data.btdEmplacementCellier ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Emplacement ballon autre" value={data.btdEmplacementAutre ? DisplayTrue : DisplayFalse} />
              {data.btdEmplacementAutre && (
                <SummaryRow label="Emplacement autre" value={data.btdEmplacementAutreTexte} />
              )}
              <SummaryRow label="Unité extérieure au sol" value={data.btdGroupeExtSol ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Unité extérieure au mur" value={data.btdGroupeExtMur ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Hauteur" value={data.btdGroupeExtHauteur} />
              <SummaryRow label="Dalle existe" value={data.btdDalleExiste} />
            </div>
          </SectionCard>
          {/* PAC air/air */}
          <SectionCard title="PAC air/air" icon={Wind}>
            <div className="grid gap-x-8">
              <SummaryRow label="Mono-split" value={data.pacAirAirMonoSplit ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Multi-split" value={data.pacAirAirMultiSplit ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Gainable" value={data.pacAirAirGainable ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Console" value={data.pacAirAirConsole ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Groupe extérieur au sol" value={data.pacAirAirGroupeExtSol ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Groupe extérieur au mur" value={data.pacAirAirGroupeExtMur ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Lève-groupe (+ de 1m et -5m)" value={data.pacAirAirLeveGroupe ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Nacelle (+5m)" value={data.pacAirAirNacelle ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Distance" value={data.pacAirAirDistance} />
              <SummaryRow label="Nature sol" value={data.pacAirAirNatureSol} />
              <SummaryRow label="Hauteur" value={data.pacAirAirHauteur} />
              <SummaryRow label="Type mur" value={data.pacAirAirTypeMur} />
              <SummaryRow label="Tranchée longueur" value={data.pacAirAirTranchee} />
              <SummaryRow label="Chape existante" value={data.pacAirAirChapeExistante ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Chape à faire" value={data.pacAirAirChapeAFaire ? DisplayTrue : DisplayFalse} />
            </div>
          </SectionCard>


        </div>
        <div className="mt-4 text-white text-center">
          Page 7 / {totalPages}
        </div>
      </div>
      <div className="a4-page flex flex-col justify-between space-y-1">
        <div className="space-y-1">
          {/* SPLITS détail */}
          <SectionCard title="Splits PAC air-air(détail par pièces)" icon={Wind}>
            {Array.isArray(data.splits) && data.splits.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-center">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 pr-4">Pièce</th>
                      <th className="py-2 pr-4">Puissance</th>
                      <th className="py-2 pr-4">Dos à dos</th>
                      <th className="py-2 pr-4">Pompe de relevage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.splits.map((split, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-2 pr-4">{split?.nomPiece ? split?.nomPiece : "—"}</td>
                        <td className="py-2 pr-4">{split?.puissanceKw ? `${split.puissanceKw} kW` : "—"}</td>
                        <td className="py-2 pr-4">{split?.dosADos ? split?.dosADos : "—"}</td>
                        <td className="py-2 pr-4">{split?.pompeRelevage ? split.pompeRelevage : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Aucun split renseigné.</div>
            )}
          </SectionCard>
          {/* RADIATEURS */}
          <SectionCard title="Radiateurs (détail)" icon={Sun}>
            {Array.isArray(data.radiateurs) && data.radiateurs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-center">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 pr-4">Matériau</th>
                      <th className="py-2 pr-4">Hauteur</th>
                      <th className="py-2 pr-4">Largeur</th>
                      <th className="py-2 pr-4">Épaisseur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.radiateurs.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-2 pr-4">{item?.materiau ? item?.materiau : "—"}</td>
                        <td className="py-2 pr-4">{item?.hauteur ? `${item.hauteur} cm` : "—"}</td>
                        <td className="py-2 pr-4">{item?.largeur ? `${item.largeur} cm` : "—"}</td>
                        <td className="py-2 pr-4">{item?.epaisseur ? `${item.epaisseur} cm` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Aucun radiateur renseigné.</div>
            )}
          </SectionCard>
        </div>
        <div className="mt-4 text-white text-center">
          Page 8 / {totalPages}
        </div>
      </div>
      <div className="a4-page flex flex-col justify-between space-y-1">
        <div className="space-y-1">
          {/* PV */}
          <SectionCard title="Photovoltaïque" icon={Sun}>
            <div className="grid gap-x-8">
              <SummaryRow label="Pose au sol" value={data.pvTypePoseAuSol ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Pose murale SSC" value={data.pvTypePoseMuraleSsc ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Pose toiture" value={data.pvTypePoseToiture ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Paysage" value={data.pvFormatPaysage ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Portrait" value={data.pvFormatPortrait ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Toiture bac acier" value={data.pvToitureBacAcier ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Toiture tuiles" value={data.pvToitureTuile ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Toiture éverite" value={data.pvToitureEverite ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Raccordement aérien" value={data.pvRaccordementAerien ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Raccordement enterré" value={data.pvRaccordementEnterre ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Docs : devis signé" value={data.pvDocDevisSigne ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Docs : facture EDF" value={data.pvDocFactureEdf ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Docs : parcelle" value={data.pvDocParcelle ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Docs : pouvoir" value={data.pvDocPouvoir ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Docs : taxe foncière" value={data.pvDocTaxeFonciere ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Nacelle +4m" value={data.pvNacellePlus4m ? DisplayTrue : DisplayFalse} />
              {/* <SummaryRow label="Taille SSC" value={data.pvSscTaille} /> */}
            </div>
          </SectionCard>
          {/* Commentaires*/}
          <SectionCard title="Commentaires & particularités chantier" icon={NotebookTabs}>
            <div className="text-sm">
              {data.commentaires}
            </div>
          </SectionCard>
        </div>
        <div className="mt-4 text-white text-center">
          Page 9 / {totalPages}
        </div>
      </div>
      <div className="a4-page flex flex-col justify-between space-y-1">
        <div className="space-y-1">
          {/* Photos checklist */}
          <SectionCard title="Photos à faire (obligatoire)">
            <h3 className="font-semibold text-lime-600 mb-2">Équipement</h3>
            <div className="grid gap-x-8">
              <SummaryRow label="Compteur" value={data.photoCompteur ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Chaudière à remplacer" value={data.photoChaudiere ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Emplacement du groupe extérieur" value={data.photoGroupeExt ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Maison vue de la rue" value={data.photoMaison ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Combles" value={data.photoCombles ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Système ECS" value={data.photoECS ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Disjoncteur" value={data.photoDisjoncteur ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Tuyauterie de la chaudière" value={data.photoTuyauterie ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Radiateurs" value={data.photoRadiateurs ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Plafonds" value={data.photoPlafonds ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Sous-sol" value={data.photoSousSol ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Tableaux électriques existants" value={data.photoTableauElec ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Ventilation" value={data.photoVentilation ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Emplacement des unités intérieures" value={data.photoUniteInt ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Planchers" value={data.photoPlancher ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Rez-de-chaussée" value={data.photoRDC ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Fenêtres" value={data.photoFenetres ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Portes-fenêtres" value={data.photoPorteFenetre ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Façades extérieures" value={data.photoFacade ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Porte" value={data.photoPorte ? DisplayTrue : DisplayFalse} />
            </div>
          </SectionCard>
        </div>
        <div className="mt-4 text-white text-center">
          Page {totalPages} / {totalPages}
        </div>
      </div>
    </div>
  );
};

export default PdfContentDossier;