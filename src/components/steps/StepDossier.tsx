import React, { useState, useEffect, useCallback } from "react";
import { FileCheck, FileWarning, Plus, Trash2, Triangle, TriangleAlert } from "lucide-react";
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


interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer py-1">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 rounded border-input accent-primary"
    />
    <span className="text-sm">{label}</span>
  </label>
);

interface StepDossierProps {
  data: FormData;
}

const StepDossier: React.FC<StepDossierProps> = () => {
  const STORAGE_KEY = "dossier_form";

  const [form, setForm] = useState<DossierFormData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...defaultDossierFormData, ...JSON.parse(stored) };
    } catch { /* ignore */ }
    return { ...defaultDossierFormData };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

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

  return (
    <div className="space-y-4">
      {/* Page title */}
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Montage du dossier de liaison
        </h2>
      </div>
      {/* DOSSIER DE LIAISON */}
      <SectionCard title="Infos générales">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Conseiller" name="conseiller" value={form.conseiller} onChange={(v) => update("conseiller", v)} />
          <div className="flex items-end">
            <CheckboxField label="Perso" checked={form.perso} onChange={(v) => update("perso", v)} />
          </div>
          <FormInput label="Nom du client" name="nomClient" value={form.nomClient} onChange={(v) => update("nomClient", v)} />
          <FormInput label="Téléphone" name="telephone" value={form.telephone} type="tel" onChange={(v) => update("telephone", v)} />
          <FormInput label="Adresse" name="adresseDossier" value={form.adresse} onChange={(v) => update("adresse", v)} className="md:col-span-2" />
          <FormInput label="Adresse de l'installation (si différente)" name="adresseInstallation" value={form.adresseInstallation} onChange={(v) => update("adresseInstallation", v)} className="md:col-span-2" />
        </div>
      </SectionCard>

      {/* RÈGLEMENT */}
      <SectionCard title="Règlement">
        <div className="flex flex-wrap gap-6">
          <CheckboxField label="Chèque" checked={form.reglementCheque} onChange={(v) => update("reglementCheque", v)} />
          <CheckboxField label="Financement" checked={form.reglementFinancement} onChange={(v) => update("reglementFinancement", v)} />
          <CheckboxField label="PTZ" checked={form.reglementPTZ} onChange={(v) => update("reglementPTZ", v)} />
        </div>
      </SectionCard>

      {/* DOSSIER DE PRIME */}
      <SectionCard title="Dossier de prime">
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Propriétaire occupant" checked={form.proprietaireOccupant} onChange={(v) => update("proprietaireOccupant", v)} />
          <CheckboxField label="Propriétaire bailleur" checked={form.proprietaireBailleur} onChange={(v) => update("proprietaireBailleur", v)} />
          <CheckboxField label="Résid. secondaire" checked={form.residSecondaire} onChange={(v) => update("residSecondaire", v)} />
          <CheckboxField label="SCI" checked={form.sci} onChange={(v) => update("sci", v)} />
        </div>


      </SectionCard>

      {/* PIECES CHECKLITS*/}
      <SectionCard title="Éléments obligatoires pour pose">
        <h3 className="font-semibold text-lime-600 mb-2">Pièces / checklist</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 mb-4">
          <CheckboxField label="Devis non signé" checked={form.devisNonSigne} onChange={(v) => update("devisNonSigne", v)} />
          <CheckboxField label="Devis signé" checked={form.devisSigne} onChange={(v) => update("devisSigne", v)} />
          <CheckboxField label="Carte d'identité" checked={form.carteIdentite} onChange={(v) => update("carteIdentite", v)} />
          <CheckboxField label="2 derniers avis d'impôts" checked={form.deuxDerniersAvisImpots} onChange={(v) => update("deuxDerniersAvisImpots", v)} />
          <CheckboxField label="Taxe foncière ou acte notarié" checked={form.taxeFonciereActeNotarie} onChange={(v) => update("taxeFonciereActeNotarie", v)} />
          <CheckboxField label="Mandat MaPrimeRénov" checked={form.mandatMaPrimeRenov} onChange={(v) => update("mandatMaPrimeRenov", v)} />
          <CheckboxField label="Identité numérique" checked={form.idNumerique} onChange={(v) => update("idNumerique", v)} />          <CheckboxField label="RIB" checked={form.rib} onChange={(v) => update("rib", v)} />
          <CheckboxField label="Attestation fioul" checked={form.attestationFioul} onChange={(v) => update("attestationFioul", v)} />
          <CheckboxField label="Attestation indivisionnaire" checked={form.attestationIndivisionnaire} onChange={(v) => update("attestationIndivisionnaire", v)} />
          <CheckboxField label="Attestation propriétaire bailleur" checked={form.attestationProprietaireBailleur} onChange={(v) => update("attestationProprietaireBailleur", v)} />
          <CheckboxField label="Note de dimensionnement" checked={form.noteDimensionnement} onChange={(v) => update("noteDimensionnement", v)} />
          <CheckboxField label="Revolt" checked={form.revolt} onChange={(v) => update("revolt", v)} />
          <CheckboxField label="Pouvoir" checked={form.pouvoir} onChange={(v) => update("pouvoir", v)} />
        </div>

        <h3 className="font-semibold text-lime-600 mb-2">Compte Prime EDF</h3>
        <div className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            {/* <div className="underline">Prime CEE déduite</div> */}
            <CheckboxField label="Prime CEE déduite" checked={form.primeCeeDeduite} onChange={(v) => update("primeCeeDeduite", v)} />
            <FormInput type="number" label="Montant Prime EDF" name="montantPrimeEDF" value={form.montantPrimeEDF} onChange={(v) => update("montantPrimeEDF", v)} suffix="€" />
          </div>
          <div className="md:col-span-2">
            {/* <div className="underline">Compte Prime CEE EDF</div> */}
            <CheckboxField label="Compte Prime CEE EDF" checked={form.compteCeeEdf} onChange={(v) => update("compteCeeEdf", v)} />
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Mail" name="mailPrimeEDF" value={form.mailPrimeEDF} onChange={(v) => update("mailPrimeEDF", v)} type="email" />
              <FormInput label="MDP" name="mdpPrimeEDF" value={form.mdpPrimeEDF} onChange={(v) => update("mdpPrimeEDF", v)} />
            </div>
          </div>
        </div>
        <h3 className="font-semibold text-lime-600 mb-2">Compte Prime Rénov</h3>
        <div className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <CheckboxField label="Non éligible" checked={form.nonEligibleMpr} onChange={(v) => update("nonEligibleMpr", v)} />
            <FormInput type="number" label="Montant Prime Rénov" name="montantPrimeRenov" value={form.montantPrimeRenov} onChange={(v) => update("montantPrimeRenov", v)} suffix="€" readonly={form.nonEligibleMpr} />
          </div>
          <div className="md:col-span-2">
            <div className="underline">Compte MaPrimeRenov'</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Mail" name="mailPrimeRenov" value={form.mailPrimeRenov} onChange={(v) => update("mailPrimeRenov", v)} type="email" readonly={form.nonEligibleMpr} />
              <FormInput label="MDP" name="mdpPrimeRenov" value={form.mdpPrimeRenov} onChange={(v) => update("mdpPrimeRenov", v)} readonly={form.nonEligibleMpr} />
            </div>
          </div>
        </div>
        <h3 className="font-semibold text-lime-600 mb-2">Si le client n'a pas d'adresse mail, ne pas oubliez de lui communiquer</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput label="Gmail créé" name="gmailCree" value={form.gmailCree} onChange={(v) => update("gmailCree", v)} type="email" />
          <FormInput label="MDP" name="mdpGmail" value={form.mdpGmail} onChange={(v) => update("mdpGmail", v)} />
        </div>
      </SectionCard>

      {/* DOSSIER DE FINANCEMENT */}
      <SectionCard title="Dossier de financement">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
          <CheckboxField label="Justificatif de domicile < 3 mois (électricité, gaz, téléphone)" checked={form.justificatifDomicile} onChange={(v) => update("justificatifDomicile", v)} />
          <CheckboxField label="Dernier(s) bulletin(s) de salaires + contrat de travail (si CDD ou CDI depuis moins d'un an)" checked={form.bulletinsSalaires} onChange={(v) => update("bulletinsSalaires", v)} />
          <CheckboxField label="Bilan (entrepreneur)" checked={form.bilanEntrepreneur} onChange={(v) => update("bilanEntrepreneur", v)} />
        </div>
      </SectionCard>

      {/* MAISON */}
      <SectionCard title="Maison">
        <FormInput type="number" label="Année de construction" name="anneeConstruction_d" value={form.anneeConstruction} onChange={(v) => update("anneeConstruction", v)} />
        <h3 className="font-semibold text-lime-600 mt-4 mb-2">Structure</h3>
        <div className="mb-2">
          <CheckboxField label="Plain-pied" checked={form.plainPied} onChange={(v) => update("plainPied", v)} />
          <CheckboxField label="Étages" checked={form.etages} onChange={(v) => update("etages", v)} />
          {form.etages && <FormInput className="my-4" type="number" label="Nombre d'étages" name="nbEtages" value={form.nbEtages} onChange={(v) => update("nbEtages", v)} />}
          <CheckboxField label="Sous-sol" checked={form.sousSol} onChange={(v) => update("sousSol", v)} />
          <CheckboxField label="Vide sanitaire" checked={form.videSanitaire} onChange={(v) => {
            update("videSanitaire", v);
            if (!v) update("videSanitaireAccessible", false);
          }} />
          {form.videSanitaire &&
            <div className="ml-4">
              <CheckboxField
                label="Accessible ?"
                checked={form.videSanitaireAccessible}
                onChange={(v) => update("videSanitaireAccessible", v)}
              />
            </div>
          }
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <FormInput label="Type de mur" name="typeMur_d" value={form.typeMur} onChange={(v) => update("typeMur", v)} />
          <FormInput type="number" label="Épaisseur mur" name="epaisseurMur_d" value={form.epaisseurMur} onChange={(v) => update("epaisseurMur", v)} suffix="cm" />
        </div>

        <h3 className="font-semibold text-lime-600 mt-4 mb-2">Combles</h3>
        <div className="flex flex-wrap gap-6 mb-2">
          <CheckboxField label="Combles perdus" checked={form.comblePerdu} onChange={(v) => update("comblePerdu", v)} />
          <CheckboxField label="Combles aménagés (sous rampant)" checked={form.combleAmenage} onChange={(v) => update("combleAmenage", v)} />
        </div>
        {form.comblePerdu && (
          <div className="flex flex-wrap gap-6 mb-2 ml-4">
            <div>Accessibles par : </div>
            <CheckboxField label="Trappe" checked={form.comblePerduTrappe} onChange={(v) => update("comblePerduTrappe", v)} />
            <CheckboxField label="Toit" checked={form.comblePerduToit} onChange={(v) => update("comblePerduToit", v)} />
            <CheckboxField label="Autre" checked={form.comblePerduAutre} onChange={(v) => update("comblePerduAutre", v)} />
            {form.comblePerduAutre && (
              <FormInput label="" name="comblePerduAutreTexte" value={form.comblePerduAutreTexte} onChange={(v) => update("comblePerduAutreTexte", v)} placeholder="Précisez" />
            )}
          </div>
        )}

        <h3 className="font-semibold text-lime-600 mt-4 mb-2">Type de plancher</h3>
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Bois" checked={form.plancherBois} onChange={(v) => update("plancherBois", v)} />
          <CheckboxField label="Placo" checked={form.plancherPlaco} onChange={(v) => update("plancherPlaco", v)} />
          <CheckboxField label="Hourdis" checked={form.plancherHourdis} onChange={(v) => update("plancherHourdis", v)} />
        </div>

        <h3 className="font-semibold text-lime-600 mt-4 mb-2">Chauffage actuel</h3>
        <div className="flex flex-wrap gap-6 mb-2">
          <CheckboxField label="Fioul" checked={form.chauffageFioul} onChange={(v) => update("chauffageFioul", v)} />
          <CheckboxField label="Gaz" checked={form.chauffageGaz} onChange={(v) => update("chauffageGaz", v)} />
          <CheckboxField label="Radiateurs électriques" checked={form.chauffageRadiateursElec} onChange={(v) => update("chauffageRadiateursElec", v)} />
          <CheckboxField label="Bois" checked={form.chauffageBois} onChange={(v) => update("chauffageBois", v)} />
          <CheckboxField label="Autre" checked={form.chauffageAutre} onChange={(v) => update("chauffageAutre", v)} />
        </div>
        {form.chauffageAutre && (
          <FormInput label="" name="chauffageAutreTexte" value={form.chauffageAutreTexte} onChange={(v) => update("chauffageAutreTexte", v)} placeholder="Précisez" />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
          <FormSelect label="Circuit hydraulique fonctionnel" name="circuitHydraulique" value={form.circuitHydraulique} onChange={(v) => update("circuitHydraulique", v)} options={OUI_NON} />
        </div>

        <h3 className="font-semibold text-lime-600 mt-4 mb-2">Type de radiateurs</h3>
        <div className="flex flex-wrap gap-6 mb-2">
          <CheckboxField label="Radiat. Acier" checked={form.radiateurAcier} onChange={(v) => update("radiateurAcier", v)} />
          <CheckboxField label="Radiat. Alu" checked={form.radiateurAlu} onChange={(v) => update("radiateurAlu", v)} />
          <CheckboxField label="Radiat. Fonte" checked={form.radiateurFonte} onChange={(v) => update("radiateurFonte", v)} />
          <CheckboxField label="Plancher chauffant" checked={form.plancherChauffant} onChange={(v) => update("plancherChauffant", v)} />
        </div>
        <FormInput label="Nombre de radiateurs" name="nombreRadiateurs" value={form.nombreRadiateurs} onChange={(v) => update("nombreRadiateurs", v)} />

        <h3 className="font-semibold text-lime-600 mt-4 mb-2">Thermostats</h3>
        <div className="flex flex-wrap gap-6">
          <CheckboxField label="Kit bi-zone" checked={form.thermostatBiZone} onChange={(v) => update("thermostatBiZone", v)} />
          <CheckboxField label="Thermostat filaire" checked={form.thermostatFilaire} onChange={(v) => update("thermostatFilaire", v)} />
          <CheckboxField label="Thermostat non filaire" checked={form.thermostatNonFilaire} onChange={(v) => update("thermostatNonFilaire", v)} />
          <CheckboxField label="Pas de thermostat" checked={form.pasDeThermostat} onChange={(v) => update("pasDeThermostat", v)} />
        </div>
      </SectionCard>

      {/* ÉLECTRICITÉ */}
      <SectionCard title="Électricité">
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Monophasé" checked={form.monophase} onChange={(v) => update("monophase", v)} />
          <CheckboxField label="Triphasé" checked={form.triphase} onChange={(v) => update("triphase", v)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormSelect label="Installation aux normes" name="installationAuxNormes" value={form.installationAuxNormes} onChange={(v) => update("installationAuxNormes", v)} options={OUI_NON} />
          <FormInput label="Ampérage disjoncteur général" name="amperageDisjoncteur" value={form.amperageDisjoncteur} onChange={(v) => update("amperageDisjoncteur", v)} suffix="A" />
          <FormInput label="Ampérage max" name="amperageMax" value={form.amperageMax} onChange={(v) => update("amperageMax", v)} suffix="A" />
          <FormInput label="Emplacement tableau principal" name="emplacementTableauPrincipal" value={form.emplacementTableauPrincipal} onChange={(v) => update("emplacementTableauPrincipal", v)} />
          <FormSelect label="Linky" name="linky" value={form.linky} onChange={(v) => update("linky", v)} options={OUI_NON} />
          <FormInput label="Abonnement kVA" name="abonnementKva" value={form.abonnementKva} onChange={(v) => update("abonnementKva", v)} suffix="kVA" />
        </div>
      </SectionCard>

      {/* PAC AIR EAU */}
      <SectionCard title="PAC Air-Eau">
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Monobloc Hybea" checked={form.pacMonoblocHybea} onChange={(v) => update("pacMonoblocHybea", v)} />
          <CheckboxField label="Bi-bloc" checked={form.pacBiBloc} onChange={(v) => update("pacBiBloc", v)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormInput label="Emplacement unité extérieure" name="emplacementUniteExterieure" value={form.emplacementUniteExterieure} onChange={(v) => update("emplacementUniteExterieure", v)} />
          <FormInput label="Emplacement unité intérieure" name="emplacementUniteInterieure" value={form.emplacementUniteInterieure} onChange={(v) => update("emplacementUniteInterieure", v)} />
          <FormInput label="Distance entre les 2 modules" name="distanceEntreModules" value={form.distanceEntreModules} onChange={(v) => update("distanceEntreModules", v)} />
          <FormInput label="Distance PAC → tableau électrique" name="distancePacTableau" value={form.distancePacTableau} onChange={(v) => update("distancePacTableau", v)} />
          <FormInput label="Difficulté de passage entre tableaux" name="difficultePasaggeTableaux" value={form.difficultePasaggeTableaux} onChange={(v) => update("difficultePasaggeTableaux", v)} className="md:col-span-2" />
        </div>

        <FormSelect label="Chape à faire" name="chapeAFairePac" value={form.chapeAFairePac} onChange={(v) => update("chapeAFairePac", v)} options={OUI_NON} />

        <h3 className="font-semibold text-lime-600 mt-4 mb-2">Passage des liaisons</h3>
        <div className="flex flex-wrap gap-6 mb-2">
          <CheckboxField label="Comble" checked={form.passageLiaisonsComble} onChange={(v) => update("passageLiaisonsComble", v)} />
          <CheckboxField label="Direct" checked={form.passageLiaisonsDirect} onChange={(v) => update("passageLiaisonsDirect", v)} />
          <CheckboxField label="Intérieur maison" checked={form.passageLiaisonsInterieur} onChange={(v) => update("passageLiaisonsInterieur", v)} />
          <CheckboxField label="Autres" checked={form.passageLiaisonsAutres} onChange={(v) => update("passageLiaisonsAutres", v)} />
        </div>
        {form.passageLiaisonsAutres && (
          <FormInput label="" name="passageLiaisonsAutresTexte" value={form.passageLiaisonsAutresTexte} onChange={(v) => update("passageLiaisonsAutresTexte", v)} placeholder="Précisez" />
        )}

        <FormSelect label="Tranchée à faire" name="trancheeAFairePac" value={form.trancheeAFairePac} onChange={(v) => update("trancheeAFairePac", v)} options={OUI_NON} />

        <h3 className="font-semibold text-lime-600 mt-4 mb-2">Type de pose</h3>
        <div className="flex flex-wrap gap-6 mb-2">
          <CheckboxField label="Sol" checked={form.typePosePacSol} onChange={(v) => update("typePosePacSol", v)} />
          <CheckboxField label="Mur" checked={form.typePosePacMur} onChange={(v) => update("typePosePacMur", v)} />
        </div>
        <div className="mb-4">
          <FormInput label="Hauteur local" name="hauteurLocalPac" value={form.hauteurLocalPac} onChange={(v) => update("hauteurLocalPac", v)} />
          <div className="mt-2 flex items-center text-xs text-red-400">
            <TriangleAlert className="mr-1" size={15} />
            Duo Atlantic minimum 2,20m
          </div>
        </div>
        <div className="flex flex-wrap gap-6 mt-2">
          <CheckboxField label="Lève groupe (+ de 1m et -5m)" checked={form.leveGroupePac} onChange={(v) => update("leveGroupePac", v)} />
          <CheckboxField label="Nacelle (+5m)" checked={form.nacellePac} onChange={(v) => update("nacellePac", v)} />
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

      {/* BTD */}
      <SectionCard title="Ballon Thermodynamique">
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Monobloc" checked={form.btdMonobloc} onChange={(v) => update("btdMonobloc", v)} />
          <CheckboxField label="Bi-bloc" checked={form.btdBiBloc} onChange={(v) => update("btdBiBloc", v)} />
        </div>

        <h3 className="font-semibold text-lime-600 mb-2">Emplacement ballon</h3>
        <div className="flex flex-wrap gap-6 mb-2">
          <CheckboxField label="Local tech." checked={form.btdEmplacementLocalTech} onChange={(v) => update("btdEmplacementLocalTech", v)} />
          <CheckboxField label="Garage" checked={form.btdEmplacementGarage} onChange={(v) => update("btdEmplacementGarage", v)} />
          <CheckboxField label="Cellier" checked={form.btdEmplacementCellier} onChange={(v) => update("btdEmplacementCellier", v)} />
          <CheckboxField label="Autre" checked={form.btdEmplacementAutre} onChange={(v) => update("btdEmplacementAutre", v)} />
        </div>
        {form.btdEmplacementAutre && (
          <FormInput label="" name="btdEmplacementAutreTexte" value={form.btdEmplacementAutreTexte} onChange={(v) => update("btdEmplacementAutreTexte", v)} placeholder="Précisez" />
        )}

        <h3 className="font-semibold text-lime-600 mt-4 mb-2">Emplacement groupe ext.</h3>
        <div className="flex flex-wrap gap-6 mb-2">
          <CheckboxField label="Sol" checked={form.btdGroupeExtSol} onChange={(v) => update("btdGroupeExtSol", v)} />
          <CheckboxField label="Mur" checked={form.btdGroupeExtMur} onChange={(v) => update("btdGroupeExtMur", v)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput label="Hauteur" name="btdGroupeExtHauteur" value={form.btdGroupeExtHauteur} onChange={(v) => update("btdGroupeExtHauteur", v)} />
          <FormSelect label="Dalle existe" name="btdDalleExiste" value={form.btdDalleExiste} onChange={(v) => update("btdDalleExiste", v)} options={OUI_NON} />
        </div>
      </SectionCard>

      {/* PAC AIR AIR */}
      <SectionCard title="PAC Air Air ou Multi+">
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Mono-split" checked={form.pacAirAirMonoSplit} onChange={(v) => update("pacAirAirMonoSplit", v)} />
          <CheckboxField label="Multi-split" checked={form.pacAirAirMultiSplit} onChange={(v) => update("pacAirAirMultiSplit", v)} />
          <CheckboxField label="Console" checked={form.pacAirAirConsole} onChange={(v) => update("pacAirAirConsole", v)} />
          <CheckboxField label="Gainable" checked={form.pacAirAirGainable} onChange={(v) => update("pacAirAirGainable", v)} />
        </div>
        {form.splits.map((split, i) => (
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
          <CheckboxField label="Sol" checked={form.pacAirAirGroupeExtSol} onChange={(v) => update("pacAirAirGroupeExtSol", v)} />
          <CheckboxField label="Mur" checked={form.pacAirAirGroupeExtMur} onChange={(v) => update("pacAirAirGroupeExtMur", v)} />
          <CheckboxField label="Lève groupe (+ de 1m et -5m)" checked={form.pacAirAirLeveGroupe} onChange={(v) => update("pacAirAirLeveGroupe", v)} />
          <CheckboxField label="Nacelle (+5m)" checked={form.pacAirAirNacelle} onChange={(v) => update("pacAirAirNacelle", v)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <FormInput label="Distance" name="pacAirAirDistance" value={form.pacAirAirDistance} onChange={(v) => update("pacAirAirDistance", v)} />
          <FormInput label="Nature du sol" name="pacAirAirNatureSol" value={form.pacAirAirNatureSol} onChange={(v) => update("pacAirAirNatureSol", v)} />
          <FormInput label="Hauteur" name="pacAirAirHauteur" value={form.pacAirAirHauteur} onChange={(v) => update("pacAirAirHauteur", v)} />
          <FormInput label="Type de mur" name="pacAirAirTypeMur" value={form.pacAirAirTypeMur} onChange={(v) => update("pacAirAirTypeMur", v)} />
          <FormInput label="Tranchée (longueur)" name="pacAirAirTranchee" value={form.pacAirAirTranchee} onChange={(v) => update("pacAirAirTranchee", v)} />
        </div>
        <div className="flex flex-wrap gap-6">
          <CheckboxField label="Chape existante" checked={form.pacAirAirChapeExistante} onChange={(v) => update("pacAirAirChapeExistante", v)} />
          <CheckboxField label="Chape à faire" checked={form.pacAirAirChapeAFaire} onChange={(v) => update("pacAirAirChapeAFaire", v)} />
        </div>
      </SectionCard>

      {/* PV ou SSC */}
      <SectionCard title="PV ou SSC">
        <h3 className="font-semibold text-lime-600 mb-2">Type de pose</h3>
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Au sol" checked={form.pvTypePoseAuSol} onChange={(v) => update("pvTypePoseAuSol", v)} />
          <CheckboxField label="Toiture" checked={form.pvTypePoseToiture} onChange={(v) => update("pvTypePoseToiture", v)} />
          <CheckboxField label="Murale SSC" checked={form.pvTypePoseMuraleSsc} onChange={(v) => update("pvTypePoseMuraleSsc", v)} />
        </div>

        <h3 className="font-semibold text-lime-600 mb-2">Format de pose</h3>
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Portrait" checked={form.pvFormatPortrait} onChange={(v) => update("pvFormatPortrait", v)} />
          <CheckboxField label="Paysage" checked={form.pvFormatPaysage} onChange={(v) => update("pvFormatPaysage", v)} />
        </div>

        <h3 className="font-semibold text-lime-600 mb-2">Type de toiture</h3>
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Bac acier" checked={form.pvToitureBacAcier} onChange={(v) => update("pvToitureBacAcier", v)} />
          <CheckboxField label="Éverite" checked={form.pvToitureEverite} onChange={(v) => update("pvToitureEverite", v)} />
          <CheckboxField label="Tuile" checked={form.pvToitureTuile} onChange={(v) => update("pvToitureTuile", v)} />
        </div>

        <h3 className="font-semibold text-lime-600 mb-2">Raccordement (si compteur ext.)</h3>
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Enterré" checked={form.pvRaccordementEnterre} onChange={(v) => update("pvRaccordementEnterre", v)} />
          <CheckboxField label="Aérien" checked={form.pvRaccordementAerien} onChange={(v) => update("pvRaccordementAerien", v)} />
        </div>

        <h3 className="font-semibold text-lime-600 mb-2">Documents</h3>
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Devis signé" checked={form.pvDocDevisSigne} onChange={(v) => update("pvDocDevisSigne", v)} />
          <CheckboxField label="Pouvoir" checked={form.pvDocPouvoir} onChange={(v) => update("pvDocPouvoir", v)} />
          <CheckboxField label="Taxe foncière" checked={form.pvDocTaxeFonciere} onChange={(v) => update("pvDocTaxeFonciere", v)} />
          <CheckboxField label="Facture EDF" checked={form.pvDocFactureEdf} onChange={(v) => update("pvDocFactureEdf", v)} />
          <CheckboxField label="Parcelle" checked={form.pvDocParcelle} onChange={(v) => update("pvDocParcelle", v)} />
        </div>

        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Si + de 4m : Nacelle" checked={form.pvNacellePlus4m} onChange={(v) => update("pvNacellePlus4m", v)} />
        </div>
        <div>
          Panneau SSC Taille : 2,38 x 1,06 m
        </div>
        <div>
          Ballon SSC : 80 cm diamètre, hauteur 1,8m
        </div>
      </SectionCard>

      {/* RADIATEURS */}
      <SectionCard title="Radiateurs">
        <div className="overflow-x-auto">
          {form.radiateurs.map((rad, i) => (
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

      {/* PHOTOS CHECKLIST*/}
      <SectionCard title="Photos à faire (obligatoire)">
        <h3 className="font-semibold text-lime-600 mb-2">Équipement</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 mb-4">
          <CheckboxField label="Compteur" checked={form.photoCompteur} onChange={(v) => update("photoCompteur", v)} />
          <CheckboxField label="Chaudière à remplacer" checked={form.photoChaudiere} onChange={(v) => update("photoChaudiere", v)} />
          <CheckboxField label="Emplacement du groupe extérieur" checked={form.photoGroupeExt} onChange={(v) => update("photoGroupeExt", v)} />
          <CheckboxField label="Maison vue de la rue" checked={form.photoMaison} onChange={(v) => update("photoMaison", v)} />
          <CheckboxField label="Combles" checked={form.photoCombles} onChange={(v) => update("photoCombles", v)} />
          <CheckboxField label="Système ECS" checked={form.photoECS} onChange={(v) => update("photoECS", v)} />
          <CheckboxField label="Disjoncteur" checked={form.photoDisjoncteur} onChange={(v) => update("photoDisjoncteur", v)} />
          <CheckboxField label="Tuyauterie de la chaudière" checked={form.photoTuyauterie} onChange={(v) => update("photoTuyauterie", v)} />
          <CheckboxField label="Radiateurs" checked={form.photoRadiateurs} onChange={(v) => update("photoRadiateurs", v)} />
          <CheckboxField label="Plafonds" checked={form.photoPlafonds} onChange={(v) => update("photoPlafonds", v)} />
          <CheckboxField label="Sous-sol" checked={form.photoSousSol} onChange={(v) => update("photoSousSol", v)} />
          <CheckboxField label="Tableaux électriques existants" checked={form.photoTableauElec} onChange={(v) => update("photoTableauElec", v)} />
          <CheckboxField label="Ventilation" checked={form.photoVentilation} onChange={(v) => update("photoVentilation", v)} />
          <CheckboxField label="Emplacement des unités intérieures" checked={form.photoUniteInt} onChange={(v) => update("photoUniteInt", v)} />
          <CheckboxField label="Planchers" checked={form.photoPlancher} onChange={(v) => update("photoPlancher", v)} />
          <CheckboxField label="Rez-de-chaussée" checked={form.photoRDC} onChange={(v) => update("photoRDC", v)} />
        </div>
        <h3 className="font-semibold text-lime-600 mb-2">Menuiseries et isolation extérieure</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CheckboxField label="Fenêtres" checked={form.photoFenetres} onChange={(v) => update("photoFenetres", v)} />
          <CheckboxField label="Portes-fenêtres" checked={form.photoPorteFenetre} onChange={(v) => update("photoPorteFenetre", v)} />
          <CheckboxField label="Façades extérieures" checked={form.photoFacade} onChange={(v) => update("photoFacade", v)} />
          <CheckboxField label="Porte" checked={form.photoPorte} onChange={(v) => update("photoPorte", v)} />
        </div>
      </SectionCard>

      {/* COMMENTAIRES */}
      <SectionCard title="Particularités chantier">
        <FormTextarea label="Commentaires" name="commentaires_dossier" value={form.commentaires} onChange={(v) => update("commentaires", v)} rows={6} />
      </SectionCard>
    </div>
  );
};

export default StepDossier;
