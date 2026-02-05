 import React from "react";
 import { Banknote, LineChart, CheckCircle2 } from "lucide-react";
 import FormInput from "../FormInput";
 import SectionCard from "../SectionCard";
 import { FinancementData } from "@/types/formData";
 
 interface StepFinancementProps {
   data: FinancementData;
   onChange: (field: keyof FinancementData, value: string) => void;
 }
 
 const StepFinancement: React.FC<StepFinancementProps> = ({ data, onChange }) => {
   return (
     <div className="space-y-6">
       {/* Page title */}
       <div className="mb-8">
         <h2 className="text-2xl font-display font-bold text-foreground mb-2">
           Écofinancement & Synthèse
         </h2>
         <p className="text-muted-foreground">
           Transfert de charge et projection des économies
         </p>
       </div>
 
       {/* Projection des coûts - AVANT travaux */}
       <SectionCard title="Projection d'évolution des coûts (AVANT travaux)" icon={LineChart}>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <FormInput
             label="Facture aujourd'hui"
             name="factureAujourdhui"
             value={data.factureAujourdhui}
             onChange={(v) => onChange("factureAujourdhui", v)}
             type="number"
             placeholder="2500"
             suffix="€/an"
           />
           <FormInput
             label="Estimation + 5 ans"
             name="facture5Ans"
             value={data.facture5Ans}
             onChange={(v) => onChange("facture5Ans", v)}
             type="number"
             placeholder="3350"
             suffix="€/an"
           />
           <FormInput
             label="Estimation + 10 ans"
             name="facture10Ans"
             value={data.facture10Ans}
             onChange={(v) => onChange("facture10Ans", v)}
             type="number"
             placeholder="4480"
             suffix="€/an"
           />
         </div>
         <p className="text-xs text-muted-foreground mt-3">
           Hypothèse : augmentation moyenne estimée à 6% par an sur une durée de 10 ans
         </p>
       </SectionCard>
 
       {/* Projection APRÈS travaux */}
       <SectionCard title="Projection APRÈS travaux" icon={LineChart}>
         <FormInput
           label="Facture énergétique après travaux"
           name="factureApresTravaux"
           value={data.factureApresTravaux}
           onChange={(v) => onChange("factureApresTravaux", v)}
           type="number"
           placeholder="1200"
           suffix="€/an"
         />
       </SectionCard>
 
       {/* Synthèse des économies */}
       <SectionCard title="Synthèse des économies réalisées" icon={Banknote}>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <FormInput
             label="Consommation sur 10 ans (sans travaux)"
             name="consommation10AnsSansTravaux"
             value={data.consommation10AnsSansTravaux}
             onChange={(v) => onChange("consommation10AnsSansTravaux", v)}
             type="number"
             placeholder="35000"
             suffix="€"
           />
           <FormInput
             label="Consommation sur 10 ans (après travaux)"
             name="consommation10AnsApresTravaux"
             value={data.consommation10AnsApresTravaux}
             onChange={(v) => onChange("consommation10AnsApresTravaux", v)}
             type="number"
             placeholder="16000"
             suffix="€"
           />
           <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
             <label className="form-label text-primary mb-2 block">
               Économies totales sur 10 ans
             </label>
             <FormInput
               label=""
               name="economiesRealisees10Ans"
               value={data.economiesRealisees10Ans}
               onChange={(v) => onChange("economiesRealisees10Ans", v)}
               type="number"
               placeholder="19000"
               suffix="€"
             />
           </div>
           <div className="space-y-4">
             <FormInput
               label="Économies annuelles moyennes"
               name="economiesAnnuellesMoyennes"
               value={data.economiesAnnuellesMoyennes}
               onChange={(v) => onChange("economiesAnnuellesMoyennes", v)}
               type="number"
               placeholder="1900"
               suffix="€/an"
             />
             <FormInput
               label="Économies mensuelles moyennes"
               name="economiesMensuellesMoyennes"
               value={data.economiesMensuellesMoyennes}
               onChange={(v) => onChange("economiesMensuellesMoyennes", v)}
               type="number"
               placeholder="158"
               suffix="€/mois"
             />
           </div>
         </div>
       </SectionCard>
 
       {/* Transfert de charge */}
       <SectionCard title="Transfert de charge" icon={Banknote}>
         <div className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <FormInput
               label="Mensualité de confort"
               name="mensualiteConfort"
               value={data.mensualiteConfort}
               onChange={(v) => onChange("mensualiteConfort", v)}
               type="number"
               placeholder="200"
               suffix="€"
             />
             <FormInput
               label="- Économies moyennes mensuelles"
               name="economiesMoyennesMensuelles"
               value={data.economiesMoyennesMensuelles}
               onChange={(v) => onChange("economiesMoyennesMensuelles", v)}
               type="number"
               placeholder="158"
               suffix="€"
             />
             <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
               <label className="form-label text-primary mb-2 block">
                 = Mensualité - économies
               </label>
               <FormInput
                 label=""
                 name="mensualiteMoinsEconomies"
                 value={data.mensualiteMoinsEconomies}
                 onChange={(v) => onChange("mensualiteMoinsEconomies", v)}
                 type="number"
                 placeholder="42"
                 suffix="€/mois"
               />
             </div>
           </div>
           <div className="text-center p-4 bg-primary/5 rounded-lg">
             <p className="text-lg font-semibold text-primary">
               = Gain ou faible effort financier
             </p>
           </div>
         </div>
       </SectionCard>
 
       {/* Avantages écofinancement */}
       <div className="p-6 bg-secondary rounded-xl border border-border">
         <h4 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
           <CheckCircle2 className="w-5 h-5 text-primary" />
           Les avantages de l'écofinancement
         </h4>
         <ul className="space-y-3 text-sm text-foreground">
           <li className="flex items-start gap-2">
             <span className="text-primary mt-1">•</span>
             <span>Possibilité de régler comptant sans frais en fin de chantier, sans engagement de financement</span>
           </li>
           <li className="flex items-start gap-2">
             <span className="text-primary mt-1">•</span>
             <span>Pack Sécurité 6 mois pour ne pas avancer MaPrimeRénov' et CEE tout en commençant à réaliser des économies</span>
           </li>
           <li className="flex items-start gap-2">
             <span className="text-primary mt-1">•</span>
             <span>Possibilité de solder tout ou partiellement sans frais jusqu'à 10 000 €</span>
           </li>
           <li className="flex items-start gap-2">
             <span className="text-primary mt-1">•</span>
             <span>Si montant supérieur à 10 000 €, frais limités à 1% pris en charge par Groupe HER-ENR</span>
           </li>
         </ul>
       </div>
     </div>
   );
 };
 
 export default StepFinancement;