 import React from "react";
 import { Receipt, Wrench, HandCoins } from "lucide-react";
 import FormInput from "../FormInput";
 import FormTextarea from "../FormTextarea";
 import SectionCard from "../SectionCard";
 import { FacturesData } from "@/types/formData";
 
 interface StepFacturesProps {
   data: FacturesData;
   onChange: (field: keyof FacturesData, value: string) => void;
 }
 
 const StepFactures: React.FC<StepFacturesProps> = ({ data, onChange }) => {
   return (
     <div className="space-y-6">
       {/* Page title */}
       <div className="mb-8">
         <h2 className="text-2xl font-display font-bold text-foreground mb-2">
           Factures & Travaux
         </h2>
         <p className="text-muted-foreground">
           Dépenses énergétiques et travaux réalisés
         </p>
       </div>
 
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
 
 export default StepFactures;