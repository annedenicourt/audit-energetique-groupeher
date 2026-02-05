import React from "react";
import { User, MapPin, Briefcase, Home, Flame, Droplets, Wind, Receipt, HandCoins, Wrench } from "lucide-react";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import SectionCard from "../SectionCard";
import { ClientData } from "@/types/formData";
import FormTextarea from "../FormTextarea";

interface StepClientProps {
  data: ClientData;
  onChange: (field: keyof ClientData, value: string) => void;
}

const situationOptions = [
  { value: "salarie", label: "Salarié(e)" },
  { value: "independant", label: "Indépendant(e)" },
  { value: "retraite", label: "Retraité(e)" },
  { value: "chomage", label: "Demandeur d'emploi" },
  { value: "etudiant", label: "Étudiant(e)" },
  { value: "autre", label: "Autre" },
];
const typeChauffageOptions = [
  { value: "electrique", label: "Électrique" },
  { value: "gaz", label: "Gaz" },
  { value: "fioul", label: "Fioul" },
  { value: "bois", label: "Bois / Granulés" },
  { value: "pompe_chaleur", label: "Pompe à chaleur" },
  { value: "autre", label: "Autre" },
];

const typeEauChaudeOptions = [
  { value: "electrique", label: "Électrique (cumulus)" },
  { value: "gaz", label: "Chauffe-eau gaz" },
  { value: "thermodynamique", label: "Thermodynamique" },
  { value: "solaire", label: "Solaire" },
  { value: "chaudiere", label: "Lié à la chaudière" },
  { value: "autre", label: "Autre" },
];

const typeAerationOptions = [
  { value: "naturelle", label: "Naturelle" },
  { value: "vmc_simple", label: "VMC simple flux" },
  { value: "vmc_double", label: "VMC double flux" },
  { value: "aucune", label: "Aucune" },
];

const StepClient: React.FC<StepClientProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Fiche découverte client
        </h2>
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
            />
            <FormInput
              label="Nom / Prénom"
              name="nom"
              value={data.nom}
              onChange={(v) => onChange("nom", v)}
              placeholder="Jean Dupont"
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
          />
          <FormInput
            label="Téléphone"
            name="telephone"
            value={data.telephone}
            onChange={(v) => onChange("telephone", v)}
            type="tel"
            placeholder="06 12 34 56 78"
            required
          />

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormInput
              label="Adresse"
              name="adresse"
              value={data.adresse}
              onChange={(v) => onChange("adresse", v)}
              placeholder="123 rue de la Paix"
              required
            />
          </div>
          <FormInput
            label="Code postal"
            name="codePostal"
            value={data.codePostal}
            onChange={(v) => onChange("codePostal", v)}
            placeholder="75000"
            required
          />
          <FormInput
            label="Ville"
            name="ville"
            value={data.ville}
            onChange={(v) => onChange("ville", v)}
            placeholder="Paris"
            required
          />

        </div>
      </SectionCard>

      {/* Situation professionnelle */}
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
            placeholder="45"
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
            placeholder="42"
            suffix="ans"
          />
        </div>
      </SectionCard>

      {/* Habitation */}
      <SectionCard title="Habitation" icon={Home}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Année de construction"
            name="anneeConstruction"
            value={data.anneeConstruction}
            onChange={(v) => onChange("anneeConstruction", v)}
            type="number"
            placeholder="1985"
          />
          <FormInput
            label="Propriétaire depuis"
            name="proprietaireDepuis"
            value={data.proprietaireDepuis}
            onChange={(v) => onChange("proprietaireDepuis", v)}
            type="number"
            placeholder="2010"
          />
          <FormInput
            label="Surface habitable"
            name="surfaceHabitable"
            value={data.surfaceHabitable}
            onChange={(v) => onChange("surfaceHabitable", v)}
            type="number"
            placeholder="120"
            suffix="m²"
          />
          <FormInput
            label="Pièces chauffées"
            name="nbrePiecesChaufees"
            value={data.nbrePiecesChaufees}
            onChange={(v) => onChange("nbrePiecesChaufees", v)}
            type="number"
            placeholder="6"
          />
          <FormInput
            label="Nombre de personnes"
            name="nbrePersonnes"
            value={data.nbrePersonnes}
            onChange={(v) => onChange("nbrePersonnes", v)}
            type="number"
            placeholder="4"
          />
          <FormInput
            label="Dont enfants"
            name="dontEnfants"
            value={data.dontEnfants}
            onChange={(v) => onChange("dontEnfants", v)}
            type="number"
            placeholder="2"
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
            placeholder="1500"
            suffix="€"
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Température jour"
              name="temperatureJour"
              value={data.temperatureJour}
              onChange={(v) => onChange("temperatureJour", v)}
              type="number"
              placeholder="20"
              suffix="°C"
            />
            <FormInput
              label="Température nuit"
              name="temperatureNuit"
              value={data.temperatureNuit}
              onChange={(v) => onChange("temperatureNuit", v)}
              type="number"
              placeholder="17"
              suffix="°C"
            />
          </div>
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
            placeholder="10"
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
            placeholder="8"
            suffix="ans"
          />
        </div>
      </SectionCard>

      {/* Facture électricité */}
      <SectionCard title="Facture électricité globale" icon={Receipt}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Total annuel"
            name="factureElecAnnuelle"
            value={data.factureElecAnnuelle}
            onChange={(v) => onChange("factureElecAnnuelle", v)}
            type="number"
            placeholder="1800"
            suffix="€/an"
          />
          <FormInput
            label="Total mensuel"
            name="factureElecMensuelle"
            value={data.factureElecMensuelle}
            onChange={(v) => onChange("factureElecMensuelle", v)}
            type="number"
            placeholder="150"
            suffix="€/mois"
          />
        </div>
      </SectionCard>

      {/* Facture énergétique globale */}
      <SectionCard title="Facture énergétique globale" icon={Receipt}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Total annuel"
            name="factureEnergieAnnuelle"
            value={data.factureEnergieAnnuelle}
            onChange={(v) => onChange("factureEnergieAnnuelle", v)}
            type="number"
            placeholder="2500"
            suffix="€/an"
          />
          <FormInput
            label="Total mensuel"
            name="factureEnergieMensuelle"
            value={data.factureEnergieMensuelle}
            onChange={(v) => onChange("factureEnergieMensuelle", v)}
            type="number"
            placeholder="210"
            suffix="€/mois"
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
            placeholder="8000"
            suffix="€"
          />
        </div>
      </SectionCard>

      {/* Aides perçues */}
      <SectionCard title="Aides perçues (5 dernières années)" icon={HandCoins}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Ma Prime Rénov'"
            name="aidesMaPrimeRenov"
            value={data.aidesMaPrimeRenov}
            onChange={(v) => onChange("aidesMaPrimeRenov", v)}
            type="number"
            placeholder="2000"
            suffix="€"
          />
          <FormInput
            label="CEE (Certificats d'économie d'énergie)"
            name="aidesCEE"
            value={data.aidesCEE}
            onChange={(v) => onChange("aidesCEE", v)}
            type="number"
            placeholder="500"
            suffix="€"
          />
          <FormInput
            label="Autres aides"
            name="aidesAutre"
            value={data.aidesAutre}
            onChange={(v) => onChange("aidesAutre", v)}
            placeholder="Aides locales, ANAH..."
          />
          <FormInput
            label="Montant total des aides"
            name="montantAides"
            value={data.montantAides}
            onChange={(v) => onChange("montantAides", v)}
            type="number"
            placeholder="2500"
            suffix="€"
          />
        </div>
      </SectionCard>
    </div>
  );
};

export default StepClient;