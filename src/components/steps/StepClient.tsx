 import React from "react";
 import { User, MapPin, Briefcase } from "lucide-react";
 import FormInput from "../FormInput";
 import FormSelect from "../FormSelect";
 import SectionCard from "../SectionCard";
 import { ClientData } from "@/types/formData";
 
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
 
 const StepClient: React.FC<StepClientProps> = ({ data, onChange }) => {
   return (
     <div className="space-y-6">
       {/* Page title */}
       <div className="mb-8">
         <h2 className="text-2xl font-display font-bold text-foreground mb-2">
           Fiche découverte client
         </h2>
         <p className="text-muted-foreground">
           Informations personnelles et coordonnées du client
         </p>
       </div>
 
       {/* Coordonnées */}
       <SectionCard title="Coordonnées" icon={User}>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="md:col-span-2">
             <FormInput
               label="Nom / Prénom"
               name="nom"
               value={data.nom}
               onChange={(v) => onChange("nom", v)}
               placeholder="Jean Dupont"
               required
             />
           </div>
           <FormInput
             label="Téléphone"
             name="telephone"
             value={data.telephone}
             onChange={(v) => onChange("telephone", v)}
             type="tel"
             placeholder="06 12 34 56 78"
             required
           />
           <FormInput
             label="Accompagnateur"
             name="accompagnateur"
             value={data.accompagnateur}
             onChange={(v) => onChange("accompagnateur", v)}
             placeholder="Nom de l'accompagnateur"
           />
         </div>
       </SectionCard>
 
       {/* Adresse */}
       <SectionCard title="Adresse" icon={MapPin}>
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
           <FormInput
             label="Département"
             name="departement"
             value={data.departement}
             onChange={(v) => onChange("departement", v)}
             placeholder="75"
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
     </div>
   );
 };
 
 export default StepClient;