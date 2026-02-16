import React, { useState, useEffect, useCallback } from "react";
import { FileCheck, Plus, Trash2 } from "lucide-react";
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

const STORAGE_KEY = "dossier_form";

const OUI_NON = [
  { value: "Oui", label: "Oui" },
  { value: "Non", label: "Non" },
];

const MATERIAUX_RADIATEUR = [
  { value: "Acier", label: "Acier" },
  { value: "Fonte", label: "Fonte" },
  { value: "Fonte Alu", label: "Fonte Alu" },
  { value: "Fonte Tub", label: "Fonte Tub" },
];

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

  return (
    <div className="space-y-6">
      {/* 1) DOSSIER DE LIAISON */}
      <SectionCard title="Dossier de liaison" icon={FileCheck}>
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

      {/* 2) RÈGLEMENT */}
      <SectionCard title="Règlement">
        <div className="flex flex-wrap gap-6">
          <CheckboxField label="Chèque" checked={form.reglementCheque} onChange={(v) => update("reglementCheque", v)} />
          <CheckboxField label="Financement" checked={form.reglementFinancement} onChange={(v) => update("reglementFinancement", v)} />
          <CheckboxField label="PTZ" checked={form.reglementPTZ} onChange={(v) => update("reglementPTZ", v)} />
        </div>
      </SectionCard>

      {/* 3) DOSSIER DE PRIME */}
      <SectionCard title="Dossier de prime">
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Propriétaire occupant" checked={form.proprietaireOccupant} onChange={(v) => update("proprietaireOccupant", v)} />
          <CheckboxField label="Propriétaire bailleur" checked={form.proprietaireBailleur} onChange={(v) => update("proprietaireBailleur", v)} />
          <CheckboxField label="Résid. secondaire" checked={form.residSecondaire} onChange={(v) => update("residSecondaire", v)} />
          <CheckboxField label="SCI" checked={form.sci} onChange={(v) => update("sci", v)} />
        </div>

        <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Pièces / checklist</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 mb-4">
          <CheckboxField label="Devis non signé" checked={form.devisNonSigne} onChange={(v) => update("devisNonSigne", v)} />
          <CheckboxField label="Devis signé" checked={form.devisSigne} onChange={(v) => update("devisSigne", v)} />
          <CheckboxField label="Carte d'identité" checked={form.carteIdentite} onChange={(v) => update("carteIdentite", v)} />
          <CheckboxField label="2 derniers avis d'impôts" checked={form.deuxDerniersAvisImpots} onChange={(v) => update("deuxDerniersAvisImpots", v)} />
          <CheckboxField label="Taxe foncière ou acte notarié" checked={form.taxeFonciereActeNotarie} onChange={(v) => update("taxeFonciereActeNotarie", v)} />
          <CheckboxField label="Mandat MaPrimeRénov / ID numérique" checked={form.mandatMaPrimeRenov} onChange={(v) => update("mandatMaPrimeRenov", v)} />
          <CheckboxField label="RIB" checked={form.rib} onChange={(v) => update("rib", v)} />
          <CheckboxField label="Attestation fioul" checked={form.attestationFioul} onChange={(v) => update("attestationFioul", v)} />
          <CheckboxField label="Attestation indivisionnaire" checked={form.attestationIndivisionnaire} onChange={(v) => update("attestationIndivisionnaire", v)} />
          <CheckboxField label="Attestation propriétaire bailleur" checked={form.attestationProprietaireBailleur} onChange={(v) => update("attestationProprietaireBailleur", v)} />
          <CheckboxField label="Note de dimensionnement / RevCIt" checked={form.noteDimensionnementRevolt} onChange={(v) => update("noteDimensionnementRevolt", v)} />
        </div>

        <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Prime EDF</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <FormInput label="Montant Prime EDF" name="montantPrimeEDF" value={form.montantPrimeEDF} onChange={(v) => update("montantPrimeEDF", v)} suffix="€" />
          <FormInput label="Mail" name="mailPrimeEDF" value={form.mailPrimeEDF} onChange={(v) => update("mailPrimeEDF", v)} type="email" />
          <FormInput label="MDP" name="mdpPrimeEDF" value={form.mdpPrimeEDF} onChange={(v) => update("mdpPrimeEDF", v)} />
        </div>

        <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Prime Rénov</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput label="Montant Prime Rénov" name="montantPrimeRenov" value={form.montantPrimeRenov} onChange={(v) => update("montantPrimeRenov", v)} suffix="€" />
          <FormInput label="Gmail créé" name="gmailCree" value={form.gmailCree} onChange={(v) => update("gmailCree", v)} />
          <FormInput label="MDP" name="mdpPrimeRenov" value={form.mdpPrimeRenov} onChange={(v) => update("mdpPrimeRenov", v)} />
        </div>
      </SectionCard>

      {/* 4) DOSSIER DE FINANCEMENT */}
      <SectionCard title="Dossier de financement">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
          <CheckboxField label="Justificatif de domicile < 3 mois" checked={form.justificatifDomicile} onChange={(v) => update("justificatifDomicile", v)} />
          <CheckboxField label="Dernier(s) bulletin(s) de salaires + contrat" checked={form.bulletinsSalaires} onChange={(v) => update("bulletinsSalaires", v)} />
          <CheckboxField label="Bilan (entrepreneur)" checked={form.bilanEntrepreneur} onChange={(v) => update("bilanEntrepreneur", v)} />
        </div>
      </SectionCard>

      {/* 5) MAISON */}
      <SectionCard title="Maison">
        <FormInput label="Année de construction" name="anneeConstruction_d" value={form.anneeConstruction} onChange={(v) => update("anneeConstruction", v)} />

        <h4 className="font-semibold text-sm mt-4 mb-2 text-muted-foreground">Structure</h4>
        <div className="flex flex-wrap gap-6 mb-2">
          <CheckboxField label="Plein pied" checked={form.plainPied} onChange={(v) => update("plainPied", v)} />
          <CheckboxField label="Étages" checked={form.etages} onChange={(v) => update("etages", v)} />
          <CheckboxField label="Sous-sol" checked={form.sousSol} onChange={(v) => update("sousSol", v)} />
          <CheckboxField label="Vide sanitaire" checked={form.videSanitaire} onChange={(v) => update("videSanitaire", v)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {form.etages && <FormInput label="Nombre d'étages" name="nbEtages" value={form.nbEtages} onChange={(v) => update("nbEtages", v)} />}
          {form.videSanitaire && <FormInput label="Accessible" name="videSanitaireAccessible" value={form.videSanitaireAccessible} onChange={(v) => update("videSanitaireAccessible", v)} />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormInput label="Type de mur" name="typeMur_d" value={form.typeMur} onChange={(v) => update("typeMur", v)} />
          <FormInput label="Épaisseur mur" name="epaisseurMur_d" value={form.epaisseurMur} onChange={(v) => update("epaisseurMur", v)} />
        </div>

        <h4 className="font-semibold text-sm mt-4 mb-2 text-muted-foreground">Combles</h4>
        <div className="flex flex-wrap gap-6 mb-2">
          <CheckboxField label="Comble perdu" checked={form.comblePerdu} onChange={(v) => update("comblePerdu", v)} />
          <CheckboxField label="Comble aménagé (sous rampant)" checked={form.combleAmenage} onChange={(v) => update("combleAmenage", v)} />
        </div>
        {form.comblePerdu && (
          <div className="flex flex-wrap gap-6 mb-2 ml-4">
            <CheckboxField label="Accessible" checked={form.comblePerduAccessible} onChange={(v) => update("comblePerduAccessible", v)} />
            <CheckboxField label="Trappe" checked={form.comblePerduTrappe} onChange={(v) => update("comblePerduTrappe", v)} />
            <CheckboxField label="Toit" checked={form.comblePerduToit} onChange={(v) => update("comblePerduToit", v)} />
            <CheckboxField label="Autre" checked={form.comblePerduAutre} onChange={(v) => update("comblePerduAutre", v)} />
            {form.comblePerduAutre && (
              <FormInput label="" name="comblePerduAutreTexte" value={form.comblePerduAutreTexte} onChange={(v) => update("comblePerduAutreTexte", v)} placeholder="Précisez" />
            )}
          </div>
        )}

        <h4 className="font-semibold text-sm mt-4 mb-2 text-muted-foreground">Type de plancher</h4>
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Bois" checked={form.plancherBois} onChange={(v) => update("plancherBois", v)} />
          <CheckboxField label="Placo" checked={form.plancherPlaco} onChange={(v) => update("plancherPlaco", v)} />
          <CheckboxField label="Hourdis" checked={form.plancherHourdis} onChange={(v) => update("plancherHourdis", v)} />
        </div>

        <h4 className="font-semibold text-sm mt-4 mb-2 text-muted-foreground">Chauffage actuel</h4>
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

        <h4 className="font-semibold text-sm mt-4 mb-2 text-muted-foreground">Type de radiateurs</h4>
        <div className="flex flex-wrap gap-6 mb-2">
          <CheckboxField label="Radiat. Acier" checked={form.radiateurAcier} onChange={(v) => update("radiateurAcier", v)} />
          <CheckboxField label="Radiat. Alu" checked={form.radiateurAlu} onChange={(v) => update("radiateurAlu", v)} />
          <CheckboxField label="Radiat. Fonte" checked={form.radiateurFonte} onChange={(v) => update("radiateurFonte", v)} />
          <CheckboxField label="Plancher chauffant" checked={form.plancherChauffant} onChange={(v) => update("plancherChauffant", v)} />
        </div>
        <FormInput label="Nombre" name="nombreRadiateurs" value={form.nombreRadiateurs} onChange={(v) => update("nombreRadiateurs", v)} />

        <h4 className="font-semibold text-sm mt-4 mb-2 text-muted-foreground">Thermostats</h4>
        <div className="flex flex-wrap gap-6">
          <CheckboxField label="Kit bi-zone" checked={form.thermostatBiZone} onChange={(v) => update("thermostatBiZone", v)} />
          <CheckboxField label="Thermostat filaire" checked={form.thermostatFilaire} onChange={(v) => update("thermostatFilaire", v)} />
          <CheckboxField label="Thermostat non filaire" checked={form.thermostatNonFilaire} onChange={(v) => update("thermostatNonFilaire", v)} />
          <CheckboxField label="Pas de thermostat" checked={form.pasDeThermostat} onChange={(v) => update("pasDeThermostat", v)} />
        </div>
      </SectionCard>

      {/* 6) ÉLECTRICITÉ */}
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
          <FormInput label="Puissance kVA" name="puissanceKva" value={form.puissanceKva} onChange={(v) => update("puissanceKva", v)} suffix="kVA" />
        </div>
      </SectionCard>

      {/* 7) PAC AIR EAU */}
      <SectionCard title="PAC Air Eau">
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

        <h4 className="font-semibold text-sm mt-4 mb-2 text-muted-foreground">Passage des liaisons</h4>
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

        <h4 className="font-semibold text-sm mt-4 mb-2 text-muted-foreground">Type de pose</h4>
        <div className="flex flex-wrap gap-6 mb-2">
          <CheckboxField label="Sol" checked={form.typePosePacSol} onChange={(v) => update("typePosePacSol", v)} />
          <CheckboxField label="Mur" checked={form.typePosePacMur} onChange={(v) => update("typePosePacMur", v)} />
        </div>
        <FormInput label="Hauteur local" name="hauteurLocalPac" value={form.hauteurLocalPac} onChange={(v) => update("hauteurLocalPac", v)} />
        <div className="flex flex-wrap gap-6 mt-2">
          <CheckboxField label="Levé groupe (-5m)" checked={form.leveGroupePac} onChange={(v) => update("leveGroupePac", v)} />
          <CheckboxField label="Nacelle (+5m)" checked={form.nacellePac} onChange={(v) => update("nacellePac", v)} />
        </div>
      </SectionCard>

      {/* 8) BTD */}
      <SectionCard title="BTD">
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Monobloc" checked={form.btdMonobloc} onChange={(v) => update("btdMonobloc", v)} />
          <CheckboxField label="Bi-bloc" checked={form.btdBiBloc} onChange={(v) => update("btdBiBloc", v)} />
        </div>

        <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Emplacement ballon</h4>
        <div className="flex flex-wrap gap-6 mb-2">
          <CheckboxField label="Local tech." checked={form.btdEmplacementLocalTech} onChange={(v) => update("btdEmplacementLocalTech", v)} />
          <CheckboxField label="Garage" checked={form.btdEmplacementGarage} onChange={(v) => update("btdEmplacementGarage", v)} />
          <CheckboxField label="Cellier" checked={form.btdEmplacementCellier} onChange={(v) => update("btdEmplacementCellier", v)} />
          <CheckboxField label="Autre" checked={form.btdEmplacementAutre} onChange={(v) => update("btdEmplacementAutre", v)} />
        </div>
        {form.btdEmplacementAutre && (
          <FormInput label="" name="btdEmplacementAutreTexte" value={form.btdEmplacementAutreTexte} onChange={(v) => update("btdEmplacementAutreTexte", v)} placeholder="Précisez" />
        )}

        <h4 className="font-semibold text-sm mt-4 mb-2 text-muted-foreground">Emplacement groupe ext.</h4>
        <div className="flex flex-wrap gap-6 mb-2">
          <CheckboxField label="Sol" checked={form.btdGroupeExtSol} onChange={(v) => update("btdGroupeExtSol", v)} />
          <CheckboxField label="Mur" checked={form.btdGroupeExtMur} onChange={(v) => update("btdGroupeExtMur", v)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput label="Hauteur" name="btdGroupeExtHauteur" value={form.btdGroupeExtHauteur} onChange={(v) => update("btdGroupeExtHauteur", v)} />
          <FormSelect label="Dalle existe" name="btdDalleExiste" value={form.btdDalleExiste} onChange={(v) => update("btdDalleExiste", v)} options={OUI_NON} />
          <FormInput label="Accessible" name="btdAccessible" value={form.btdAccessible} onChange={(v) => update("btdAccessible", v)} />
        </div>
      </SectionCard>

      {/* 9) PAC AIR AIR */}
      <SectionCard title="PAC Air Air">
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Mono-split" checked={form.pacAirAirMonoSplit} onChange={(v) => update("pacAirAirMonoSplit", v)} />
          <CheckboxField label="Multi-split" checked={form.pacAirAirMultiSplit} onChange={(v) => update("pacAirAirMultiSplit", v)} />
          <CheckboxField label="Console" checked={form.pacAirAirConsole} onChange={(v) => update("pacAirAirConsole", v)} />
          <CheckboxField label="Gainable" checked={form.pacAirAirGainable} onChange={(v) => update("pacAirAirGainable", v)} />
        </div>

        <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Splits</h4>
        {form.splits.map((split, i) => (
          <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 p-3 rounded-md border border-border">
            <FormInput label={`Split ${i + 1} – Pièce`} name={`split_${i}_piece`} value={split.nomPiece} onChange={(v) => updateSplit(i, "nomPiece", v)} />
            <FormInput label="Puissance" name={`split_${i}_kw`} value={split.puissanceKw} onChange={(v) => updateSplit(i, "puissanceKw", v)} suffix="kW" />
            <FormSelect label="Dos à dos" name={`split_${i}_dos`} value={split.dosADos} onChange={(v) => updateSplit(i, "dosADos", v)} options={OUI_NON} />
            <FormSelect label="Pompe de relevage" name={`split_${i}_pompe`} value={split.pompeRelevage} onChange={(v) => updateSplit(i, "pompeRelevage", v)} options={OUI_NON} />
          </div>
        ))}

        <h4 className="font-semibold text-sm mt-4 mb-2 text-muted-foreground">Emplacement groupe ext.</h4>
        <div className="flex flex-wrap gap-6 mb-2">
          <CheckboxField label="Sol" checked={form.pacAirAirGroupeExtSol} onChange={(v) => update("pacAirAirGroupeExtSol", v)} />
          <CheckboxField label="Mur" checked={form.pacAirAirGroupeExtMur} onChange={(v) => update("pacAirAirGroupeExtMur", v)} />
          <CheckboxField label="Levé groupe (-5m)" checked={form.pacAirAirLeveGroupe} onChange={(v) => update("pacAirAirLeveGroupe", v)} />
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

      {/* 10) PV ou SSC */}
      <SectionCard title="PV ou SSC">
        <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Type de pose</h4>
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Au sol" checked={form.pvTypePoseAuSol} onChange={(v) => update("pvTypePoseAuSol", v)} />
          <CheckboxField label="Toiture" checked={form.pvTypePoseToiture} onChange={(v) => update("pvTypePoseToiture", v)} />
          <CheckboxField label="Murale SSC" checked={form.pvTypePoseMuraleSsc} onChange={(v) => update("pvTypePoseMuraleSsc", v)} />
        </div>

        <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Format de pose</h4>
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Portrait" checked={form.pvFormatPortrait} onChange={(v) => update("pvFormatPortrait", v)} />
          <CheckboxField label="Paysage" checked={form.pvFormatPaysage} onChange={(v) => update("pvFormatPaysage", v)} />
        </div>

        <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Type de toiture</h4>
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Bac acier" checked={form.pvToitureBacAcier} onChange={(v) => update("pvToitureBacAcier", v)} />
          <CheckboxField label="Éventé" checked={form.pvToitureEvente} onChange={(v) => update("pvToitureEvente", v)} />
          <CheckboxField label="Tuile" checked={form.pvToitureTuile} onChange={(v) => update("pvToitureTuile", v)} />
        </div>

        <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Raccordement (si compteur ext.)</h4>
        <div className="flex flex-wrap gap-6 mb-4">
          <CheckboxField label="Enterré" checked={form.pvRaccordementEnterre} onChange={(v) => update("pvRaccordementEnterre", v)} />
          <CheckboxField label="Aérien" checked={form.pvRaccordementAerien} onChange={(v) => update("pvRaccordementAerien", v)} />
        </div>

        <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Documents</h4>
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
        <FormInput label="SSC Taille" name="pvSscTaille" value={form.pvSscTaille} onChange={(v) => update("pvSscTaille", v)} />
      </SectionCard>

      {/* 11) COMMENTAIRES */}
      <SectionCard title="Commentaires">
        <FormTextarea label="Commentaires" name="commentaires_dossier" value={form.commentaires} onChange={(v) => update("commentaires", v)} rows={6} />
      </SectionCard>

      {/* 12) RADIATEURS */}
      <SectionCard title="Radiateurs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2 font-medium">#</th>
                <th className="text-left p-2 font-medium">Matériau</th>
                <th className="text-left p-2 font-medium">H</th>
                <th className="text-left p-2 font-medium">L</th>
                <th className="text-left p-2 font-medium">EP</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {form.radiateurs.map((rad, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="p-2 text-muted-foreground">{i + 1}</td>
                  <td className="p-2">
                    <select
                      value={rad.materiau}
                      onChange={(e) => updateRadiateur(i, "materiau", e.target.value)}
                      className="form-select text-sm py-1"
                    >
                      <option value="">—</option>
                      {MATERIAUX_RADIATEUR.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <input className="form-input text-sm py-1 w-20" value={rad.hauteur} onChange={(e) => updateRadiateur(i, "hauteur", e.target.value)} placeholder="cm" />
                  </td>
                  <td className="p-2">
                    <input className="form-input text-sm py-1 w-20" value={rad.largeur} onChange={(e) => updateRadiateur(i, "largeur", e.target.value)} placeholder="cm" />
                  </td>
                  <td className="p-2">
                    <input className="form-input text-sm py-1 w-20" value={rad.epaisseur} onChange={(e) => updateRadiateur(i, "epaisseur", e.target.value)} placeholder="cm" />
                  </td>
                  <td className="p-2">
                    <button type="button" onClick={() => removeRadiateur(i)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={addRadiateur} className="mt-3 flex items-center gap-1 text-sm text-primary hover:underline">
          <Plus className="w-4 h-4" /> Ajouter un radiateur
        </button>
      </SectionCard>
    </div>
  );
};

export default StepDossier;
