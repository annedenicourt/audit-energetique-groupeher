import React, { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FormData, initialFormData } from "@/types/formData";
import { saveStudy } from "@/utils/saveStudy";
import html2pdf from "html2pdf.js";
import PreviewCommercial from "@/components/PreviewCommercial";
import PreviewDossier from "@/components/PreviewDossier";
import { DossierFormData } from "@/types/dossierFormData";
import { saveDossier } from "@/utils/saveDossier";
import { Check, FileCheck, X } from "lucide-react";
import AppModal from "@/components/Modal";
import PdfContentDossier from "@/components/PdfContentDossier";
import PdfContentCommercial from "@/components/PdfContentCommercial";


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

  const downloadPdfGeneric = async () => {
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
  };

  return (
    <div className="w-[50rem] md:w-full md:max-w-5xl mx-auto px-4 py-8">
      <div className="mb-4">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← Retour Simulateur
        </button>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-4 rounded-t-lg cursor-pointer border-x border-t border-orange-100 ${pdfMode === "etude" ? "bg-orange-100 font-bold" : "bg-white text-slate-400"}`} onClick={() => { setPdfMode("etude") }}>
            Synthèse simulateur
          </div>
          <div className={`p-4 rounded-t-lg cursor-pointer border-x border-t border-orange-100 ${pdfMode === "dossier" ? "bg-orange-100 font-bold" : "bg-white text-slate-400"}`} onClick={() => { setPdfMode("dossier") }}>
            Synthèse dossier de liaison
          </div>
        </div>
        <div>
          <button
            className="nav-button nav-button--primary px-6"
            disabled={isSaving}
            onClick={() => setIsModalOpen(true)}
          >
            <FileCheck className="w-5 h-5" />
            Valider et sauvegarder le dossier
          </button>
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
            <PdfContentDossier data={formDossier} selectedOptions={formSim?.dimensionnement?.selectedSections} />
          </div>
        </div>
      )}

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
          <PdfContentDossier data={formDossier} selectedOptions={formSim?.dimensionnement?.selectedSections} />
        </div>
      </div>


      {/* AFFICHAGE MODALE */}
      <AppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="">
        {isModalOpen && (
          <div className="flex flex-col gap-6">
            <div className="mx-auto">
              <img src="./images/Logo-HER-WEB.webp" alt="" className="w-56" />
            </div>
            <div className="mx-auto">
              <div className="text-center uppercase">Dossier client</div>
              <div className="text-center text-xl font-bold uppercase">
                {formDossier.nomClient}
              </div>
            </div>
            <div className="text-center">
              Une fois clôturé, le dossier de liaison  <br />et les données entrées dans le simulateur seront sauvegardés. <br />
              Assurez-vous que les données envoyées sont exactes avant validation
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
