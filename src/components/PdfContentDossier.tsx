import React, { useEffect, useRef, useState } from "react";
import { User, Home, Layers, Grid3X3, Flame, Zap, Thermometer, Wind, BadgeEuro, FileText, Sun, CreditCard, Check, X, NotebookTabs, TriangleAlert, CircleAlert } from "lucide-react";
import SectionCard from "./SectionCard";
import { SelectedDimensionnementSections, FormData } from "@/types/formData";
import { DossierFormData } from "@/types/dossierFormData";
import { useDossierValidation, REQUIRED_GROUPS } from "@/hooks/useDossierValidation";

interface PdfContentDossierProps {
  data: DossierFormData;
  selectedOptions?: SelectedDimensionnementSections;
  simulData?: FormData | null;
}

// Composant pour afficher une ligne de résumé
const SummaryRow: React.FC<{ label: string; value }> = ({ label, value }) => {
  return (
    <div className={`${value ? "flex" : "hidden"} justify-between py-1 text-sm border-b border-border/50 last:border-0 `}>
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value || "—"}</span>
    </div>
  )
}

const DisplayTrue = <Check className="text-lime-500" strokeWidth={6} />
const DisplayFalse = "—"
const DisplayWarning = <CircleAlert className="w-5 h-5 text-red-500" />

const PageFooter: React.FC<{ nomClient: string; pagesRef: React.RefObject<HTMLDivElement> }> =
  ({ nomClient, pagesRef }) => {
    const selfRef = useRef<HTMLDivElement | null>(null);
    const [pageNum, setPageNum] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
      if (!pagesRef.current || !selfRef.current) return;
      const pages = Array.from(pagesRef.current.querySelectorAll(".a4-page"));
      const myPage = selfRef.current.closest(".a4-page");
      const idx = pages.indexOf(myPage as Element);
      setPageNum(idx + 1);
      setTotal(pages.length);
    }, [pagesRef]);

    return (
      <div ref={selfRef} className="text-center text-xs text-white">
        <div className="font-bold text-sm">Dossier de liaison {nomClient}</div>
        <div>Page {pageNum} / {total}</div>
      </div>
    );
  };

