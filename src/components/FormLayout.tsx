 import React from "react";
 import { Check, ChevronLeft, ChevronRight, Leaf } from "lucide-react";
 
 interface Step {
   id: number;
   label: string;
   shortLabel: string;
 }
 
 interface FormLayoutProps {
   children: React.ReactNode;
   currentStep: number;
   totalSteps: number;
   steps: Step[];
   onPrevious: () => void;
   onNext: () => void;
   canGoNext: boolean;
   canGoPrevious: boolean;
 }
 
 const FormLayout: React.FC<FormLayoutProps> = ({
   children,
   currentStep,
   totalSteps,
   steps,
   onPrevious,
   onNext,
   canGoNext,
   canGoPrevious,
 }) => {
   return (
     <div className="min-h-screen bg-background">
       {/* Header */}
       <header className="bg-gradient-to-r from-foreground to-primary py-4 px-6 shadow-lg">
         <div className="max-w-6xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
               <Leaf className="w-6 h-6 text-primary-foreground" />
             </div>
             <div>
               <h1 className="text-xl font-display font-bold text-primary-foreground">
                 Groupe HER-ENR
               </h1>
               <p className="text-sm text-primary-foreground/70">
                 Devis & Audit Énergétique
               </p>
             </div>
           </div>
           <div className="text-right text-primary-foreground/80 text-sm">
             <span className="font-medium">Étape {currentStep}</span> sur {totalSteps}
           </div>
         </div>
       </header>
 
       {/* Progress bar */}
       <div className="bg-card border-b border-border py-6 px-6">
         <div className="max-w-6xl mx-auto">
           {/* Desktop: full steps */}
           <div className="hidden md:flex items-center justify-between">
             {steps.map((step, index) => (
               <React.Fragment key={step.id}>
                 <div className="flex flex-col items-center gap-2">
                   <div
                     className={`step-indicator ${
                       currentStep === step.id
                         ? "step-indicator--active"
                         : currentStep > step.id
                         ? "step-indicator--complete"
                         : "step-indicator--pending"
                     }`}
                   >
                     {currentStep > step.id ? (
                       <Check className="w-5 h-5" />
                     ) : (
                       step.id
                     )}
                   </div>
                   <span
                     className={`text-xs font-medium text-center max-w-20 ${
                       currentStep === step.id
                         ? "text-primary"
                         : currentStep > step.id
                         ? "text-primary/70"
                         : "text-muted-foreground"
                     }`}
                   >
                     {step.shortLabel}
                   </span>
                 </div>
                 {index < steps.length - 1 && (
                   <div
                     className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${
                       currentStep > step.id ? "bg-primary/50" : "bg-border"
                     }`}
                   />
                 )}
               </React.Fragment>
             ))}
           </div>
 
           {/* Mobile: compact progress bar */}
           <div className="md:hidden">
             <div className="flex items-center justify-between mb-2">
               <span className="text-sm font-medium text-foreground">
                 {steps[currentStep - 1]?.label}
               </span>
               <span className="text-sm text-muted-foreground">
                 {currentStep}/{totalSteps}
               </span>
             </div>
             <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
               <div
                 className="h-full bg-primary rounded-full transition-all duration-300"
                 style={{ width: `${(currentStep / totalSteps) * 100}%` }}
               />
             </div>
           </div>
         </div>
       </div>
 
       {/* Main content */}
       <main className="max-w-4xl mx-auto px-4 py-8">
         <div className="animate-fade-in">{children}</div>
       </main>
 
       {/* Navigation footer */}
       <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-border py-4 px-6 shadow-lg">
         <div className="max-w-4xl mx-auto flex items-center justify-between">
           <button
             onClick={onPrevious}
             disabled={!canGoPrevious}
             className="nav-button nav-button--secondary disabled:opacity-40 disabled:cursor-not-allowed"
           >
             <ChevronLeft className="w-5 h-5" />
             <span className="hidden sm:inline">Précédent</span>
           </button>
 
           <div className="flex items-center gap-1.5">
             {steps.map((step) => (
               <div
                 key={step.id}
                 className={`w-2 h-2 rounded-full transition-colors ${
                   currentStep === step.id
                     ? "bg-primary"
                     : currentStep > step.id
                     ? "bg-primary/50"
                     : "bg-muted"
                 }`}
               />
             ))}
           </div>
 
           <button
             onClick={onNext}
             disabled={!canGoNext}
             className="nav-button nav-button--primary disabled:opacity-40 disabled:cursor-not-allowed"
           >
             <span className="hidden sm:inline">
               {currentStep === totalSteps ? "Terminer" : "Suivant"}
             </span>
             <ChevronRight className="w-5 h-5" />
           </button>
         </div>
       </footer>
 
       {/* Spacer for fixed footer */}
       <div className="h-20" />
     </div>
   );
 };
 
 export default FormLayout;