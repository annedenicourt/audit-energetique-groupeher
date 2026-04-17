import React, { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FormData, initialFormData } from "@/types/formData";
import { saveStudy } from "@/utils/saveStudy";
import html2pdf from "html2pdf.js";
import { DossierFormData } from "@/types/dossierFormData";
import { saveDossier } from "@/utils/saveDossier";
import { Check, FileCheck, X, AlertTriangle, Info, Save, FolderPlus } from "lucide-react";
import AppModal from "@/components/Modal";
import PdfContentDossier from "@/components/PdfContentDossier";
import PdfContentCommercial from "@/components/PdfContentCommercial";
import {
  useDossierValidation,
  REQUIRED_GROUPS,
  CONDITIONAL_FIELDS,
} from "@/hooks/useDossierValidation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


const Synthese: React.FC = () => {
  const navigate = useNavigate();
  const [pdfMode, setPdfMode] = useState("dossier");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formSim, setFormSim] = useState<FormData>(() => {
    try {
      const stored = localStorage.getItem("simulation_form");
      if (stored) return { ...initialFormData, ...JSON.parse(stored) };
    } catch { /* ignore */ }
    return { ...initialFormData };
  });

  const [formDossier, setFormDossier] = useState<DossierFormData>(() => {
    try {
      const storedDossier = localStorage.getItem("dossier_form");
      if (storedDossier) return { ...initialFormData, ...JSON.parse(storedDossier) };
    } catch { /* ignore */ }
    return { ...initialFormData };
  });

  const { groupErrors, fieldErrors } = useDossierValidation(formDossier, formSim);

  /* const downloadPdfGeneric = async () => {
    setIsSaving(true);
    document.body.classList.add("exporting");

    const buildPdfBlob = async (node: HTMLElement, filename: string) => {
      return (await html2pdf()
        .set({
          filename,
          margin: 0,
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(node)
        .outputPdf("blob")) as Blob;
    };

    const downloadBlob = (blob: Blob, filename: string) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    try {
      // ETUDE — sauvegarde JSON uniquement
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
        localStorage.removeItem("simulation_form");
        localStorage.removeItem("current_study_id");
      }

      // DOSSIER — sauvegarde JSON + téléchargement PDF côté client
      const dataDossier = localStorage.getItem("dossier_form");
      const dossierPayload = dataDossier ? JSON.parse(dataDossier) : null;
      const existingDossierId = localStorage.getItem("current_dossier_id");

      if (dossierPayload) {
        const resDossier = await saveDossier(dossierPayload, existingDossierId, savedStudyId);
        if (!resDossier.success) {
          toast.error(`Sauvegarde dossier échouée : ${resDossier.error}`);
          return;
        }

        // Générer et télécharger le PDF dossier de liaison côté client
        const dossierEl = document.getElementById("pdf-content-dossier");
        if (dossierEl) {
          const dossierFilename = `Dossier_Liaison_${formDossier.nomClient}.pdf`;
          const dossierBlob = await buildPdfBlob(dossierEl, dossierFilename);
          downloadBlob(dossierBlob, dossierFilename);
        }

        localStorage.removeItem("dossier_form");
        localStorage.removeItem("current_dossier_id");
      }

      if (!studyPayload && !dossierPayload) {
        toast.error("Aucune donnée à exporter");
        return;
      }
      toast.success("PDF(s) généré(s) et sauvegardé(s) !", {
        position: "top-center",
        className: "text-xl px-8 py-6 w-[480px] font-semibold",
      });
      navigate("/");
    } catch (err) {
      console.error("[downloadPdfGeneric] Erreur", err);
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      document.body.classList.remove("exporting");
      setIsSaving(false);
    }
  }; */


  const downloadPdfGeneric = async () => {
    setIsSaving(true);
    document.body.classList.add("exporting");

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
        const resDossier = await saveDossier(
          dossierPayload,
          existingDossierId,
          savedStudyId
        );

        if (!resDossier.success) {
          toast.error(`Sauvegarde dossier échouée : ${resDossier.error}`);
          return;
        }
      }

      if (!studyPayload && !dossierPayload) {
        toast.error("Aucune donnée à exporter");
        return;
      }

      //toast.success("Données sauvegardées");

      // fermer la modale avant window.print() sinon imprime la modale
      setIsModalOpen(false);
      const originalTitle = document.title;
      document.title = `Dossier_liaison_${formDossier.nomClient}`;

      // Wait for render then print
      setTimeout(() => {
        window.print();
        document.title = originalTitle;
      }, 400);

    } catch (err) {
      console.error("[downloadPdfGeneric] Erreur", err);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      document.body.classList.remove("exporting");
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem("simulation_form");
    localStorage.removeItem("current_study_id");
    localStorage.removeItem("dossier_form");
    localStorage.removeItem("current_dossier_id");
    navigate("/")
  }

  return (
    <div className="w-[50rem] md:w-full md:max-w-5xl mx-auto px-4 py-8">
      <div className="no-print mb-4">
        <button
          onClick={() => navigate("/", { replace: true, state: { step: 11 } })}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← Retour Simulateur
        </button>
      </div>
      <div className="no-print mt-8 flex items-center justify-between">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setPdfMode("etude")}
            className={`p-4 rounded-t-lg border-x border-t border-orange-100 ${pdfMode === "etude"
              ? "bg-orange-100 font-bold"
              : "bg-white text-slate-400"
              }`}
          >
            Synthèse simulateur
          </button>
          <button
            type="button"
            onClick={() => setPdfMode("dossier")}
            className={`p-4 rounded-t-lg border-x border-t border-orange-100 ${pdfMode === "dossier"
              ? "bg-orange-100 font-bold"
              : "bg-white text-slate-400"
              }`}
          >
            Synthèse dossier de liaison
          </button>
        </div>
        <div>
          <button
            className="nav-button nav-button--primary px-6 mr-3"
            disabled={isSaving}
            onClick={() => setIsModalOpen(true)}
          >
            <Save className="w-5 h-5" />
            Sauvegarder le dossier
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="nav-button border border-slate-100 bg-green-100 px-6 cursor-pointer">
                <FolderPlus className="w-5 h-5" />
                Nouveau dossier
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center">Voulez-vous vraiment ouvrir un nouveau dossier ?</AlertDialogTitle>
                <AlertDialogDescription className="text-center">
                  N'oubliez pas de sauvegarder votre dossier en cours avant de commencer un nouveau
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="hover:bg-orange-500">Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleReset()}>
                  Oui, je commence un nouveau dossier
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {pdfMode === "etude" ? (
        <div className="mx-auto pt-4 bg-white border border-orange-100">
          <div className="m-6 flex items-center">
            <FileCheck size="30" className="mr-3 text-primary" />
            <div className="mr-6 text-2xl font-display font-bold text-foreground">
              Infos Simulateur
            </div>
          </div>
          <div className="pdf-commercial-visible">
            <PdfContentCommercial data={formSim} />
          </div>
        </div>
      ) : (
        <div className="mx-auto bg-white border border-orange-100">
          <div className="m-6 flex items-center">
            <FileCheck size="30" className="mr-3 text-primary" />
            <div className="mr-6 text-2xl font-display font-bold text-foreground">
              Dossier de liaison
            </div>
          </div>
          <div>
            <PdfContentDossier data={formDossier} selectedOptions={formSim?.dimensionnement?.selectedSections} simulData={formSim} />
          </div>
        </div>
      )}

      <div className="no-print mt-4 flex justify-center">
        <button
          className="nav-button nav-button--primary px-6 mr-3"
          disabled={isSaving}
          onClick={() => setIsModalOpen(true)}
        >
          <FileCheck className="w-5 h-5" />
          Sauvegarder le dossier
        </button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="nav-button border border-slate-100 bg-green-100 px-6 cursor-pointer">
              <FolderPlus className="w-5 h-5" />
              Nouveau dossier
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center">Voulez-vous vraiment ouvrir un nouveau dossier ?</AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                N'oubliez pas de sauvegarder votre dossier en cours avant de commencer un nouveau
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:bg-orange-500">Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleReset()}>
                Oui, je commence un nouveau dossier
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>



      {/* ZONE PDF OFF-SCREEN */}
      {/* <div className="fixed -left-[10000px] top-0">
        <div id="pdf-content-etude">
          <div className="a4-page">
            <img src="/images/couv_pdf.png" alt="couverture pdf" />
          </div>
          <PdfContentCommercial data={formSim} />
        </div>
      </div> */}
      <div className="fixed -left-[10000px] top-0">
        <div id="pdf-content-dossier">
          <div className="a4-page">
            <img src="/images/couv_dossier_liaison.png" alt="couverture pdf" />
          </div>
          <PdfContentDossier data={formDossier} selectedOptions={formSim?.dimensionnement?.selectedSections} simulData={formSim} />
        </div>
      </div>

      {/* AFFICHAGE MODALE */}
      <AppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="" className="bg-white rounded-xl shadow-xl w-[60vw] max-h-[90vh] overflow-auto outline-none p-6">
        {isModalOpen && (
          <div className="relative flex flex-col gap-6">
            <img src="./images/Logo-HER-WEB.webp" alt="" className="absolute -top-10 w-28" />
            <div className="flex items-center">
              <div className="mx-auto">
                <div className="text-center uppercase">Dossier client</div>
                <div className="text-center text-lg font-bold uppercase">
                  {formDossier.nomClient}
                </div>
              </div>
            </div>
            <div className="text-center text-sm">
              Une fois clôturé, le dossier de liaison  <br />et les données entrées dans le simulateur seront sauvegardés. <br />
              Assurez-vous que les données envoyées sont exactes avant validation
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Veuillez choisir au moins une option dans les catégories ci-dessous :
              </p>

              {/* Erreurs de groupes */}
              {REQUIRED_GROUPS.filter((g) => groupErrors[g.key]).map((group) => (
                <div key={group.key} className="mb-2 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold">{group.label}</div>
                  </div>
                </div>
              ))}
              {/* Erreurs de champs conditionnels */}
              {CONDITIONAL_FIELDS.filter((cf) => fieldErrors[cf.key]).length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-semibold mb-2">Documents manquants</div>
                  <div className="grid md:grid-cols-2">
                    {CONDITIONAL_FIELDS.filter((cf) => fieldErrors[cf.key]).map((cf) => (
                      <div key={cf.key} className="mb-1 ml-4 flex items-center gap-2">
                        <Info className="w-4 h-4 text-destructive shrink-0" />
                        <span className="text-sm">{cf.label}</span>
                      </div>
                    ))}
                  </div>

                </div>
              )}
              <div className="mt-4 text-red-500 text-center text-xs">Obligatoire : expliquer pourquoi il manque ces documents dans la rubrique "Détails dossier & chantier"</div>

            </div>
            <div className="mx-auto">
              <button
                className="nav-button bg-slate-300 font-bold px-6 mr-3"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-5 h-5" />
                Annuler
              </button>
              <button
                className="nav-button bg-green-500 text-white font-bold px-6"
                disabled={isSaving}
                onClick={() => { requestAnimationFrame(() => downloadPdfGeneric()); }}
              >
                <Check className="w-5 h-5" />
                {isSaving ? "Sauvegarde en cours…" : "Confirmer la validation"}
              </button>
            </div>
          </div>
        )}
      </AppModal>
    </div>
  );
};

export default Synthese;
