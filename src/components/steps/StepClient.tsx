import React from "react";
import { User, MapPin, Briefcase, Home, Flame, Droplets, Wind, Receipt, HandCoins, Wrench } from "lucide-react";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import SectionCard from "../SectionCard";
import { ClientData } from "@/types/formData";
import FormTextarea from "../FormTextarea";
import { situationOptions, typeChauffageOptions, typeEauChaudeOptions, typeAerationOptions } from "@/utils/handleForm";

interface StepClientProps {
  data: ClientData;
  onChange: (field: keyof ClientData, value: string) => void;
}
const StepClient: React.FC<StepClientProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Fiche découverte client
        </h2>
        <div className="text-xs text-red-500">* champs obligatoires</div>
      </div>

      {/* Coordonnées */}
      <SectionCard title="Infos Client" icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormInput
              label="Accompagnateur"
              name="accompagnateur"
              value={data.accompagnateur}
              onChange={(v) => onChange("accompagnateur", v)}
              placeholder="Nom de l'accompagnateur"
              className={`mb-4`}
              isMissing={data.accompagnateur === ""}
              required
            />
            <FormInput
              label="Nom / Prénom"
              name="nom"
              value={data.nom}
              onChange={(v) => onChange("nom", v)}
              placeholder="Jean Dupont"
              className="mb-4"
              isMissing={data.nom === ""}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Département"
            name="departement"
            value={data.departement}
            onChange={(v) => onChange("departement", v)}
            placeholder="75"
            className="mb-4"
          />
          <FormInput
            label="Téléphone"
            name="telephone"
            value={data.telephone}
            onChange={(v) => onChange("telephone", v)}
            type="tel"
            placeholder="06 00 00 00 00"
            className="mb-4"
            isMissing={data.telephone === ""}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <div className="md:col-span-2">
            <FormInput
              label="Adresse fiscale"
              name="adresseFiscale"
              value={data.adresseFiscale}
              onChange={(v) => onChange("adresseFiscale", v)}
              placeholder="Adresse fiscale"
              className="mb-4"
              isMissing={data.adresseFiscale === ""}
              required
            />
          </div>
          <FormInput
            label="Code postal fiscal"
            name="codePostalFiscal"
            value={data.codePostalFiscal}
            onChange={(v) => onChange("codePostalFiscal", v)}
            placeholder="Code postal fiscal"
            isMissing={data.codePostalFiscal === ""}
            required
          />
          <FormInput
            label="Ville fiscale"
            name="villeFiscale"
            value={data.villeFiscale}
            onChange={(v) => onChange("villeFiscale", v)}
            placeholder="Ville fiscale"
            isMissing={data.villeFiscale === ""}
            required
          />
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormInput
              label="Adresse du chantier"
              name="adresse"
              value={data.adresse}
              onChange={(v) => onChange("adresse", v)}
              placeholder="Adresse du chantier"
              isMissing={data.adresse === ""}
              required
            />
          </div>
          <FormInput
            label="Code postal"
            name="codePostal"
            value={data.codePostal}
            onChange={(v) => onChange("codePostal", v)}
            placeholder="Code postal chantier"
            isMissing={data.codePostal === ""}
            required
          />
          <FormInput
            label="Ville"
            name="ville"
            value={data.ville}
            onChange={(v) => onChange("ville", v)}
            placeholder="Ville chantier"
            isMissing={data.ville === ""}
            required
          />
        </div>
      </SectionCard>

      {/* Habitation */}
      <SectionCard title="Habitation" icon={Home}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormInput
            label="Année de construction"
            name="anneeConstruction"
            value={data.anneeConstruction}
            onChange={(v) => onChange("anneeConstruction", v)}
            type="number"
            placeholder="Année de construction"
            isMissing={data.anneeConstruction === ""}
            required
          />
          <FormInput
            label="Propriétaire depuis"
            name="proprietaireDepuis"
            value={data.proprietaireDepuis}
            onChange={(v) => onChange("proprietaireDepuis", v)}
            type="number"
            placeholder="Année"
          />
          <FormInput
            label="Surface habitable (à mesurer obligatoirement)"
            name="surfaceHabitable"
            value={data.surfaceHabitable}
            onChange={(v) => onChange("surfaceHabitable", v)}
            type="number"
            placeholder="Surface habitable"
            suffix="m²"
            className="col-span-2"
            isMissing={data.surfaceHabitable === ""}
            required
          />
        </div>
      </SectionCard>

      {/* Chauffage */}
      <SectionCard title="Chauffage" icon={Flame}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Type de chauffage"
            name="typeChauffage"
            value={data.typeChauffage}
            onChange={(v) => onChange("typeChauffage", v)}
            options={typeChauffageOptions}
          />
          <FormInput
            label="Âge de l'installation"
            name="ageChauffage"
            value={data.ageChauffage}
            onChange={(v) => onChange("ageChauffage", v)}
            type="number"
            placeholder="15"
            suffix="ans"
          />
          <FormInput
            label="Coût annuel estimé"
            name="coutAnnuelChauffage"
            value={data.coutAnnuelChauffage}
            onChange={(v) => onChange("coutAnnuelChauffage", v)}
            type="number"
            placeholder="0"
            suffix="€"
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Température jour"
              name="temperatureJour"
              value={data.temperatureJour || "21"}
              onChange={(v) => onChange("temperatureJour", v)}
              type="number"
              placeholder=""
              suffix="°C"
              min={"21"}
              max={"23"}
            />
            <FormInput
              label="Température nuit"
              name="temperatureNuit"
              value={data.temperatureNuit}
              onChange={(v) => onChange("temperatureNuit", v)}
              type="number"
              placeholder=""
              suffix="°C"
            />
          </div>
        </div>
      </SectionCard>

      {/* Chauffage d'appoint */}
      <SectionCard title="Chauffage d'appoint" icon={Flame}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Type de chauffage"
            name="typeChauffage"
            value={data.typeChauffageAppoint}
            onChange={(v) => onChange("typeChauffageAppoint", v)}
            options={typeChauffageOptions}
          />
          <FormInput
            label="Âge de l'installation"
            name="ageChauffage"
            value={data.ageChauffageAppoint}
            onChange={(v) => onChange("ageChauffageAppoint", v)}
            type="number"
            placeholder="Âge"
            suffix="ans"
          />
          <FormInput
            label="Coût annuel estimé"
            name="coutAnnuelChauffage"
            value={data.coutAnnuelChauffageAppoint}
            onChange={(v) => onChange("coutAnnuelChauffageAppoint", v)}
            type="number"
            placeholder="0"
            suffix="€"
          />
        </div>
      </SectionCard>

      {/* Eau chaude */}
      <SectionCard title="Eau chaude sanitaire" icon={Droplets}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Type"
            name="typeEauChaude"
            value={data.typeEauChaude}
            onChange={(v) => onChange("typeEauChaude", v)}
            options={typeEauChaudeOptions}
          />
          <FormInput
            label="Âge de l'installation"
            name="ageEauChaude"
            value={data.ageEauChaude}
            onChange={(v) => onChange("ageEauChaude", v)}
            type="number"
            placeholder="0"
            suffix="ans"
          />
        </div>
      </SectionCard>

      {/* Aération */}
      <SectionCard title="Aération / Ventilation" icon={Wind}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Type"
            name="typeAeration"
            value={data.typeAeration}
            onChange={(v) => onChange("typeAeration", v)}
            options={typeAerationOptions}
          />
          <FormInput
            label="Âge de l'installation"
            name="ageAeration"
            value={data.ageAeration}
            onChange={(v) => onChange("ageAeration", v)}
            type="number"
            placeholder="0"
            suffix="ans"
          />
        </div>
      </SectionCard>

      {/* Facture électricité */}
      <SectionCard title="Facture électricité globale" icon={Receipt}>
        <div className="">
          <FormInput
            label="Total annuel"
            name="factureElecAnnuelle"
            value={data.factureElecAnnuelle}
            onChange={(v) => onChange("factureElecAnnuelle", v)}
            type="number"
            placeholder="0"
            suffix="€/an"
          />
        </div>
      </SectionCard>

      {/* Facture énergétique globale */}
      <SectionCard title="Facture énergétique globale" icon={Receipt}>
        <div className="">
          <FormInput
            label="Total annuel"
            name="factureEnergieAnnuelle"
            value={data.factureEnergieAnnuelle}
            onChange={(v) => onChange("factureEnergieAnnuelle", v)}
            type="number"
            placeholder="0"
            suffix="€/an"
          />
        </div>
      </SectionCard>

      {/* Travaux réalisés */}
      <SectionCard title="Travaux (5 dernières années)" icon={Wrench}>
        <div className="space-y-4">
          <FormTextarea
            label="Travaux réalisés"
            name="travauxRealises"
            value={data.travauxRealises}
            onChange={(v) => onChange("travauxRealises", v)}
            placeholder="Isolation des combles, remplacement des fenêtres..."
            rows={3}
          />
          <FormInput
            label="Montant total des travaux"
            name="montantTravaux"
            value={data.montantTravaux}
            onChange={(v) => onChange("montantTravaux", v)}
            type="number"
            placeholder="0"
            suffix="€"
          />
        </div>
      </SectionCard>

      {/* Aides perçues */}
      <SectionCard title="Aides perçues (5 dernières années)" icon={HandCoins}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormInput
              label="Ma Prime Rénov'"
              name="aidesMaPrimeRenov"
              value={data.aidesMaPrimeRenov}
              onChange={(v) => onChange("aidesMaPrimeRenov", v)}
              type="number"
              placeholder=""
              suffix="€"
              min={"0"}
              isMissing={data.aidesMaPrimeRenov === ""}
              required
            />
            <FormInput
              label="CEE (Certificats d'économie d'énergie)"
              name="aidesCEE"
              value={data.aidesCEE}
              onChange={(v) => onChange("aidesCEE", v)}
              type="number"
              placeholder=""
              suffix="€"
              className="my-4"
              min={"0"}
            />
            <FormInput
              label="Autres aides"
              name="aidesAutre"
              value={data.aidesAutre}
              onChange={(v) => onChange("aidesAutre", v)}
              type="number"
              placeholder="Aides locales, ANAH..."
              suffix="€"
              min={"0"}
            />
          </div>
          <div>
            <FormInput
              label="Montant total des aides"
              name="montantAides"
              value={data.montantAides}
              //onChange={(v) => onChange("montantAides", v)}
              type="number"
              placeholder="0"
              suffix="€"
              readonly={true}
            />
            <FormInput
              label="Plafond maximum Ma Prime Rénov (sur 5 ans)'"
              name="plafondMaPrimeRenov"
              value={"20000"}
              type="number"
              placeholder="2000"
              suffix="€"
              readonly={true}
              className="my-4"
            />
            <FormInput
              label="Aide disponible Ma Prime Rénov'"
              name="aidesMaPrimeRenov"
              value={data.dispoMaPrimeRenov}
              onChange={(v) => onChange("aidesMaPrimeRenov", v)}
              type="number"
              placeholder="0"
              suffix="€"
              readonly={true}
            />
          </div>
        </div>
      </SectionCard>

      {/* Situation du foyer */}
      <SectionCard title="Situation du foyer" icon={Briefcase}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Situation conjoint 1"
            name="situationConjoint1"
            value={data.situationConjoint1}
            onChange={(v) => onChange("situationConjoint1", v)}
            options={situationOptions}
          />
          <FormInput
            label="Âge conjoint 1"
            name="ageConjoint1"
            value={data.ageConjoint1}
            onChange={(v) => onChange("ageConjoint1", v)}
            type="number"
            placeholder="Âge"
            suffix="ans"
          />
          <FormSelect
            label="Situation conjoint 2"
            name="situationConjoint2"
            value={data.situationConjoint2}
            onChange={(v) => onChange("situationConjoint2", v)}
            options={situationOptions}
          />
          <FormInput
            label="Âge conjoint 2"
            name="ageConjoint2"
            value={data.ageConjoint2}
            onChange={(v) => onChange("ageConjoint2", v)}
            type="number"
            placeholder="Âge"
            suffix="ans"
          />
          <FormInput
            label="Nombre de personnes"
            name="nbrePersonnes"
            value={data.nbrePersonnes}
            onChange={(v) => onChange("nbrePersonnes", v)}
            type="number"
            placeholder="0"
          />
          <FormInput
            label="Dont enfants à charge"
            name="dontEnfants"
            value={data.dontEnfants}
            onChange={(v) => onChange("dontEnfants", v)}
            type="number"
            placeholder="0"
          />
        </div>
      </SectionCard>
    </div>
  );
};

export default StepClient;