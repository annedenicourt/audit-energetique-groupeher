import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, TriangleAlert } from "lucide-react";
import { FormData } from "@/types/formData";
import {
  DossierFormData,
  defaultDossierFormData,
  defaultSplit,
  defaultRadiateur,
  SplitData,
  RadiateurData,
} from "@/types/dossierFormData";
import SectionCard from "../SectionCard";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import FormTextarea from "../FormTextarea";
import { OUI_NON, MATERIAUX_RADIATEUR } from "@/utils/handleForm";
import { useDossierValidation, REQUIRED_GROUPS } from "@/hooks/useDossierValidation";


interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  isMissing?: boolean
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, checked, onChange, isMissing }) => (
  <label className="flex items-center gap-2 cursor-pointer py-1">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className={`w-4 h-4 accent-primary ${isMissing && "ring-2 ring-red-500"}`}
    />
    <span className={`text-sm ${isMissing ? "text-red-500 font-semibold" : ""}`}>{label}</span>
  </label>
);

interface StepDossierProps {
  simulData: FormData;
  onValidationChange?: (isValid: boolean) => void;
}

const StepDossier: React.FC<StepDossierProps> = ({ simulData, onValidationChange }) => {
  const STORAGE_KEY = "dossier_form";

  const [formDossier, setForm] = useState<DossierFormData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...defaultDossierFormData, ...JSON.parse(stored) };
    } catch { /* ignore */ }
    return { ...defaultDossierFormData };
  });

  useEffect(() => {
    try {
      setForm((prev) => ({
        ...prev,
        conseiller: simulData?.client?.accompagnateur || "",
        nomClient: simulData?.client?.nom || "",
        adresseFiscale: simulData.client.adresseFiscale,
        adresseInstallation: simulData?.client?.adresse || "",
        codePostal: simulData?.client?.codePostal || "",
        ville: simulData?.client?.ville || "",
        codePostalFiscal: simulData?.client?.codePostalFiscal || "",
        villeFiscale: simulData?.client?.villeFiscale || "",
        telephone: simulData?.client?.telephone || "",
        montantPrimeRenov: simulData?.aides?.maPrimeRenov || "",
        montantPrimeEDF: simulData?.aides?.primeCEE || "",
        anneeConstruction: simulData?.client?.anneeConstruction || "",
        quantiteFenetres: simulData?.dimensionnement?.dimensionnementFenetres[0]?.quantite || "",
        matiereFenetres: simulData?.dimensionnement?.dimensionnementFenetres[0]?.matiere || "",
        quantiteVolets: simulData?.dimensionnement.quantiteVolets || "",
      }));
    } catch {/* ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formDossier));
  }, [formDossier]);

  const { groupErrors, fieldErrors, isStepDossierValid } = useDossierValidation(formDossier, simulData);

  useEffect(() => {
    onValidationChange?.(isStepDossierValid);
  }, [isStepDossierValid, onValidationChange]);

  const update = useCallback(<K extends keyof DossierFormData>(field: K, value: DossierFormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateSplit = useCallback((index: number, field: keyof SplitData, value: string) => {
    setForm((prev) => {
      const splits = [...prev.splits];
      splits[index] = { ...splits[index], [field]: value };
      return { ...prev, splits };
    });
  }, []);

  const updateRadiateur = useCallback((index: number, field: keyof RadiateurData, value: string) => {
    setForm((prev) => {
      const radiateurs = [...prev.radiateurs];
      radiateurs[index] = { ...radiateurs[index], [field]: value };
      return { ...prev, radiateurs };
    });
  }, []);

  const addRadiateur = useCallback(() => {
    setForm((prev) => ({ ...prev, radiateurs: [...prev.radiateurs, { ...defaultRadiateur }] }));
  }, []);

  const removeRadiateur = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      radiateurs: prev.radiateurs.filter((_, i) => i !== index),
    }));
  }, []);

  const addSplit = useCallback(() => {
    setForm((prev) => ({ ...prev, splits: [...prev.splits, { ...defaultSplit }] }));
  }, []);

  const removeSplit = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      splits: prev.splits.filter((_, i) => i !== index),
    }));
  }, []);

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
    <div className="space-y-4">
      {/* Page title */}
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Montage du dossier de liaison
        </h2>
      </div>
      <SectionCard title="Infos RDV">
        <div className="my-2 flex items-center text-sm">
          <div className="mr-4 font-medium">Produit(s) choisi(s)</div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Accompagnateur" name="conseiller" value={formDossier.conseiller} readonly={true} />
          <div className={`flex flex-col ${groupErrors.infosRDV ? "justify-end" : "justify-center"}`}>
            <div className="flex gap-2">
              <CheckboxField label="Perso" checked={formDossier.perso} onChange={(v) => update("perso", v)} />
              <CheckboxField label="Parrainage" checked={formDossier.parrain} onChange={(v) => update("parrain", v)} />
              <CheckboxField label="T1" checked={formDossier.t1} onChange={(v) => update("t1", v)} />
              <CheckboxField label="T2" checked={formDossier.t2} onChange={(v) => update("t2", v)} />
              <CheckboxField label="T3" checked={formDossier.t3} onChange={(v) => update("t3", v)} />
              <CheckboxField label="Lead" checked={formDossier.lead} onChange={(v) => update("lead", v)} />
            </div>
            {groupErrors.infosRDV && (
              <p className="mt-2 text-sm text-destructive flex items-center gap-1">
                <TriangleAlert className="h-4 w-4" />
                {REQUIRED_GROUPS.find((group) => group.key === "infosRDV")?.message}
              </p>
            )}
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Infos Client">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Nom / prénom client" name="nomClient" value={formDossier.nomClient} readonly={true} />
          <FormInput label="Téléphone" name="telephone" value={formDossier.telephone} type="tel" readonly={true} />
          <FormInput label="Adresse fiscale" name="adresseDossier" value={formDossier.adresseFiscale} readonly={true} className="md:col-span-2" />
          <FormInput label="Code postal fiscal" name="codePostalFiscal" value={formDossier.codePostalFiscal} readonly={true} className="" />
          <FormInput label="Ville fiscale" name="villeFiscale" value={formDossier.villeFiscale} readonly={true} className="" />
          <FormInput label="Adresse de chantier" name="adresseInstallation" value={formDossier.adresseInstallation} readonly={true} className="md:col-span-2" />
          <FormInput label="Code postal chantier" name="adresseInstallation" value={formDossier.codePostal} readonly={true} className="" />
          <FormInput label="Ville chantier" name="adresseInstallation" value={formDossier.ville} readonly={true} className="" />
        </div>
      </SectionCard>
      {/* RÈGLEMENT */}
      <SectionCard title="Règlement">
        <div className="flex flex-wrap gap-6">
          <CheckboxField label="Chèque" checked={formDossier.reglementCheque} onChange={(v) => update("reglementCheque", v)} />
          <CheckboxField label="Financement" checked={formDossier.reglementFinancement} onChange={(v) => update("reglementFinancement", v)} />
          <CheckboxField label="PTZ" checked={formDossier.reglementPTZ} onChange={(v) => update("reglementPTZ", v)} />
        </div>
        {groupErrors.reglement && (
          <p className="mt-2 text-sm text-destructive flex items-center gap-1">
            <TriangleAlert className="h-4 w-4" />
            {REQUIRED_GROUPS.find((group) => group.key === "reglement")?.message}
          </p>
        )}
      </SectionCard>
      {/* DOSSIER DE PRIME */}
      <SectionCard title="Dossier de prime">
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Propriétaire occupant" checked={formDossier.proprietaireOccupant} onChange={(v) => update("proprietaireOccupant", v)} />
          <CheckboxField label="Propriétaire bailleur" checked={formDossier.proprietaireBailleur} onChange={(v) => update("proprietaireBailleur", v)} />
          <CheckboxField label="Résid. secondaire" checked={formDossier.residSecondaire} onChange={(v) => update("residSecondaire", v)} />
          <CheckboxField label="SCI" checked={formDossier.sci} onChange={(v) => update("sci", v)} />
        </div>
        {groupErrors.dossierPrime && (
          <p className="mt-2 text-sm text-destructive flex items-center gap-1">
            <TriangleAlert className="h-4 w-4" />
            {REQUIRED_GROUPS.find((group) => group.key === "dossierPrime")?.message}
          </p>
        )}
      </SectionCard>
      {/* PIECES CHECKLITS*/}
      <SectionCard title="Éléments obligatoires pour pose">
        <h3 className="font-semibold text-lime-600 mb-2">Pièces / checklist</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 mb-4">
          <div>
            <div className="mb-4 text-sm underline">Documents client à récupérer</div>
            <CheckboxField label="2 derniers avis d'impôts" checked={formDossier.deuxDerniersAvisImpots} onChange={(v) => update("deuxDerniersAvisImpots", v)} isMissing={fieldErrors["deuxDerniersAvisImpots"]} />
            <CheckboxField label="Taxe foncière ou acte notarié" checked={formDossier.taxeFonciereActeNotarie} onChange={(v) => update("taxeFonciereActeNotarie", v)} isMissing={fieldErrors["taxeFonciereActeNotarie"]} />
            <CheckboxField label="RIB" checked={formDossier.rib} onChange={(v) => update("rib", v)} isMissing={fieldErrors["rib"]} />
            <CheckboxField label="Carte d'identité" checked={formDossier.carteIdentite} onChange={(v) => update("carteIdentite", v)} isMissing={fieldErrors["carteIdentite"]} />
          </div>
          <div>
            <div className="mb-4 text-sm underline">Documents à fournir</div>
            <CheckboxField label="Devis non signé" checked={formDossier.devisNonSigne} onChange={(v) => update("devisNonSigne", v)} isMissing={fieldErrors["devisNonSigne"]} />
            <CheckboxField label="Identité numérique" checked={formDossier.idNumerique} onChange={(v) => update("idNumerique", v)} />
            <CheckboxField label="Note de dimensionnement" checked={formDossier.noteDimensionnement} onChange={(v) => update("noteDimensionnement", v)} isMissing={fieldErrors["noteDimensionnement"]} />
            <CheckboxField label="Étude solaire Revolt" checked={formDossier.revolt} onChange={(v) => update("revolt", v)} isMissing={fieldErrors["revolt"]} />
          </div>
          <div>
            <div className="mb-4 text-sm underline">Documents client à faire signer</div>
            <CheckboxField label="Devis signé" checked={formDossier.devisSigne} onChange={(v) => update("devisSigne", v)} isMissing={fieldErrors["devisSigne"]} />
            <CheckboxField label="Mandat MaPrimeRénov" checked={formDossier.mandatMaPrimeRenov} onChange={(v) => update("mandatMaPrimeRenov", v)} isMissing={fieldErrors["mandatMaPrimeRenov"]} />
            <CheckboxField label="Attestation indivisionnaire MPR" checked={formDossier.attestationIndivisionnaire} onChange={(v) => update("attestationIndivisionnaire", v)} />
            <CheckboxField label="Attestation propriétaire bailleur MPR" checked={formDossier.attestationProprietaireBailleur} onChange={(v) => update("attestationProprietaireBailleur", v)} isMissing={fieldErrors["attestationProprietaireBailleur"]} />
            <CheckboxField label="Attestation fioul" checked={formDossier.attestationFioul} onChange={(v) => update("attestationFioul", v)} isMissing={fieldErrors["attestationFioul"]} />
            <CheckboxField label="Pouvoir" checked={formDossier.pouvoir} onChange={(v) => update("pouvoir", v)} isMissing={fieldErrors["pouvoir"]} />

          </div>
        </div>
      </SectionCard>
      {/* DOSSIER DE FINANCEMENT */}
      {formDossier.reglementFinancement &&
        <SectionCard title="Dossier de financement">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
            <CheckboxField label="Justificatif de domicile < 3 mois (électricité, gaz, téléphone)" checked={formDossier.justificatifDomicile} onChange={(v) => update("justificatifDomicile", v)} />
            <CheckboxField label="Dernier(s) bulletin(s) de salaires + contrat de travail (si CDD ou CDI depuis moins d'un an)" checked={formDossier.bulletinsSalaires} onChange={(v) => update("bulletinsSalaires", v)} />
            <CheckboxField label="Bilan (entrepreneur)" checked={formDossier.bilanEntrepreneur} onChange={(v) => update("bilanEntrepreneur", v)} />
          </div>
          {(formDossier.reglementFinancement && groupErrors.dossierFinancement) && (
            <p className="mt-2 text-sm text-destructive flex items-center gap-1">
              <TriangleAlert className="h-4 w-4" />
              {REQUIRED_GROUPS.find((group) => group.key === "dossierFinancement")?.message}
            </p>
          )}
        </SectionCard>
      }
      {/* COMPTE CEE  et MPR */}
      <SectionCard title="Compte Prime EDF & MaPrimeRénov'">
        <h3 className="font-semibold text-lime-600 mb-2">Compte Prime EDF</h3>
        <div className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            {/* <div className="underline">Prime CEE déduite</div> */}
            <CheckboxField label="Prime CEE déduite" checked={formDossier.primeCeeDeduite} onChange={(v) => update("primeCeeDeduite", v)} />
            <FormInput type="number" label="Montant Prime EDF" name="montantPrimeEDF" value={formDossier.montantPrimeEDF} onChange={(v) => update("montantPrimeEDF", v)} suffix="€" readonly={true} />
          </div>
          <div className="md:col-span-2">
            {/* <div className="underline">Compte Prime CEE EDF</div> */}
            <CheckboxField label="Compte Prime CEE EDF" checked={formDossier.compteCeeEdf} onChange={(v) => update("compteCeeEdf", v)} />
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Mail" name="mailPrimeEDF" value={formDossier.mailPrimeEDF} onChange={(v) => update("mailPrimeEDF", v)} type="email" />
              <FormInput label="MDP" name="mdpPrimeEDF" type="password" value={formDossier.mdpPrimeEDF} onChange={(v) => update("mdpPrimeEDF", v)} />
            </div>
          </div>
        </div>
        <h3 className="font-semibold text-lime-600 mb-2">Compte Prime Rénov</h3>
        <div className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <CheckboxField label="Non éligible" checked={formDossier.nonEligibleMpr} onChange={(v) => update("nonEligibleMpr", v)} />
            <FormInput type="number" label="Montant Prime Rénov" name="montantPrimeRenov" value={formDossier.montantPrimeRenov} onChange={(v) => update("montantPrimeRenov", v)} suffix="€" readonly={formDossier.nonEligibleMpr || formDossier.montantPrimeRenov !== ""} />
          </div>
          <div className="md:col-span-2">
            <div className="underline">Compte MaPrimeRenov'</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Mail" name="mailPrimeRenov" value={formDossier.mailPrimeRenov} onChange={(v) => update("mailPrimeRenov", v)} type="email" readonly={formDossier.nonEligibleMpr} />
              <FormInput label="MDP" name="mdpPrimeRenov" type="password" value={formDossier.mdpPrimeRenov} onChange={(v) => update("mdpPrimeRenov", v)} readonly={formDossier.nonEligibleMpr} />
            </div>
          </div>
        </div>
        <h3 className="font-semibold text-lime-600 mb-2">Si le client n'a pas d'adresse mail, ne pas oubliez de lui communiquer</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput label="Gmail créé" name="gmailCree" value={formDossier.gmailCree} onChange={(v) => update("gmailCree", v)} type="email" />
          <FormInput label="MDP" name="mdpGmail" type="password" value={formDossier.mdpGmail} onChange={(v) => update("mdpGmail", v)} />
        </div>
      </SectionCard>
      {/* MAISON */}
      <SectionCard title="Maison">
        <FormInput type="number" label="Année de construction" name="anneeConstruction_d" value={formDossier.anneeConstruction} onChange={(v) => update("anneeConstruction", v)} readonly={true} />
        <h3 className="font-semibold text-lime-600 mt-4 mb-2">Structure</h3>
        <div className="mb-2">
          <CheckboxField label="Plain-pied" checked={formDossier.plainPied} onChange={(v) => update("plainPied", v)} />
          <CheckboxField label="Étages" checked={formDossier.etages} onChange={(v) => update("etages", v)} />
          {formDossier.etages && <FormInput className="my-4" type="number" label="Nombre d'étages" name="nbEtages" value={formDossier.nbEtages} onChange={(v) => update("nbEtages", v)} />}
          <CheckboxField label="Sous-sol" checked={formDossier.sousSol} onChange={(v) => update("sousSol", v)} />
          <CheckboxField label="Vide sanitaire" checked={formDossier.videSanitaire} onChange={(v) => {
            update("videSanitaire", v);
            if (!v) update("videSanitaireAccessible", false);
          }} />
          {formDossier.videSanitaire &&
            <div className="ml-4">
              <CheckboxField
                label="Accessible ?"
                checked={formDossier.videSanitaireAccessible}
                onChange={(v) => update("videSanitaireAccessible", v)}
              />
            </div>
          }
          {groupErrors.structure && (
            <p className="mt-2 text-sm text-destructive flex items-center gap-1">
              <TriangleAlert className="h-4 w-4" />
              {REQUIRED_GROUPS.find((group) => group.key === "structure")?.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <FormInput label="Type de mur" name="typeMur_d" value={formDossier.typeMur} onChange={(v) => update("typeMur", v)} />
          <FormInput type="number" label="Épaisseur mur" name="epaisseurMur_d" value={formDossier.epaisseurMur} onChange={(v) => update("epaisseurMur", v)} suffix="cm" />
        </div>

        <h3 className="font-semibold text-lime-600 mt-4 mb-2">Combles</h3>
        <div className="flex flex-wrap gap-6 mb-2">
          <CheckboxField label="Combles perdus" checked={formDossier.comblePerdu} onChange={(v) => update("comblePerdu", v)} />
          <CheckboxField label="Combles aménagés (sous rampant)" checked={formDossier.combleAmenage} onChange={(v) => update("combleAmenage", v)} />
        </div>
        {formDossier.comblePerdu && (
          <div className="flex flex-wrap gap-6 mb-2 ml-4">
            <div>Accessibles par : </div>
            <CheckboxField label="Trappe" checked={formDossier.comblePerduTrappe} onChange={(v) => update("comblePerduTrappe", v)} />
            <CheckboxField label="Toit" checked={formDossier.comblePerduToit} onChange={(v) => update("comblePerduToit", v)} />
            <CheckboxField label="Autre" checked={formDossier.comblePerduAutre} onChange={(v) => update("comblePerduAutre", v)} />
            {formDossier.comblePerduAutre && (
              <FormInput label="" name="comblePerduAutreTexte" value={formDossier.comblePerduAutreTexte} onChange={(v) => update("comblePerduAutreTexte", v)} placeholder="Précisez" />
            )}
          </div>
        )}
        {groupErrors.combles && (
          <p className="mt-2 text-sm text-destructive flex items-center gap-1">
            <TriangleAlert className="h-4 w-4" />
            {REQUIRED_GROUPS.find((group) => group.key === "combles")?.message}
          </p>
        )}
        <h3 className="font-semibold text-lime-600 mt-4 mb-2">Type de plancher</h3>
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Bois" checked={formDossier.plancherBois} onChange={(v) => update("plancherBois", v)} />
          <CheckboxField label="Placo" checked={formDossier.plancherPlaco} onChange={(v) => update("plancherPlaco", v)} />
          <CheckboxField label="Hourdis" checked={formDossier.plancherHourdis} onChange={(v) => update("plancherHourdis", v)} />
        </div>
        {groupErrors.planchers && (
          <p className="mt-2 text-sm text-destructive flex items-center gap-1">
            <TriangleAlert className="h-4 w-4" />
            {REQUIRED_GROUPS.find((group) => group.key === "planchers")?.message}
          </p>
        )}

        <h3 className="font-semibold text-lime-600 mt-4 mb-2">Chauffage actuel</h3>
        <div className="flex flex-wrap gap-6 mb-2">
          <CheckboxField label="Fioul" checked={formDossier.chauffageFioul} onChange={(v) => update("chauffageFioul", v)} />
          <CheckboxField label="Gaz" checked={formDossier.chauffageGaz} onChange={(v) => update("chauffageGaz", v)} />
          <CheckboxField label="Radiateurs électriques" checked={formDossier.chauffageRadiateursElec} onChange={(v) => update("chauffageRadiateursElec", v)} />
          <CheckboxField label="Bois" checked={formDossier.chauffageBois} onChange={(v) => update("chauffageBois", v)} />
          <CheckboxField label="Autre" checked={formDossier.chauffageAutre} onChange={(v) => update("chauffageAutre", v)} />
        </div>
        {formDossier.chauffageAutre && (
          <FormInput label="" name="chauffageAutreTexte" value={formDossier.chauffageAutreTexte} onChange={(v) => update("chauffageAutreTexte", v)} placeholder="Précisez" />
        )}
        {groupErrors.chauffage && (
          <p className="mt-2 text-sm text-destructive flex items-center gap-1">
            <TriangleAlert className="h-4 w-4" />
            {REQUIRED_GROUPS.find((group) => group.key === "chauffage")?.message}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
          <FormSelect label="Circuit hydraulique fonctionnel" name="circuitHydraulique" value={formDossier.circuitHydraulique} onChange={(v) => update("circuitHydraulique", v)} options={OUI_NON} />
        </div>

        {/* <h3 className="font-semibold text-lime-600 mt-4 mb-2">Type de radiateurs</h3>
        <div className="flex flex-wrap gap-6 mb-2">
          <CheckboxField label="Radiat. Acier" checked={formDossier.radiateurAcier} onChange={(v) => update("radiateurAcier", v)} />
          <CheckboxField label="Radiat. Alu" checked={formDossier.radiateurAlu} onChange={(v) => update("radiateurAlu", v)} />
          <CheckboxField label="Radiat. Fonte" checked={formDossier.radiateurFonte} onChange={(v) => update("radiateurFonte", v)} />
          <CheckboxField label="Plancher chauffant" checked={formDossier.plancherChauffant} onChange={(v) => update("plancherChauffant", v)} />
        </div>
        <FormInput label="Nombre de radiateurs" name="nombreRadiateurs" value={formDossier.nombreRadiateurs} onChange={(v) => update("nombreRadiateurs", v)} /> */}

        <h3 className="font-semibold text-lime-600 mt-4 mb-2">Thermostats</h3>
        <div className="flex flex-wrap gap-6">
          <CheckboxField label="Kit bi-zone" checked={formDossier.thermostatBiZone} onChange={(v) => update("thermostatBiZone", v)} />
          <CheckboxField label="Thermostat filaire" checked={formDossier.thermostatFilaire} onChange={(v) => update("thermostatFilaire", v)} />
          <CheckboxField label="Thermostat non filaire" checked={formDossier.thermostatNonFilaire} onChange={(v) => update("thermostatNonFilaire", v)} />
          <CheckboxField label="Pas de thermostat" checked={formDossier.pasDeThermostat} onChange={(v) => update("pasDeThermostat", v)} />
        </div>
        <h3 className="font-semibold text-lime-600 mt-4 mb-2">Menuiseries à remplacer</h3>
        <div className="flex flex-wrap gap-6">
          <FormInput label="Quantité" name="quantiteFenetres" value={simulData.dimensionnement.dimensionnementFenetres[0].quantite || "0"} readonly={true} />
          <FormInput label="Matière" name="matiereFenetres" value={simulData.dimensionnement.dimensionnementFenetres[0].matiere || "Non renseigné"} readonly={true} />
        </div>
        <h3 className="font-semibold text-lime-600 mt-4 mb-2">Volets roulants</h3>
        <div className="flex flex-wrap gap-6">
          <FormInput label="Quantité" name="quantiteFenetres" value={simulData.dimensionnement.quantiteVolets || "0"} readonly={true} />
        </div>
      </SectionCard>

      {/* ÉLECTRICITÉ */}
      {onlyForElectricProduct() &&
        <SectionCard title="Électricité">
          <div className="flex flex-wrap gap-6 mb-4">
            <CheckboxField label="Monophasé" checked={formDossier.monophase} onChange={(v) => update("monophase", v)} />
            <CheckboxField label="Triphasé" checked={formDossier.triphase} onChange={(v) => update("triphase", v)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormSelect label="Installation aux normes" name="installationAuxNormes" value={formDossier.installationAuxNormes} onChange={(v) => update("installationAuxNormes", v)} options={OUI_NON} />
            <FormInput label="Ampérage disjoncteur général" name="amperageDisjoncteur" value={formDossier.amperageDisjoncteur} onChange={(v) => update("amperageDisjoncteur", v)} suffix="A" />
            <FormInput label="Ampérage max" name="amperageMax" value={formDossier.amperageMax} onChange={(v) => update("amperageMax", v)} suffix="A" />
            <FormInput label="Emplacement tableau principal" name="emplacementTableauPrincipal" value={formDossier.emplacementTableauPrincipal} onChange={(v) => update("emplacementTableauPrincipal", v)} />
            <FormSelect label="Linky" name="linky" value={formDossier.linky} onChange={(v) => update("linky", v)} options={OUI_NON} />
            <FormInput label="Abonnement kVA" name="abonnementKva" value={formDossier.abonnementKva} onChange={(v) => update("abonnementKva", v)} suffix="kVA" />
          </div>
        </SectionCard>
      }

      {/* PAC AIR EAU */}
      {simulData?.dimensionnement?.selectedSections.pacAirEau &&
        <SectionCard title="PAC Air-Eau">
          <div className="flex flex-wrap gap-6 mb-4">
            <CheckboxField label="Monobloc Hybea" checked={formDossier.pacMonoblocHybea} onChange={(v) => update("pacMonoblocHybea", v)} />
            <CheckboxField label="Bi-bloc" checked={formDossier.pacBiBloc} onChange={(v) => update("pacBiBloc", v)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormInput label="Emplacement unité extérieure" name="emplacementUniteExterieure" value={formDossier.emplacementUniteExterieure} onChange={(v) => update("emplacementUniteExterieure", v)} />
            <FormInput label="Emplacement unité intérieure" name="emplacementUniteInterieure" value={formDossier.emplacementUniteInterieure} onChange={(v) => update("emplacementUniteInterieure", v)} />
            <FormInput label="Distance entre les 2 modules" name="distanceEntreModules" value={formDossier.distanceEntreModules} onChange={(v) => update("distanceEntreModules", v)} />
            <FormInput label="Distance PAC → tableau électrique" name="distancePacTableau" value={formDossier.distancePacTableau} onChange={(v) => update("distancePacTableau", v)} />
            <FormInput label="Difficulté de passage entre tableaux" name="difficultePasaggeTableaux" value={formDossier.difficultePasaggeTableaux} onChange={(v) => update("difficultePasaggeTableaux", v)} className="md:col-span-2" />
          </div>

          <FormSelect label="Chape à faire" name="chapeAFairePac" value={formDossier.chapeAFairePac} onChange={(v) => update("chapeAFairePac", v)} options={OUI_NON} />

          <h3 className="font-semibold text-lime-600 mt-4 mb-2">Passage des liaisons</h3>
          <div className="flex flex-wrap gap-6 mb-2">
            <CheckboxField label="Comble" checked={formDossier.passageLiaisonsComble} onChange={(v) => update("passageLiaisonsComble", v)} />
            <CheckboxField label="Direct" checked={formDossier.passageLiaisonsDirect} onChange={(v) => update("passageLiaisonsDirect", v)} />
            <CheckboxField label="Intérieur maison" checked={formDossier.passageLiaisonsInterieur} onChange={(v) => update("passageLiaisonsInterieur", v)} />
            <CheckboxField label="Autres" checked={formDossier.passageLiaisonsAutres} onChange={(v) => update("passageLiaisonsAutres", v)} />
          </div>
          {formDossier.passageLiaisonsAutres && (
            <FormInput label="" name="passageLiaisonsAutresTexte" value={formDossier.passageLiaisonsAutresTexte} onChange={(v) => update("passageLiaisonsAutresTexte", v)} placeholder="Précisez" />
          )}

          <FormSelect label="Tranchée à faire" name="trancheeAFairePac" value={formDossier.trancheeAFairePac} onChange={(v) => update("trancheeAFairePac", v)} options={OUI_NON} />

          <h3 className="font-semibold text-lime-600 mt-4 mb-2">Type de pose</h3>
          <div className="flex flex-wrap gap-6 mb-2">
            <CheckboxField label="Sol" checked={formDossier.typePosePacSol} onChange={(v) => update("typePosePacSol", v)} />
            <CheckboxField label="Mur" checked={formDossier.typePosePacMur} onChange={(v) => update("typePosePacMur", v)} />
          </div>
          <div className="mb-4">
            <FormInput label="Hauteur local" name="hauteurLocalPac" value={formDossier.hauteurLocalPac} onChange={(v) => update("hauteurLocalPac", v)} />
            <div className="mt-2 flex items-center text-xs text-red-400">
              <TriangleAlert className="mr-1" size={15} />
              Duo Atlantic minimum 2,20m
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-2">
            <CheckboxField label="Lève groupe (+ de 1m et -5m)" checked={formDossier.leveGroupePac} onChange={(v) => update("leveGroupePac", v)} />
            <CheckboxField label="Nacelle (+5m)" checked={formDossier.nacellePac} onChange={(v) => update("nacellePac", v)} />
          </div>
          <div className="mt-2 flex items-center text-xs text-red-400">
            <TriangleAlert className="mr-1" size={15} />
            Pour groupe simple ventilo uniquement
          </div>
          <div className="mt-6 flex items-center justify-center text-sm text-red-400">
            <TriangleAlert className="mr-1" size={20} />
            Groupe Double Ventilo : pose uniquement au sol ou au ras du sol
          </div>
        </SectionCard>
      }


      {/* BTD */}
      {simulData?.dimensionnement?.selectedSections.thermodynamique &&
        <SectionCard title="Ballon Thermodynamique">
          <div className="flex flex-wrap gap-6 mb-4">
            <CheckboxField label="Monobloc" checked={formDossier.btdMonobloc} onChange={(v) => update("btdMonobloc", v)} />
            <CheckboxField label="Bi-bloc" checked={formDossier.btdBiBloc} onChange={(v) => update("btdBiBloc", v)} />
          </div>

          <h3 className="font-semibold text-lime-600 mb-2">Emplacement ballon</h3>
          <div className="flex flex-wrap gap-6 mb-2">
            <CheckboxField label="Local tech." checked={formDossier.btdEmplacementLocalTech} onChange={(v) => update("btdEmplacementLocalTech", v)} />
            <CheckboxField label="Garage" checked={formDossier.btdEmplacementGarage} onChange={(v) => update("btdEmplacementGarage", v)} />
            <CheckboxField label="Cellier" checked={formDossier.btdEmplacementCellier} onChange={(v) => update("btdEmplacementCellier", v)} />
            <CheckboxField label="Autre" checked={formDossier.btdEmplacementAutre} onChange={(v) => update("btdEmplacementAutre", v)} />
          </div>
          {formDossier.btdEmplacementAutre && (
            <FormInput label="" name="btdEmplacementAutreTexte" value={formDossier.btdEmplacementAutreTexte} onChange={(v) => update("btdEmplacementAutreTexte", v)} placeholder="Précisez" />
          )}

          <h3 className="font-semibold text-lime-600 mt-4 mb-2">Emplacement groupe ext.</h3>
          <div className="flex flex-wrap gap-6 mb-2">
            <CheckboxField label="Sol" checked={formDossier.btdGroupeExtSol} onChange={(v) => update("btdGroupeExtSol", v)} />
            <CheckboxField label="Mur" checked={formDossier.btdGroupeExtMur} onChange={(v) => update("btdGroupeExtMur", v)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput label="Hauteur" name="btdGroupeExtHauteur" value={formDossier.btdGroupeExtHauteur} onChange={(v) => update("btdGroupeExtHauteur", v)} />
            <FormSelect label="Dalle existe" name="btdDalleExiste" value={formDossier.btdDalleExiste} onChange={(v) => update("btdDalleExiste", v)} options={OUI_NON} />
          </div>
        </SectionCard>
      }

      {/* PAC AIR AIR */}
      {simulData?.dimensionnement?.selectedSections.pacAirAir &&
        <SectionCard title="PAC Air Air ou Multi+">
          <div className="flex flex-wrap gap-6 mb-4">
            <CheckboxField label="Mono-split" checked={formDossier.pacAirAirMonoSplit} onChange={(v) => update("pacAirAirMonoSplit", v)} />
            <CheckboxField label="Multi-split" checked={formDossier.pacAirAirMultiSplit} onChange={(v) => update("pacAirAirMultiSplit", v)} />
            <CheckboxField label="Console" checked={formDossier.pacAirAirConsole} onChange={(v) => update("pacAirAirConsole", v)} />
            <CheckboxField label="Gainable" checked={formDossier.pacAirAirGainable} onChange={(v) => update("pacAirAirGainable", v)} />
          </div>
          {formDossier.splits.map((split, i) => (
            <div key={i} >
              <h3 className="font-semibold text-lime-600">Split {i + 1}</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-3">
                <FormInput label={`Pièce`} name={`split_${i}_piece`} value={split.nomPiece} onChange={(v) => updateSplit(i, "nomPiece", v)} />
                <FormInput label="Puissance" name={`split_${i}_kw`} value={split.puissanceKw} onChange={(v) => updateSplit(i, "puissanceKw", v)} suffix="kW" />
                <FormSelect label="Dos à dos" name={`split_${i}_dos`} value={split.dosADos} onChange={(v) => updateSplit(i, "dosADos", v)} options={OUI_NON} />
                <FormSelect label="Pompe de relevage" name={`split_${i}_pompe`} value={split.pompeRelevage} onChange={(v) => updateSplit(i, "pompeRelevage", v)} options={OUI_NON} />
                <div className="flex items-end">
                  <button type="button" onClick={() => removeSplit(i)} className="mb-4 text-destructive hover:text-destructive/80">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>

          ))}
          <div className="">
            <button type="button" onClick={addSplit} className="mt-3 py-2 px-3 flex items-center gap-1 text-sm text-white font-bold rounded-md bg-primary hover:underline">
              <Plus className="font-bold" size={25} /> Ajouter un split
            </button>
          </div>

          <h3 className="font-semibold text-lime-600 mt-4 mb-2">Emplacement groupe ext.</h3>
          <div className="flex flex-wrap gap-6 mb-2">
            <CheckboxField label="Sol" checked={formDossier.pacAirAirGroupeExtSol} onChange={(v) => update("pacAirAirGroupeExtSol", v)} />
            <CheckboxField label="Mur" checked={formDossier.pacAirAirGroupeExtMur} onChange={(v) => update("pacAirAirGroupeExtMur", v)} />
            <CheckboxField label="Lève groupe (+ de 1m et -5m)" checked={formDossier.pacAirAirLeveGroupe} onChange={(v) => update("pacAirAirLeveGroupe", v)} />
            <CheckboxField label="Nacelle (+5m)" checked={formDossier.pacAirAirNacelle} onChange={(v) => update("pacAirAirNacelle", v)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <FormInput label="Distance" name="pacAirAirDistance" value={formDossier.pacAirAirDistance} onChange={(v) => update("pacAirAirDistance", v)} />
            <FormInput label="Nature du sol" name="pacAirAirNatureSol" value={formDossier.pacAirAirNatureSol} onChange={(v) => update("pacAirAirNatureSol", v)} />
            <FormInput label="Hauteur" name="pacAirAirHauteur" value={formDossier.pacAirAirHauteur} onChange={(v) => update("pacAirAirHauteur", v)} />
            <FormInput label="Type de mur" name="pacAirAirTypeMur" value={formDossier.pacAirAirTypeMur} onChange={(v) => update("pacAirAirTypeMur", v)} />
            <FormInput label="Tranchée (longueur)" name="pacAirAirTranchee" value={formDossier.pacAirAirTranchee} onChange={(v) => update("pacAirAirTranchee", v)} />
          </div>
          <div className="flex flex-wrap gap-6">
            <CheckboxField label="Chape existante" checked={formDossier.pacAirAirChapeExistante} onChange={(v) => update("pacAirAirChapeExistante", v)} />
            <CheckboxField label="Chape à faire" checked={formDossier.pacAirAirChapeAFaire} onChange={(v) => update("pacAirAirChapeAFaire", v)} />
          </div>
        </SectionCard>
      }

      {/* PV ou SSC */}
      {simulData?.dimensionnement?.selectedSections.photovoltaique || simulData?.dimensionnement?.selectedSections.ssc &&
        <SectionCard title="PV ou SSC">
          <h3 className="font-semibold text-lime-600 mb-2">Type de pose</h3>
          <div className="flex flex-wrap gap-6 mb-4">
            <CheckboxField label="Au sol" checked={formDossier.pvTypePoseAuSol} onChange={(v) => update("pvTypePoseAuSol", v)} />
            <CheckboxField label="Toiture" checked={formDossier.pvTypePoseToiture} onChange={(v) => update("pvTypePoseToiture", v)} />
            <CheckboxField label="Murale SSC" checked={formDossier.pvTypePoseMuraleSsc} onChange={(v) => update("pvTypePoseMuraleSsc", v)} />
          </div>

          <h3 className="font-semibold text-lime-600 mb-2">Format de pose</h3>
          <div className="flex flex-wrap gap-6 mb-4">
            <CheckboxField label="Portrait" checked={formDossier.pvFormatPortrait} onChange={(v) => update("pvFormatPortrait", v)} />
            <CheckboxField label="Paysage" checked={formDossier.pvFormatPaysage} onChange={(v) => update("pvFormatPaysage", v)} />
          </div>

          <h3 className="font-semibold text-lime-600 mb-2">Type de toiture</h3>
          <div className="flex flex-wrap gap-6 mb-4">
            <CheckboxField label="Bac acier" checked={formDossier.pvToitureBacAcier} onChange={(v) => update("pvToitureBacAcier", v)} />
            <CheckboxField label="Éverite" checked={formDossier.pvToitureEverite} onChange={(v) => update("pvToitureEverite", v)} />
            <CheckboxField label="Tuile" checked={formDossier.pvToitureTuile} onChange={(v) => update("pvToitureTuile", v)} />
          </div>

          <h3 className="font-semibold text-lime-600 mb-2">Raccordement (si compteur ext.)</h3>
          <div className="flex flex-wrap gap-6 mb-4">
            <CheckboxField label="Enterré" checked={formDossier.pvRaccordementEnterre} onChange={(v) => update("pvRaccordementEnterre", v)} />
            <CheckboxField label="Aérien" checked={formDossier.pvRaccordementAerien} onChange={(v) => update("pvRaccordementAerien", v)} />
          </div>

          <h3 className="font-semibold text-lime-600 mb-2">Documents</h3>
          <div className="flex flex-wrap gap-6 mb-4">
            <CheckboxField label="Devis signé" checked={formDossier.pvDocDevisSigne} onChange={(v) => update("pvDocDevisSigne", v)} />
            <CheckboxField label="Pouvoir" checked={formDossier.pvDocPouvoir} onChange={(v) => update("pvDocPouvoir", v)} />
            <CheckboxField label="Taxe foncière" checked={formDossier.pvDocTaxeFonciere} onChange={(v) => update("pvDocTaxeFonciere", v)} />
            <CheckboxField label="Facture EDF" checked={formDossier.pvDocFactureEdf} onChange={(v) => update("pvDocFactureEdf", v)} />
            <CheckboxField label="Parcelle" checked={formDossier.pvDocParcelle} onChange={(v) => update("pvDocParcelle", v)} />
          </div>

          <div className="flex flex-wrap gap-6 mb-4">
            <CheckboxField label="Si + de 4m : Nacelle" checked={formDossier.pvNacellePlus4m} onChange={(v) => update("pvNacellePlus4m", v)} />
          </div>
          <div className="text-red-500">
            Panneau SSC Taille : 2,38 x 1,06 m
          </div>
          <div className="text-red-500">
            Ballon SSC : 80 cm diamètre, hauteur 1,8m
          </div>
        </SectionCard>
      }

      {/* RADIATEURS */}
      {simulData?.dimensionnement?.selectedSections?.pacAirEau &&
        <SectionCard title="Radiateurs">
          <CheckboxField label="Plancher chauffant" checked={formDossier.plancherChauffant} onChange={(v) => update("plancherChauffant", v)} />
          <div className="mt-4 overflow-x-auto">
            {formDossier.radiateurs.map((rad, i) => (
              <div key={i} className="mb-3">
                <div className="mb-2 text-lime-600 ">Radiateur {i + 1}</div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <FormSelect label={`Matériau`} name={`radiateur_${i}_materiau`} value={rad.materiau} onChange={(v) => updateRadiateur(i, "materiau", v)} options={MATERIAUX_RADIATEUR} />
                  <FormInput type="number" label="Hauteur" name={`radiateur_${i}_hauteur`} value={rad.hauteur} onChange={(v) => updateRadiateur(i, "hauteur", v)} suffix="cm" />
                  <FormInput type="number" label="Largeur" name={`radiateur_${i}_largeur`} value={rad.largeur} onChange={(v) => updateRadiateur(i, "largeur", v)} suffix="cm" />
                  <FormInput type="number" label="Épaisseur" name={`radiateur_${i}_epaisseur`} value={rad.epaisseur} onChange={(v) => updateRadiateur(i, "epaisseur", v)} suffix="cm" />
                  <div className="flex items-end">
                    <button type="button" onClick={() => removeRadiateur(i)} className="mb-4 text-destructive hover:text-destructive/80">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
          <button type="button" onClick={addRadiateur} className="mt-3 py-2 px-3 flex items-center gap-1 text-sm text-white font-bold rounded-md bg-primary hover:underline">
            <Plus className="w-4 h-4" /> Ajouter un radiateur
          </button>
        </SectionCard>
      }

      {/* PHOTOS CHECKLIST*/}
      <SectionCard title="Photos à faire (obligatoire)">
        <h3 className="font-semibold text-lime-600 mb-2">Équipement</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 mb-4">
          <CheckboxField label="Compteur" checked={formDossier.photoCompteur} onChange={(v) => update("photoCompteur", v)} isMissing={fieldErrors["photoCompteur"]} />
          <CheckboxField label="Chaudière à remplacer" checked={formDossier.photoChaudiere} onChange={(v) => update("photoChaudiere", v)} isMissing={fieldErrors["photoChaudiere"]} />
          <CheckboxField label="Emplacement du groupe extérieur" checked={formDossier.photoGroupeExt} onChange={(v) => update("photoGroupeExt", v)} isMissing={fieldErrors["photoGroupeExt"]} />
          <CheckboxField label="Maison vue de la rue" checked={formDossier.photoMaison} onChange={(v) => update("photoMaison", v)} isMissing={fieldErrors["photoMaison"]} />
          <CheckboxField label="Combles" checked={formDossier.photoCombles} onChange={(v) => update("photoCombles", v)} isMissing={fieldErrors["photoCombles"]} />
          <CheckboxField label="Système ECS" checked={formDossier.photoECS} onChange={(v) => update("photoECS", v)} isMissing={fieldErrors["photoECS"]} />
          <CheckboxField label="Disjoncteur" checked={formDossier.photoDisjoncteur} onChange={(v) => update("photoDisjoncteur", v)} isMissing={fieldErrors["photoDisjoncteur"]} />
          <CheckboxField label="Tuyauterie de la chaudière" checked={formDossier.photoTuyauterie} onChange={(v) => update("photoTuyauterie", v)} isMissing={fieldErrors["photoTuyauterie"]} />
          <CheckboxField label="Radiateurs" checked={formDossier.photoRadiateurs} onChange={(v) => update("photoRadiateurs", v)} isMissing={fieldErrors["photoRadiateurs"]} />
          <CheckboxField label="Plafonds" checked={formDossier.photoPlafonds} onChange={(v) => update("photoPlafonds", v)} isMissing={fieldErrors["photoPlafonds"]} />
          <CheckboxField label="Sous-sol" checked={formDossier.photoSousSol} onChange={(v) => update("photoSousSol", v)} isMissing={fieldErrors["photoSousSol"]} />
          <CheckboxField label="Tableaux électriques existants" checked={formDossier.photoTableauElec} onChange={(v) => update("photoTableauElec", v)} isMissing={fieldErrors["photoTableauElec"]} />
          <CheckboxField label="Ventilation" checked={formDossier.photoVentilation} onChange={(v) => update("photoVentilation", v)} isMissing={fieldErrors["photoVentilation"]} />
          <CheckboxField label="Emplacement des unités intérieures" checked={formDossier.photoUniteInt} onChange={(v) => update("photoUniteInt", v)} isMissing={fieldErrors["photoUniteInt"]} />
          <CheckboxField label="Planchers" checked={formDossier.photoPlancher} onChange={(v) => update("photoPlancher", v)} />
          <CheckboxField label="Rez-de-chaussée" checked={formDossier.photoRDC} onChange={(v) => update("photoRDC", v)} />
        </div>
        <h3 className="font-semibold text-lime-600 mb-2">Menuiseries et isolation extérieure</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CheckboxField label="Fenêtres" checked={formDossier.photoFenetres} onChange={(v) => update("photoFenetres", v)} />
          <CheckboxField label="Portes-fenêtres" checked={formDossier.photoPorteFenetre} onChange={(v) => update("photoPorteFenetre", v)} />
          <CheckboxField label="Façades extérieures" checked={formDossier.photoFacade} onChange={(v) => update("photoFacade", v)} />
          <CheckboxField label="Porte" checked={formDossier.photoPorte} onChange={(v) => update("photoPorte", v)} />
        </div>
      </SectionCard>

      {/* COMMENTAIRES */}
      <SectionCard title="Détails dossier & chantier">
        <FormTextarea label="Commentaires" name="commentaires_dossier" value={formDossier.commentaires} onChange={(v) => update("commentaires", v)} rows={6} isMissing={fieldErrors["commentaires"]} />
      </SectionCard>
    </div>
  );
};

export default StepDossier;