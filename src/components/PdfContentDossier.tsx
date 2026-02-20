import React, { useState } from "react";
import { FileCheck, User, Home, Receipt, BarChart3, TrendingUp, Wallet, Banknote, Layers, Grid3X3, Flame, Zap, Building2, Thermometer, Wind, BadgeEuro, FileText, Sun, CreditCard, Check, X } from "lucide-react";
import SectionCard from "./SectionCard";
import { FormData } from "@/types/formData";
import html2pdf from "html2pdf.js";
import { DossierFormData } from "@/types/dossierFormData";

interface PdfContentCommercialProps {
  data: DossierFormData;
}

// Composant pour afficher une ligne de résumé
const SummaryRow: React.FC<{ label: string; value }> = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-border/50 last:border-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-sm text-foreground">{value || "—"}</span>
  </div>
);
const DisplayTrue = <Check className="text-lime-500" strokeWidth={6} />
//const DisplayFalse = <X className="text-red-500" strokeWidth={6} />
const DisplayFalse = "—"

const PdfContentDossier: React.FC<PdfContentCommercialProps> = ({ data }) => {

  return (
    <div>
      <div className="a4-page">
        {/* Client */}
        <SectionCard title="Client" icon={User} className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryRow label="Conseiller" value={data.conseiller} />
            <SummaryRow label="Nom client" value={data.nomClient} />
            <SummaryRow label="Téléphone" value={data.telephone} />
            <SummaryRow label="Adresse" value={data.adresse} />
            <SummaryRow label="Adresse installation" value={data.adresseInstallation} />
            <SummaryRow label="Commentaire" value={data.commentaires} />
          </div>
        </SectionCard>
        {/* Aides / Mails */}
        <SectionCard title="Aides / Accès" icon={BadgeEuro} className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryRow label="Mail Prime EDF" value={data.mailPrimeEDF} />
            <SummaryRow label="Montant Prime EDF" value={data.montantPrimeEDF ? `${data.montantPrimeEDF} €` : ""} />
            <SummaryRow label="MDP Prime EDF" value={data.mdpPrimeEDF} />
            <SummaryRow label="Mail MaPrimeRénov" value={data.mailPrimeRenov} />
            <SummaryRow label="Montant MaPrimeRénov" value={data.montantPrimeRenov ? `${data.montantPrimeRenov} €` : ""} />
            <SummaryRow label="MDP MaPrimeRénov" value={data.mdpPrimeRenov} />
            <SummaryRow label="Gmail créé" value={data.gmailCree} />
            <SummaryRow label="MDP Gmail" value={data.mdpGmail} />
          </div>
        </SectionCard>
        {/* Règlement */}
        <SectionCard title="Règlement" icon={CreditCard} className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryRow label="Chèque" value={data.reglementCheque ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Financement" value={data.reglementFinancement ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="PTZ" value={data.reglementPTZ ? DisplayTrue : DisplayFalse} />
          </div>
        </SectionCard>
        {/* Pièces / Attestations */}
        <SectionCard title="Pièces / Attestations" icon={FileText} className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryRow label="Carte identité" value={data.carteIdentite ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Justificatif domicile" value={data.justificatifDomicile ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="2 derniers avis d'impôts" value={data.deuxDerniersAvisImpots ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Bulletins salaires" value={data.bulletinsSalaires ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="RIB" value={data.rib ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Attestation fioul" value={data.attestationFioul ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Attestation indivisionnaire" value={data.attestationIndivisionnaire ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Attestation bailleur" value={data.attestationProprietaireBailleur ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Mandat MaPrimeRénov" value={data.mandatMaPrimeRenov ? DisplayTrue : DisplayFalse} />
          </div>
        </SectionCard>
      </div>
      <div className="a4-page">
        {/* Habitation */}
        <SectionCard title="Habitation" icon={Home} className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryRow label="Année de construction" value={data.anneeConstruction} />
            <SummaryRow label="Plain-pied" value={data.plainPied ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Étages" value={data.etages ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Nombre d'étages" value={data.nbEtages} />
            <SummaryRow label="Sous-sol" value={data.sousSol ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Type de mur" value={data.typeMur} />
          </div>
        </SectionCard>
        {/* Combles */}
        <SectionCard title="Combles" icon={Layers} className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryRow label="Combles perdus" value={data.comblePerdu ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Combles aménagés" value={data.combleAmenage ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Trappe" value={data.comblePerduTrappe ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Accessible" value={data.comblePerduAccessible ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Toit" value={data.comblePerduToit ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Autre" value={data.comblePerduAutre ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Précision autre" value={data.comblePerduAutreTexte} />
          </div>
        </SectionCard>
        {/* Planchers */}
        <SectionCard title="Planchers" icon={Grid3X3} className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryRow label="Plancher bois" value={data.plancherBois ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Plancher placo" value={data.plancherPlaco ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Plancher hourdis" value={data.plancherHourdis ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Plancher chauffant" value={data.plancherChauffant ? DisplayTrue : DisplayFalse} />
          </div>
        </SectionCard>
      </div>
      <div className="a4-page">
        {/* Chauffage */}
        <SectionCard title="Chauffage" icon={Flame} className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryRow label="Bois" value={data.chauffageBois ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Fioul" value={data.chauffageFioul ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Gaz" value={data.chauffageGaz ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Radiateurs électriques" value={data.chauffageRadiateursElec ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Autre chauffage" value={data.chauffageAutre ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Précision autre" value={data.chauffageAutreTexte} />
            <SummaryRow label="Nombre de radiateurs" value={data.nombreRadiateurs} />
            <SummaryRow label="Radiateurs alu" value={data.radiateurAlu ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Radiateurs acier" value={data.radiateurAcier ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Radiateurs fonte" value={data.radiateurFonte ? DisplayTrue : DisplayFalse} />
          </div>
        </SectionCard>
        {/* Électricité */}
        <SectionCard title="Électricité" icon={Zap} className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryRow label="Linky" value={data.linky} />
            <SummaryRow label="Installation aux normes" value={data.installationAuxNormes} />
            <SummaryRow label="Mono" value={data.monophase ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Tri" value={data.triphase ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Abonnement kVA" value={data.abonnementKva ? `${data.abonnementKva} kVA` : ""} />
            <SummaryRow label="Ampérage disjoncteur" value={data.amperageDisjoncteur ? `${data.amperageDisjoncteur} A` : ""} />
            <SummaryRow label="Ampérage max" value={data.amperageMax ? `${data.amperageMax} A` : ""} />
            <SummaryRow label="Emplacement tableau principal" value={data.emplacementTableauPrincipal} />
            <SummaryRow label="Difficulté passage tableaux" value={data.difficultePasaggeTableaux} />
          </div>
        </SectionCard>
        {/* Vide sanitaire */}
        <SectionCard title="Vide sanitaire" icon={Building2} className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryRow label="Vide sanitaire" value={data.videSanitaire ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Accessible" value={data.videSanitaireAccessible ? DisplayTrue : DisplayFalse} />
          </div>
        </SectionCard>
      </div>
      <div className="a4-page">
        {/* PAC / Implantation */}
        <SectionCard title="PAC / Implantation" icon={Thermometer} className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryRow label="Emplacement unité extérieure" value={data.emplacementUniteExterieure} />
            <SummaryRow label="Emplacement unité intérieure" value={data.emplacementUniteInterieure} />
            <SummaryRow label="Distance PAC ↔ tableau" value={data.distancePacTableau} />
            <SummaryRow label="Hauteur local PAC" value={data.hauteurLocalPac} />
            <SummaryRow label="Lève groupe PAC" value={data.leveGroupePac ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Nacelle PAC" value={data.nacellePac ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Tranchée à faire" value={data.trancheeAFairePac} />
            <SummaryRow label="Chape à faire PAC" value={data.chapeAFairePac} />
            <SummaryRow label="Circuit hydraulique" value={data.circuitHydraulique} />
            <SummaryRow label="Passage liaisons combles" value={data.passageLiaisonsComble ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Passage liaisons direct" value={data.passageLiaisonsDirect ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Passage liaisons intérieur" value={data.passageLiaisonsInterieur ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Passage liaisons autres" value={data.passageLiaisonsAutres ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Précision autres" value={data.passageLiaisonsAutresTexte} />
          </div>
        </SectionCard>

        {/* PAC air/air */}
        <SectionCard title="PAC air/air" icon={Wind} className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryRow label="Mono-split" value={data.pacAirAirMonoSplit ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Multi-split" value={data.pacAirAirMultiSplit ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Gainable" value={data.pacAirAirGainable ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Console" value={data.pacAirAirConsole ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Distance" value={data.pacAirAirDistance} />
            <SummaryRow label="Hauteur" value={data.pacAirAirHauteur} />
            <SummaryRow label="Dos à dos (général)" value={data.pacAirAirLeveGroupe ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Nacelle" value={data.pacAirAirNacelle ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Tranchée" value={data.pacAirAirTranchee} />
            <SummaryRow label="Nature sol" value={data.pacAirAirNatureSol} />
            <SummaryRow label="Type mur" value={data.pacAirAirTypeMur} />
            <SummaryRow label="Chape existante" value={data.pacAirAirChapeExistante ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Chape à faire" value={data.pacAirAirChapeAFaire ? DisplayTrue : DisplayFalse} />
          </div>
        </SectionCard>
      </div>
      <div className="a4-page">
        {/* SPLITS détail */}
        <SectionCard title="Splits (détail pièces)" icon={Wind} className="mb-4">
          {Array.isArray(data.splits) && data.splits.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4">Pièce</th>
                    <th className="text-left py-2 pr-4">Puissance</th>
                    <th className="text-left py-2 pr-4">Dos à dos</th>
                    <th className="text-left py-2 pr-4">Pompe de relevage</th>
                  </tr>
                </thead>
                <tbody>
                  {data.splits.map((split, i) => (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="py-2 pr-4">{split?.nomPiece ?? "—"}</td>
                      <td className="py-2 pr-4">{split?.puissanceKw ? `${split.puissanceKw} kW` : "—"}</td>
                      <td className="py-2 pr-4">{split?.dosADos ?? "—"}</td>
                      <td className="py-2 pr-4">{split?.pompeRelevage ?? "—"}</td>
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
        <SectionCard title="Radiateurs (détail)" icon={Sun} className="mb-4">
          {Array.isArray(data.radiateurs) && data.radiateurs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4">Matériau</th>
                    <th className="text-left py-2 pr-4">Hauteur</th>
                    <th className="text-left py-2 pr-4">Largeur</th>
                    <th className="text-left py-2 pr-4">Épaisseur</th>
                  </tr>
                </thead>
                <tbody>
                  {data.radiateurs.map((item, i) => (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="py-2 pr-4">{item?.materiau ?? "—"}</td>
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
      <div className="a4-page">
        {/* PV */}
        <SectionCard title="Photovoltaïque" icon={Sun} className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <SummaryRow label="Paysage" value={data.pvFormatPaysage ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Portrait" value={data.pvFormatPortrait ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Raccordement aérien" value={data.pvRaccordementAerien ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Raccordement enterré" value={data.pvRaccordementEnterre ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Nacelle +4m" value={data.pvNacellePlus4m ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Toiture bac acier" value={data.pvToitureBacAcier ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Toiture tuiles" value={data.pvToitureTuile ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Toiture éverite" value={data.pvToitureEverite ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Pose au sol" value={data.pvTypePoseAuSol ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Pose murale SSC" value={data.pvTypePoseMuraleSsc ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Pose toiture" value={data.pvTypePoseToiture ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Taille SSC" value={data.pvSscTaille} />
            <SummaryRow label="Docs : devis signé" value={data.pvDocDevisSigne ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Docs : facture EDF" value={data.pvDocFactureEdf ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Docs : parcelle" value={data.pvDocParcelle ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Docs : pouvoir" value={data.pvDocPouvoir ? DisplayTrue : DisplayFalse} />
            <SummaryRow label="Docs : taxe foncière" value={data.pvDocTaxeFonciere ? DisplayTrue : DisplayFalse} />
          </div>
        </SectionCard>
      </div>

    </div>
  );
};

export default PdfContentDossier;