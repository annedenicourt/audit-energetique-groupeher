import { useEffect, useState } from "react";
import PdfContentDossier from "../PdfContentDossier";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Printer } from "lucide-react";
import PdfContentCommercial from "../PdfContentCommercial";

// PrintDossierPage.tsx
export default function PrintEtudePage() {
  const { id } = useParams();
  const [simulData, setSimulData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const { data: studyData, error: studyDataError } = await supabase
          .from("etudes_energetiques")
          .select("payload")
          .eq("id", id)
          .single();

        if (studyDataError || !studyData) {
          toast.error("Impossible de récupérer l'étude");
          return;
        }

        setSimulData(studyData.payload);

      } catch (error) {
        console.error(error);
        toast.error("Erreur lors de la préparation de l'impression.");
      }
    };
    fetchData();
  }, [id]);

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Etude_NRJ_${simulData.client.nom}`;

    // Wait for render then print
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
      // Reset after print
      //setPrintPayload(null);
      //setPrintSimulData(null);
    }, 400);
  }

  if (!simulData) return <div>Chargement étude...</div>;

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="no-print my-4 text-center">
        <button
          className="nav-button px-6 bg-orange-500/80 text-white font-bold"
          onClick={() => handlePrint()}
        >
          <Printer className="w-5 h-5" />
          Télécharger l'étude
        </button>
      </div>
      {simulData &&
        <div className="print">
          <PdfContentCommercial data={simulData} />
        </div>
      }
      <div className="no-print my-4 text-center">
        <button
          className="nav-button px-6 bg-orange-500/80 text-white font-bold"
          onClick={() => handlePrint()}
        >
          <Printer className="w-5 h-5" />
          Télécharger l'étude
        </button>
      </div>

    </div>
  );
}