const PdfContentDossier: React.FC<PdfContentDossierProps> = ({ data, selectedOptions, simulData }) => {
  const pagesRef = useRef<HTMLDivElement | null>(null);
  const { groupErrors, fieldErrors } = useDossierValidation(data, simulData);

  const onlyForElectricProduct = () => {
    const { pacAirAir, pacAirEau, multiplus, poele, thermodynamique, vmc, photovoltaique, ecsSolaire, ssc } = simulData?.dimensionnement?.selectedSections || {}
    if (pacAirAir || pacAirEau || multiplus || poele || thermodynamique || vmc || photovoltaique || ecsSolaire || ssc) {
      return true;
    } else {
      return false;
    }
  }

  const getLabel = (key) => {
    let label = "";
    label = key.replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .toUpperCase();
    return label;
  }

  const selectedProducts = Object.keys(simulData?.dimensionnement?.selectedSections)
    .filter((k) => simulData?.dimensionnement?.selectedSections[k])

  return (
    <div ref={pagesRef}>
      <div className="a4-page flex flex-col justify-between">
        <div className="space-y-1">
          {/* Infos RDV */}
          <SectionCard title="Infos RDV" icon={User} className="">
            <div className="flex items-center justify-between text-sm">
              <div className="mr-4 text-muted-foreground">Produit(s) choisi(s)</div>
              {selectedProducts?.length > 0 &&
                <div className="flex">
                  {selectedProducts?.map((product, index) => {
                    return (
                      <div key={product}>
                        <div className="font-medium">{getLabel(product)}{index < selectedProducts.length - 1 &&
                          <span className="mx-2">—</span>
                        }</div>

                      </div>
                    )
                  })}
                </div>
              }
            </div>
            <SummaryRow label="Accompagnateur" value={data.conseiller} />
            <SummaryRow label="Perso" value={data.perso ? DisplayTrue : groupErrors.infosRDV ? DisplayWarning : ""} />
            <SummaryRow label="Parrainage" value={data.parrain ? DisplayTrue : groupErrors.infosRDV ? DisplayWarning : ""} />
            <SummaryRow label="T1" value={data.t1 ? DisplayTrue : groupErrors.infosRDV ? DisplayWarning : ""} />
            <SummaryRow label="T2" value={data.t2 ? DisplayTrue : groupErrors.infosRDV ? DisplayWarning : ""} />
            <SummaryRow label="T3" value={data.t3 ? DisplayTrue : groupErrors.infosRDV ? DisplayWarning : ""} />
            <SummaryRow label="Lead" value={data.lead ? DisplayTrue : groupErrors.infosRDV ? DisplayWarning : ""} />
          </SectionCard>
          {/* Infos Client */}
          <SectionCard title="Infos Client" icon={User} className="">
            <SummaryRow label="Nom client" value={data.nomClient} />
            <SummaryRow label="Téléphone" value={data.telephone} />
            <SummaryRow label="Adresse fiscale" value={`${data.adresseFiscale}-${data.codePostalFiscal}-${data.villeFiscale}`} />
            <SummaryRow label="Adresse de chantier" value={`${data.adresseInstallation}-${data.codePostal}-${data.ville}`} />
          </SectionCard>
          {/* Règlement */}
          <SectionCard title="Règlement" icon={CreditCard} className="">
            <SummaryRow label="Chèque" value={data.reglementCheque ? DisplayTrue : groupErrors.reglement ? DisplayWarning : ""} />
            <SummaryRow label="Financement" value={data.reglementFinancement ? DisplayTrue : groupErrors.reglement ? DisplayWarning : ""} />
            <SummaryRow label="PTZ" value={data.reglementPTZ ? DisplayTrue : groupErrors.reglement ? DisplayWarning : ""} />
          </SectionCard>
          {/* Dossier de prime */}
          <SectionCard title="Dossier de prime" icon={CreditCard} className="">
            <SummaryRow label="Propriétaire occupant" value={data.proprietaireOccupant ? DisplayTrue : groupErrors.dossierPrime ? DisplayWarning : ""} />
            <SummaryRow label="Propriétaire bailleur" value={data.proprietaireBailleur ? DisplayTrue : groupErrors.dossierPrime ? DisplayWarning : ""} />
            <SummaryRow label="Résidence secondaire" value={data.residSecondaire ? DisplayTrue : groupErrors.dossierPrime ? DisplayWarning : ""} />
            <SummaryRow label="SCI" value={data.sci ? DisplayTrue : groupErrors.dossierPrime ? DisplayWarning : ""} />
          </SectionCard>
        </div>
        <PageFooter nomClient={data.nomClient} pagesRef={pagesRef} />
      </div>
      <div className="a4-page flex flex-col justify-between">
        <div className="space-y-1">
          {/* Pièces / Attestations */}
          <SectionCard title="Pièces / Attestations" icon={FileText}>
            <div className="">
              <div className="my-2 text-sm underline">Documents client à récupérer</div>
              <SummaryRow label="Carte identité" value={data.carteIdentite ? DisplayTrue : fieldErrors?.carteIdentite ? DisplayWarning : ""} />
              <SummaryRow label="2 derniers avis d'impôts" value={data.deuxDerniersAvisImpots ? DisplayTrue : fieldErrors?.carteIdentite ? DisplayWarning : ""} />
              <SummaryRow label="Taxe foncière ou acte notarié" value={data.taxeFonciereActeNotarie ? DisplayTrue : fieldErrors?.carteIdentite ? DisplayWarning : ""} />
              <SummaryRow label="RIB" value={data.rib ? DisplayTrue : fieldErrors?.rib ? DisplayWarning : ""} />

              <div className="my-2 text-sm underline">Documents à fournir</div>
              <SummaryRow label="Devis non signé" value={data.devisNonSigne ? DisplayTrue : fieldErrors?.devisNonSigne ? DisplayWarning : ""} />
              <SummaryRow label="Identité numérique si compte MPR bloqué" value={data.idNumerique ? DisplayTrue : ""} />
              <SummaryRow label="Note de dimensionnement" value={data.noteDimensionnement ? DisplayTrue : fieldErrors?.noteDimensionnement ? DisplayWarning : ""} />
              <SummaryRow label="Étude solaire Revolt" value={data.revolt ? DisplayTrue : fieldErrors?.revolt ? DisplayWarning : ""} />

              <div className="my-2 text-sm underline">Documents client à faire signer</div>
              <SummaryRow label="Devis signé" value={data.devisSigne ? DisplayTrue : fieldErrors?.devisSigne ? DisplayWarning : ""} />
              <SummaryRow label="Mandat MaPrimeRénov" value={data.mandatMaPrimeRenov ? DisplayTrue : fieldErrors?.carteIdentite ? DisplayWarning : ""} />
              <SummaryRow label="Attestation fioul" value={data.attestationFioul ? DisplayTrue : fieldErrors?.attestationFioul ? DisplayWarning : ""} />
              <SummaryRow label="Attestation indivisionnaire MPR (si 2 proprios)" value={data.attestationIndivisionnaire ? DisplayTrue : ""} />
              <SummaryRow label="Attestation bailleur MPR" value={data.attestationProprietaireBailleur ? DisplayTrue : fieldErrors?.attestationProprietaireBailleur ? DisplayWarning : ""} />
              <SummaryRow label="Pouvoir" value={data.pouvoir ? DisplayTrue : fieldErrors?.pouvoir ? DisplayWarning : ""} />
            </div>
          </SectionCard>
          {/* Dossier de financement */}
          {data.reglementFinancement &&
            <SectionCard title="Dossier de financement">
              <SummaryRow label="Justificatif domicile" value={data.justificatifDomicile ? DisplayTrue : groupErrors?.dossierFinancement ? DisplayWarning : ""} />
              <SummaryRow label="Bulletins salaires" value={data.bulletinsSalaires ? DisplayTrue : groupErrors?.dossierFinancement ? DisplayWarning : ""} />
              <SummaryRow label="Bilan (entrepreneur)" value={data.bilanEntrepreneur ? DisplayTrue : groupErrors?.dossierFinancement ? DisplayWarning : ""} />
            </SectionCard>
          }
          {/* COMPTE CEE  et MPR */}
          <SectionCard title="Prime EDF / MaPrimeRénov'" icon={BadgeEuro}>
            <SummaryRow label="Prime CEE déduite" value={data.primeCeeDeduite ? DisplayTrue : ""} />
            <SummaryRow label="Montant Prime EDF" value={data.montantPrimeEDF ? `${data.montantPrimeEDF} €` : ""} />
            <SummaryRow label="Compte Prime CEE EDF" value={data.compteCeeEdf ? DisplayTrue : ""} />
            <SummaryRow label="Mail Prime EDF" value={data.mailPrimeEDF} />
            <SummaryRow label="MDP Prime EDF" value={data.mdpPrimeEDF} />
            <SummaryRow label="Non éligible MPR" value={data.nonEligibleMpr ? DisplayTrue : ""} />
            <SummaryRow label="Montant MaPrimeRénov" value={data.montantPrimeRenov ? `${data.montantPrimeRenov} €` : ""} />
            <SummaryRow label="Mail MaPrimeRénov" value={data.mailPrimeRenov} />
            <SummaryRow label="MDP MaPrimeRénov" value={data.mdpPrimeRenov} />
            <SummaryRow label="Gmail créé" value={data.gmailCree} />
            <SummaryRow label="MDP Gmail" value={data.mdpGmail} />
          </SectionCard>
        </div>
        <PageFooter nomClient={data.nomClient} pagesRef={pagesRef} />
      </div>
      <div className="a4-page flex flex-col justify-between space-y-1">
        <div className="space-y-1">
          {/* Habitation */}
          <SectionCard title="Habitation" icon={Home}>
            <div className="">
              <SummaryRow label="Année de construction" value={data.anneeConstruction} />
              <div className="my-4 font-medium text-green-500">Structure</div>
              <SummaryRow label="Plain-pied" value={data.plainPied ? DisplayTrue : groupErrors?.structure ? DisplayWarning : ""} />
              <SummaryRow label="Étages" value={data.etages ? DisplayTrue : groupErrors?.structure ? DisplayWarning : ""} />
              <SummaryRow label="Nombre d'étages" value={data.nbEtages} />
              <SummaryRow label="Sous-sol" value={data.sousSol ? DisplayTrue : groupErrors?.structure ? DisplayWarning : ""} />
              <SummaryRow label="Vide sanitaire" value={data.videSanitaire ? DisplayTrue : groupErrors?.structure ? DisplayWarning : ""} />
              <SummaryRow label="Vide sanitaire accessible" value={data.videSanitaireAccessible ? DisplayTrue : ""} />
              <SummaryRow label="Type de mur" value={data.typeMur ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Épaisseur mur (en cm)" value={data.epaisseurMur ? DisplayTrue : DisplayFalse} />
              <div className="my-4 font-medium text-green-500">Combles</div>
              <SummaryRow label="Combles perdus" value={data.comblePerdu ? DisplayTrue : groupErrors?.combles ? DisplayWarning : ""} />
              <SummaryRow label="Combles aménagés" value={data.combleAmenage ? DisplayTrue : groupErrors?.combles ? DisplayWarning : ""} />
              <SummaryRow label="Combles perdus accessibles" value={data.comblePerduAccessible ? DisplayTrue : ""} />
              <SummaryRow label="Accès trappe" value={data.comblePerduTrappe ? DisplayTrue : ""} />
              <SummaryRow label="Accès toit" value={data.comblePerduToit ? DisplayTrue : ""} />
              <SummaryRow label="Accès autre" value={data.comblePerduAutre ? DisplayTrue : ""} />
              <SummaryRow label="Précision autre" value={data.comblePerduAutreTexte} />
              <div className="my-4 font-medium text-green-500">Type de plancher</div>
              <SummaryRow label="Plancher bois" value={data.plancherBois ? DisplayTrue : groupErrors?.planchers ? DisplayWarning : ""} />
              <SummaryRow label="Plancher placo" value={data.plancherPlaco ? DisplayTrue : groupErrors?.planchers ? DisplayWarning : ""} />
              <SummaryRow label="Plancher hourdis" value={data.plancherHourdis ? DisplayTrue : groupErrors?.planchers ? DisplayWarning : ""} />

            </div>
          </SectionCard>
        </div>
        <PageFooter nomClient={data.nomClient} pagesRef={pagesRef} />
      </div>
      <div className="a4-page flex flex-col justify-between space-y-1">
        <div className="space-y-1">
          {/* Chauffage actuel */}
          <SectionCard title="Habitation (suite)" icon={Flame}>
            <div className="grid gap-x-8">
              <div className="my-4 font-medium text-green-500">Chauffage actuel</div>
              <SummaryRow label="Bois" value={data.chauffageBois ? DisplayTrue : groupErrors?.chauffage ? DisplayWarning : ""} />
              <SummaryRow label="Fioul" value={data.chauffageFioul ? DisplayTrue : groupErrors?.chauffage ? DisplayWarning : ""} />
              <SummaryRow label="Gaz" value={data.chauffageGaz ? DisplayTrue : groupErrors?.chauffage ? DisplayWarning : ""} />
              <SummaryRow label="Radiateurs électriques" value={data.chauffageRadiateursElec ? DisplayTrue : groupErrors?.chauffage ? DisplayWarning : ""} />
              <SummaryRow label="Autre chauffage" value={data.chauffageAutre ? DisplayTrue : groupErrors?.chauffage ? DisplayWarning : ""} />
              <SummaryRow label="Précision autre" value={data.chauffageAutreTexte} />
              <SummaryRow label="Circuit hydraulique fonctionnel" value={data.circuitHydraulique} />
              <div className="my-4 font-medium text-green-500">Thermostats</div>
              <SummaryRow label="Kit bi-zone" value={data.thermostatBiZone ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Thermostat filaire" value={data.thermostatFilaire ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Thermostat non filaire" value={data.thermostatNonFilaire ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Plancher chauffant" value={data.plancherChauffant ? DisplayTrue : DisplayFalse} />
              <SummaryRow label="Pas de thermostat" value={data.pasDeThermostat} />
              <div className="my-4 font-medium text-green-500">Menuiseries à remplacer</div>
              <SummaryRow label="Menuiseries à changer (quantité)" value={data.quantiteFenetres} />
              <SummaryRow label="Menuiseries à changer (matière)" value={data.matiereFenetres} />
              <SummaryRow label="Volets roulants (quantité)" value={data.quantiteVolets} />
            </div>
          </SectionCard>

        </div>
        <PageFooter nomClient={data.nomClient} pagesRef={pagesRef} />
      </div>
      <div className="a4-page flex flex-col justify-between space-y-1">
        <div className="space-y-1">
          {/* Électricité */}
          {onlyForElectricProduct() &&
            <SectionCard title="Électricité" icon={Zap}>
              <div className="grid gap-x-8">
                <SummaryRow label="Monophasé" value={data.monophase ? DisplayTrue : DisplayWarning} />
                <SummaryRow label="Triphasé" value={data.triphase ? DisplayTrue : DisplayWarning} />
                <SummaryRow label="Installation aux normes" value={data.installationAuxNormes ? data.installationAuxNormes : DisplayWarning} />
                <SummaryRow label="Ampérage disjoncteur général" value={data.amperageDisjoncteur ? `${data.amperageDisjoncteur} A` : DisplayWarning} />
                <SummaryRow label="Ampérage max" value={data.amperageMax ? `${data.amperageMax} A` : DisplayWarning} />
                <SummaryRow label="Emplacement tableau principal" value={data.emplacementTableauPrincipal ? data.emplacementTableauPrincipal : DisplayWarning} />
                <SummaryRow label="Linky" value={data.linky ? data.linky : DisplayWarning} />
                <SummaryRow label="Abonnement kVA" value={data.abonnementKva ? `${data.abonnementKva} kVA` : DisplayWarning} />
              </div>
            </SectionCard>
          }
        </div>
        <PageFooter nomClient={data.nomClient} pagesRef={pagesRef} />
      </div>
      {selectedOptions?.pacAirEau &&
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
          <PageFooter nomClient={data.nomClient} pagesRef={pagesRef} />
        </div>
      }
      {selectedOptions?.thermodynamique &&
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
          </div>
          <PageFooter nomClient={data.nomClient} pagesRef={pagesRef} />
        </div>
      }
      {selectedOptions?.pacAirAir &&
        <div className="a4-page flex flex-col justify-between space-y-1">
          <div className="space-y-1">
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
          <PageFooter nomClient={data.nomClient} pagesRef={pagesRef} />
        </div>
      }
      <div className="a4-page flex flex-col justify-between space-y-1">
        <div className="space-y-1">
          {/* SPLITS détail */}
          {selectedOptions?.pacAirAir &&
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
          }

          {/* RADIATEURS */}
          <SectionCard title="Radiateurs (détail)" icon={Sun}>
            <SummaryRow label="Plancher chauffant" value={data.plancherChauffant ? DisplayTrue : ""} />
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
        <PageFooter nomClient={data.nomClient} pagesRef={pagesRef} />
      </div>
      {selectedOptions?.photovoltaique || selectedOptions.ssc &&
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
          </div>
          <PageFooter nomClient={data.nomClient} pagesRef={pagesRef} />
        </div>
      }
      <div className="a4-page flex flex-col justify-between space-y-1">
        <div className="space-y-1">
          {/* Photos checklist */}
          <SectionCard title="Photos à faire (obligatoire)">
            <h3 className="font-semibold text-lime-600 mb-2">Équipement</h3>
            <div className="grid gap-x-8">
              <SummaryRow label="Compteur" value={data.photoCompteur ? DisplayTrue : fieldErrors?.photoCompteur ? DisplayWarning : ""} />
              <SummaryRow label="Chaudière à remplacer" value={data.photoChaudiere ? DisplayTrue : fieldErrors?.photoChaudiere ? DisplayWarning : ""} />
              <SummaryRow label="Emplacement du groupe extérieur" value={data.photoGroupeExt ? DisplayTrue : fieldErrors?.photoGroupeExt ? DisplayWarning : ""} />
              <SummaryRow label="Maison vue de la rue" value={data.photoMaison ? DisplayTrue : fieldErrors?.photoMaison ? DisplayWarning : ""} />
              <SummaryRow label="Combles" value={data.photoCombles ? DisplayTrue : fieldErrors?.photoCombles ? DisplayWarning : ""} />
              <SummaryRow label="Système ECS" value={data.photoECS ? DisplayTrue : fieldErrors?.photoECS ? DisplayWarning : ""} />
              <SummaryRow label="Disjoncteur" value={data.photoDisjoncteur ? DisplayTrue : fieldErrors?.photoDisjoncteur ? DisplayWarning : ""} />
              <SummaryRow label="Tuyauterie de la chaudière" value={data.photoTuyauterie ? DisplayTrue : fieldErrors?.photoTuyauterie ? DisplayWarning : ""} />
              <SummaryRow label="Radiateurs" value={data.photoRadiateurs ? DisplayTrue : fieldErrors?.photoRadiateurs ? DisplayWarning : ""} />
              <SummaryRow label="Plafonds" value={data.photoPlafonds ? DisplayTrue : fieldErrors?.photoPlafonds ? DisplayWarning : ""} />
              <SummaryRow label="Sous-sol" value={data.photoSousSol ? DisplayTrue : fieldErrors?.photoSousSol ? DisplayWarning : ""} />
              <SummaryRow label="Tableaux électriques existants" value={data.photoTableauElec ? DisplayTrue : fieldErrors?.photoTableauElec ? DisplayWarning : ""} />
              <SummaryRow label="Ventilation" value={data.photoVentilation ? DisplayTrue : fieldErrors?.photoVentilation ? DisplayWarning : ""} />
              <SummaryRow label="Emplacement des unités intérieures" value={data.photoUniteInt ? DisplayTrue : fieldErrors?.photoUniteInt ? DisplayWarning : ""} />
              <SummaryRow label="Planchers" value={data.photoPlancher ? DisplayTrue : ""} />
              <SummaryRow label="Rez-de-chaussée" value={data.photoRDC ? DisplayTrue : ""} />
              <SummaryRow label="Fenêtres" value={data.photoFenetres ? DisplayTrue : fieldErrors?.photoFenetres ? DisplayWarning : ""} />
              <SummaryRow label="Portes-fenêtres" value={data.photoPorteFenetre ? DisplayTrue : ""} />
              <SummaryRow label="Façades extérieures" value={data.photoFacade ? DisplayTrue : fieldErrors?.photoFacade ? DisplayWarning : ""} />
              <SummaryRow label="Porte" value={data.photoPorte ? DisplayTrue : fieldErrors?.photoPorte ? DisplayWarning : ""} />
            </div>
          </SectionCard>
          {/* Commentaires*/}
          <SectionCard title="Détails dossier & chantier" icon={NotebookTabs}>
            <div className="text-sm">
              {data.commentaires}
            </div>
          </SectionCard>
        </div>
        <PageFooter nomClient={data.nomClient} pagesRef={pagesRef} />
      </div>
    </div>
  );
};

export default PdfContentDossier;