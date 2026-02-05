 import React from "react";
 import { Home, Flame, Droplets, Wind } from "lucide-react";
 import FormInput from "../FormInput";
 import FormSelect from "../FormSelect";
 import SectionCard from "../SectionCard";
 import { HabitationData } from "@/types/formData";
 
 interface StepHabitationProps {
   data: HabitationData;
   onChange: (field: keyof HabitationData, value: string) => void;
 }
 
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
 
 const StepHabitation: React.FC<StepHabitationProps> = ({ data, onChange }) => {
   return (
     <div className="space-y-6">
       {/* Page title */}
       <div className="mb-8">
         <h2 className="text-2xl font-display font-bold text-foreground mb-2">
           Informations sur l'habitation
         </h2>
         <p className="text-muted-foreground">
           Caractéristiques du logement et des équipements
         </p>
       </div>
 
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
     </div>
   );
 };
 
 export default StepHabitation;