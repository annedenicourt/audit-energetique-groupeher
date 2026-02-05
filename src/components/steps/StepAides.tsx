 import React from "react";
 import { Wallet, Users, Calculator } from "lucide-react";
 import FormInput from "../FormInput";
 import FormSelect from "../FormSelect";
 import SectionCard from "../SectionCard";
 import { AidesData } from "@/types/formData";
 
 interface StepAidesProps {
   data: AidesData;
   onChange: (field: keyof AidesData, value: string) => void;
 }
 
 const categorieOptions = [
   { value: "tres_modestes", label: "Très modestes (bleu)" },
   { value: "modestes", label: "Modestes (jaune)" },
   { value: "intermediaires", label: "Intermédiaires (violet)" },
   { value: "superieurs", label: "Supérieurs (rose)" },
 ];
 
 const nbrePersonnesOptions = [
   { value: "1", label: "1 personne" },
   { value: "2", label: "2 personnes" },
   { value: "3", label: "3 personnes" },
   { value: "4", label: "4 personnes" },
   { value: "5", label: "5 personnes" },
   { value: "6", label: "6 personnes ou plus" },
 ];
 
 // Tableau des plafonds de ressources (à titre indicatif)
 const plafondsData = [
   { personnes: "1", tresModestes: "17 363 €", modestes: "22 259 €", intermediaires: "31 185 €" },
   { personnes: "2", tresModestes: "25 393 €", modestes: "32 553 €", intermediaires: "45 842 €" },
   { personnes: "3", tresModestes: "30 540 €", modestes: "39 148 €", intermediaires: "55 196 €" },
   { personnes: "4", tresModestes: "35 676 €", modestes: "45 735 €", intermediaires: "64 550 €" },
   { personnes: "5", tresModestes: "40 835 €", modestes: "52 348 €", intermediaires: "73 907 €" },
 ];
 
 const StepAides: React.FC<StepAidesProps> = ({ data, onChange }) => {
   return (
     <div className="space-y-6">
       {/* Page title */}
       <div className="mb-8">
         <h2 className="text-2xl font-display font-bold text-foreground mb-2">
           Calcul des aides
         </h2>
         <p className="text-muted-foreground">
           MaPrimeRénov' & CEE - Estimation des aides disponibles
         </p>
       </div>
 
       {/* Informations foyer */}
       <SectionCard title="Informations du foyer" icon={Users}>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <FormSelect
             label="Nombre de personnes dans le foyer"
             name="nbrePersonnesFoyer"
             value={data.nbrePersonnesFoyer}
             onChange={(v) => onChange("nbrePersonnesFoyer", v)}
             options={nbrePersonnesOptions}
           />
           <FormInput
             label="Dernier RFR (Revenu Fiscal de Référence)"
             name="dernierRFR"
             value={data.dernierRFR}
             onChange={(v) => onChange("dernierRFR", v)}
             type="number"
             placeholder="35000"
             suffix="€"
           />
           <FormSelect
             label="Catégorie de revenus"
             name="categorieRevenus"
             value={data.categorieRevenus}
             onChange={(v) => onChange("categorieRevenus", v)}
             options={categorieOptions}
           />
         </div>
       </SectionCard>
 
       {/* Tableau des plafonds */}
       <SectionCard title="Plafonds de ressources (référence MaPrimeRénov')" icon={Calculator}>
         <div className="overflow-x-auto">
           <table className="w-full text-sm">
             <thead>
               <tr className="border-b border-border">
                 <th className="text-left py-3 px-4 font-semibold text-foreground">Personnes</th>
                 <th className="text-left py-3 px-4 font-semibold text-foreground">Très modestes</th>
                 <th className="text-left py-3 px-4 font-semibold text-foreground">Modestes</th>
                 <th className="text-left py-3 px-4 font-semibold text-foreground">Intermédiaires</th>
               </tr>
             </thead>
             <tbody>
               {plafondsData.map((row) => (
                 <tr key={row.personnes} className="border-b border-border/50 hover:bg-muted/50">
                   <td className="py-3 px-4 font-medium">{row.personnes}</td>
                   <td className="py-3 px-4 text-muted-foreground">≤ {row.tresModestes}</td>
                   <td className="py-3 px-4 text-muted-foreground">≤ {row.modestes}</td>
                   <td className="py-3 px-4 text-muted-foreground">≤ {row.intermediaires}</td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
         <p className="text-xs text-muted-foreground mt-3">
           Par personne supplémentaire : + 5 151 € (très modestes), + 6 598 € (modestes), + 9 357 € (intermédiaires)
         </p>
       </SectionCard>
 
       {/* Synthèse financière */}
       <SectionCard title="Synthèse financière sur 10 ans" icon={Wallet}>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <FormInput
             label="Coût total de l'installation"
             name="coutTotalInstallation"
             value={data.coutTotalInstallation}
             onChange={(v) => onChange("coutTotalInstallation", v)}
             type="number"
             placeholder="15000"
             suffix="€"
           />
           <FormInput
             label="Prime CEE déduite (sous conditions)"
             name="primeCEE"
             value={data.primeCEE}
             onChange={(v) => onChange("primeCEE", v)}
             type="number"
             placeholder="2500"
             suffix="€"
           />
           <FormInput
             label="MaPrimeRénov' (non déduite)"
             name="maPrimeRenov"
             value={data.maPrimeRenov}
             onChange={(v) => onChange("maPrimeRenov", v)}
             type="number"
             placeholder="4000"
             suffix="€"
           />
           <FormInput
             label="Reste à charger après MaPrimeRénov'"
             name="resteACharger"
             value={data.resteACharger}
             onChange={(v) => onChange("resteACharger", v)}
             type="number"
             placeholder="8500"
             suffix="€"
           />
           <FormInput
             label="Économies estimées sur 10 ans"
             name="economiesSur10Ans"
             value={data.economiesSur10Ans}
             onChange={(v) => onChange("economiesSur10Ans", v)}
             type="number"
             placeholder="12000"
             suffix="€"
           />
           <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
             <label className="form-label text-primary">Gain sur 10 ans</label>
             <FormInput
               label=""
               name="gainSur10Ans"
               value={data.gainSur10Ans}
               onChange={(v) => onChange("gainSur10Ans", v)}
               type="number"
               placeholder="3500"
               suffix="€"
             />
           </div>
         </div>
         <p className="text-xs text-muted-foreground mt-4">
           Hypothèse : augmentation moyenne estimée à 6% par an sur une durée de 10 ans
         </p>
       </SectionCard>
 
       {/* Note d'information */}
       <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
         <p className="text-sm text-foreground">
           <strong>Note :</strong> MaPrimeRénov' est présentée à titre indicatif et n'est pas déduite du coût du projet. 
           La prime CEE peut être déduite sous conditions d'éligibilité.
         </p>
       </div>
     </div>
   );
 };
 
 export default StepAides;