import React, { useState } from "react";
import { Check, ChevronLeft, ChevronRight, LayoutDashboard, LogOut, Save, Trash2 } from "lucide-react";
import { NavLink } from "./NavLink";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { saveStudy } from "@/utils/saveStudy";
import { saveDossier } from "@/utils/saveDossier";
import { toast } from "sonner";

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
  onStepClick?: (stepId: number) => boolean;
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
  onStepClick,
}) => {

  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { role } = useUserRole();
  const [isSaving, setIsSaving] = useState(false);


  const handleSaveToDb = async () => {
    setIsSaving(true);
    try {
      const dataStudy = localStorage.getItem("simulation_form");
      const studyPayload = dataStudy ? JSON.parse(dataStudy) : null;
      const existingStudyId = localStorage.getItem("current_study_id");
      let savedStudyId: string | null = existingStudyId;

      if (studyPayload) {
        const resStudy = await saveStudy(studyPayload, existingStudyId);
        if (!resStudy.success) {
          toast.error(`Sauvegarde étude échouée : ${resStudy.error}`);
          return;
        }
        savedStudyId = resStudy.studyId ?? null;
      }

      const dataDossier = localStorage.getItem("dossier_form");
      const dossierPayload = dataDossier ? JSON.parse(dataDossier) : null;
      const existingDossierId = localStorage.getItem("current_dossier_id");

      if (dossierPayload) {
        const resDossier = await saveDossier(dossierPayload, existingDossierId, savedStudyId);
        if (!resDossier.success) {
          toast.error(`Sauvegarde dossier échouée : ${resDossier.error}`);
          return;
        }
      }

      if (!studyPayload && !dossierPayload) {
        toast.error("Aucune donnée à enregistrer");
        return;
      }

      toast.success("Données enregistrées avec succès !", {
        position: "top-center",
      });
      localStorage.removeItem("simulation_form");
      localStorage.removeItem("dossier_form");
      localStorage.removeItem("current_study_id");
      localStorage.removeItem("current_dossier_id");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return;
    } catch (err) {
      console.error("[handleSaveToDb] Erreur", err);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  const checkStep = () => {
    if (currentStep === totalSteps) {
      navigate("/synthese")
    } else {
      onNext()
    }
  }

  const resetApp = () => {
    localStorage.removeItem("simulation_form");
    localStorage.removeItem("dossier_form");
    window.location.reload();
  }


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
                {(role === "admin" || role === "commercial") &&
                  <NavLink to={"/admin"}>
                    <button className="p-2 md:px-4 md:py-2 flex items-center gap-2 text-xs lg:text-sm font-medium bg-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:bg-orange-500">
                      <LayoutDashboard className="w-4 h-4" />
                      {role === "admin" ? "Espace admin" : "Mes études"}
                    </button>
                  </NavLink>
                }
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <LogOut className="text-white hover:text-orange-500 cursor-pointer" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Voulez-vous vraiment vous déconnecter ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        A la prochaine connexion, vous devrez renseigner votre adresse e-mail.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleLogout()}>
                        Oui, je me déconnecte
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </header>
        {/* Progress bar */}
        <div className="bg-card border-b border-border p-3">
          <div className="max-w-6xl mx-auto">
            {/* Desktop: full steps */}
            <div className="hidden md:flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => {
                    if (!onStepClick || onStepClick(step.id)) setCurrentStep(step.id);
                  }}>
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
        <div className="mt-40 animate-fade-in">{children}</div>
      </main>

      {/* Navigation footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-border py-4 px-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="text-muted-foreground gap-2 hover:bg-orange-500">
                <Trash2 className="h-4 w-4" />
                Réinitialiser
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Réinitialiser le dossier ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Toutes les données locales du formulaire seront supprimées.
                  Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => resetApp()}>
                  Oui, réinitialiser
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="outline"
            className="gap-2"
            disabled={isSaving}
            onClick={handleSaveToDb}
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Enregistrement…" : "Enregistrer"}
          </Button>
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
              checkStep()
            }
            //disabled={!canGoNext}
            className="nav-button nav-button--primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">
              {currentStep === 9 ? "Monter le dossier" : currentStep === 11 ? "Aperçu avant validation" : "Suivant"}
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