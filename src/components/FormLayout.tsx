import React, { useState } from "react";
import { Calculator, Check, ChevronLeft, ChevronRight, LayoutDashboard, Leaf, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { NavLink } from "./NavLink";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

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
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  onPrevious: () => void;
  onNext: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const FormLayout: React.FC<FormLayoutProps> = ({
  children,
  currentStep,
  setCurrentStep,
  totalSteps,
  steps,
  onPrevious,
  onNext,
  canGoNext,
  canGoPrevious,
}) => {

  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };


  return (
    <div className="min-h-screen bg-background">
      <div className="fixed w-full z-20">
        {/* Header */}
        <header className="py-4 px-6 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="w-full flex items-center justify-between gap-3">
              <div className="w-28 md:w-48">
                <img className="object-contain" src="/images/logo-blanc-her-enr.webp" alt="logo groupe HER" />
              </div>
              <div>
                <p className="hidden md:block font-bold text-xs lg:text-lg text-white">
                  Étude Énergétique personnalisée
                </p>
              </div>
              <div className="flex items-center gap-4">
                {isAdmin &&
                  <NavLink to={"/admin"}>
                    <button className="p-2 md:px-4 md:py-2 flex items-center gap-2 text-xs lg:text-sm font-medium bg-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:bg-orange-500">
                      <LayoutDashboard className="w-4 h-4" />
                      Espace admin
                    </button>
                  </NavLink>
                }
                {/* <button className="py-2 px-3 flex items-center text-xs lg:text-sm text-white font-bold rounded-full hover:text-orange-500" onClick={() => navigate(`/simulateur-mpr`, { state: { returnStep: currentStep } })}>
                  <Calculator size={20} className="mr-1" />
                  Simulateur MPR
                </button> */}
                {/*  <div className="py-2 px-3 text-xs md:text-sm text-white font-bold rounded-full hover:text-orange-500" onClick={() => setIsOpenModal(true)} title={"Déconnexion"} >
                  <LogOut className="text-white" />
                </div> */}
                <Popover>
                  <PopoverTrigger asChild>
                    <LogOut className="text-white hover:text-orange-500 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 text-center">
                    <div className="mb-2 text-sm">Voulez-vous vraiment vous déconnecter ?</div>
                    <div>
                      <button className="px-3 py-2 text-sm text-white font-bold bg-orange-500 rounded-md" onClick={() => handleLogout()} >OUI, je me déconnecte</button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
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
                  <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setCurrentStep(step.id)}>
                    <div
                      className={`step-indicator ${currentStep === step.id
                        ? "step-indicator--active bg-orange-500 text-white font-bold"
                        : currentStep > step.id
                          ? "bg-orange-500"
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
                      className={`max-w-20 text-xs font-medium text-center ${currentStep === step.id
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
                      className={`mb-4 flex-1 h-0.5 mx-2 rounded-full transition-colors ${currentStep > step.id ? "bg-primary/50" : "bg-border"
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
      </div>


      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mt-52 animate-fade-in">{children}</div>
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
                className={`w-2 h-2 rounded-full transition-colors ${currentStep === step.id
                  ? "bg-primary"
                  : currentStep > step.id
                    ? "bg-primary/50"
                    : "bg-muted"
                  }`}
              />
            ))}
          </div>

          <button
            onClick={() =>
              currentStep === totalSteps ?
                navigate("/synthese")
                : onNext()
            }
            //disabled={!canGoNext}
            className="nav-button nav-button--primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">
              {currentStep === 9 ? "Monter le dossier" : currentStep === 10 ? "Aperçu avant validation" : "Suivant"}
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