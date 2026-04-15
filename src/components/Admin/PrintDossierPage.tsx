import { useEffect, useState } from "react";
import PdfContentDossier from "../PdfContentDossier";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Printer } from "lucide-react";

// PrintDossierPage.tsx
export default function PrintDossierPage() {
  const { id } = useParams();
  const [dossierData, setDossierData] = useState(null);
  const [simulData, setSimulData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: dossierData, error: dossierErr } = await supabase
          .from("dossiers")
          .select("payload, client_name, study_id")
          .eq("id", id)
          .single();

        if (dossierErr || !dossierData) {
          toast.error("Impossible de récupérer le dossier");
          return;
        }

        setDossierData(dossierData.payload);

        if (dossierData.study_id) {
          const { data: studyData, error: studyDataError } = await supabase
            .from("etudes_energetiques")
            .select("payload")
            .eq("id", dossierData.study_id)
            .single();

          if (studyDataError || !studyData) {
            toast.error("Impossible de récupérer l'étude");
            return;
          }

          setSimulData(studyData.payload);
        }
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors de la préparation de l'impression.");
      }
    };
    fetchData();
  }, [id]);

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Dossier_liaison_${dossierData.nomClient}`;

    // Wait for render then print
    setTimeout(() => {
      window.print();
      document.title = originalTitle;

      // Reset after print
      //setPrintPayload(null);
      //setPrintSimulData(null);
    }, 400);
  }

  if (!dossierData) return <div>Chargement...</div>;
  if (!simulData) return <div>Chargement étude...</div>;

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="no-print my-4 text-center">
        <button
          className="nav-button px-6 bg-orange-500/80 text-white font-bold"
          onClick={() => handlePrint()}
        >
          <Printer className="w-5 h-5" />
          Télécharger le dossier
        </button>
      </div>
      {dossierData &&
        <div className="print">
          <PdfContentDossier data={dossierData} simulData={simulData} />
        </div>
      }
      <div className="no-print my-4 text-center">
        <button
          className="nav-button px-6 bg-orange-500/80 text-white font-bold"
          onClick={() => handlePrint()}
        >
          <Printer className="w-5 h-5" />
          Télécharger le dossier
        </button>
      </div>

    </div>
  );
}