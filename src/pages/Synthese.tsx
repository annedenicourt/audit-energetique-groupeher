import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutList, LayoutGrid, FileText, Search, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import StepSynthese from "@/components/steps/StepSynthese";
import { FormData, initialFormData } from "@/types/formData";
import { saveStudy } from "@/utils/saveStudy";
import html2pdf from "html2pdf.js";
import PreviewCommercial from "@/components/PreviewCommercial";
import PreviewDossier from "@/components/PreviewDossier";
import { DossierFormData } from "@/types/dossierFormData";
import { saveDossier } from "@/utils/saveDossier";


const Synthese: React.FC = () => {
  const navigate = useNavigate();
  const [pdfMode, setPdfMode] = useState("etude");
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
    const el = document.getElementById("pdf-content");

    const storageKey = pdfMode === "etude" ? "simulation_form" : "dossier_form";
    const raw = localStorage.getItem(storageKey);
    const payload = raw ? JSON.parse(raw) : null;

    if (!el || !payload) {
      toast.error("Contenu PDF ou données introuvables");
      document.body.classList.remove("exporting");
      setIsSaving(false);
      return;
    }

    const filename =
      pdfMode === "etude"
        ? `Etude_NRJ_${formSim.client.nom}.pdf`
        : `Dossier_Liaison_${formDossier.nomClient}.pdf`;

    try {
      const pdfBlob: Blob = await html2pdf()
        .set({
          filename,
          margin: 0,
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(el)
        .outputPdf("blob");

      const result =
        pdfMode === "etude"
          ? await saveStudy(pdfBlob, payload, filename)
          : await saveDossier(pdfBlob, payload, filename);

      if (!result.success) {
        toast.error(`Sauvegarde échouée : ${result.error}`);
        return;
      }

      /* SI DOSSIER LIAISON TELECHARGEMENT DU PDF SUR ORDI*/
      if (pdfMode === "dossier") {
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      localStorage.removeItem(storageKey);
      toast.success("PDF téléchargé et sauvegardé !");
      navigate("/")
    } catch (err) {
      console.error("[downloadPdfGeneric] Erreur", err);
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      document.body.classList.remove("exporting");
      setIsSaving(false);
    }
  };



  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-4">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← Retour Simulateur
        </button>
      </div>
      <div className="mt-8 flex items-center">
        <div className={`p-4 rounded-t-lg cursor-pointer border-x border-t border-orange-100 ${pdfMode === "etude" ? "bg-orange-100 font-bold" : "bg-white text-slate-400"}`} onClick={() => { setPdfMode("etude") }}>
          Synthèse simulateur
        </div>
        <div className={`p-4 rounded-t-lg cursor-pointer border-x border-t border-orange-100 ${pdfMode === "dossier" ? "bg-orange-100 font-bold" : "bg-white text-slate-400"}`} onClick={() => { setPdfMode("dossier") }}>
          Synthèse dossier de liaison
        </div>
      </div>
      {pdfMode === "etude" ? (
        <PreviewCommercial data={formSim} downloadPdf={downloadPdfGeneric} isSaving={isSaving} />
      ) : (
        <PreviewDossier data={formDossier} downloadPdf={downloadPdfGeneric} isSaving={isSaving} />
      )}
    </div>
  );
};

export default Synthese;
