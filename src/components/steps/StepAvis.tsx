import React, { useEffect, useState } from "react";
import { Star, Handshake, Check, Copy, ThumbsUp } from "lucide-react";
import SectionCard from "../SectionCard";
import { AidesData } from "@/types/formData";
import { plafondsData, nbrePersonnesOptions, plafondParPersonneSupp } from "@/utils/handleForm";
import SimulMpr from "@/pages/SimulMpr";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import AppModal from "../Modal";

interface StepAvisProps {
  data: AidesData;
  onChange: (field: keyof AidesData, value: string) => void;
  accompagnateur: string;
}

const StepAvis: React.FC<StepAvisProps> = ({ data, onChange, accompagnateur }) => {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText("https://g.page/r/CQI02Dc6rnnQEBM/review");
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Avis & Parrainage
        </h2>
      </div>

      {/* AVIS */}
      <SectionCard>
        <div className="text-center">
          <div className="mb-2 text-4xl font-handwrite">
            Comment avez-vous trouvé l'accompagnement <br /> lors de votre rendez-vous d’audit énergétique ?
          </div>
          <div className="py-2 text-lg font-semibold">
            Votre avis est précieux pour soutenir personnellement votre accompagnateur
          </div>
          <div className="w-56 px-2 py-1 mx-auto flex items-center justify-center text-white font-bold bg-orange-500 rounded-full">
            <ThumbsUp className="mr-1 h-5 w-5 text-white" />
            <span>Je soutiens {accompagnateur !== undefined ? accompagnateur : "mon accompagnateur"}</span>
          </div>
          <div className="mt-8">
            {/* QR CODE */}
            <div className="flex flex-col items-center justify-center">
              <div className="p-1 bg-white border rounded-xl">
                <img
                  src="/images/QR_code_avis.jpg"
                  alt="QR code avis Google"
                  className="w-44 h-44"
                />
              </div>
              <p className="mt-4 text-xs">
                Scannez pour partager votre expérience en 30 secondes
              </p>
            </div>
            <div className="my-6 font-bold">
              OU
            </div>
            {/* Boutons */}
            <div className="flex flex-col">
              {/* <a className="text-sm underline" href="https://g.page/r/CQI02Dc6rnnQEBM/review" target="_blank">Cliquez ici pour déposer un avis Google</a> */}
              {/* <Button onClick={handleCopy} className="h-7 mt-4 px-2 ml-2 text-xs gap-1">
                {copied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copied ? "Copié !" : "Copier le lien"}
              </Button> */}
              <Button
                variant="outline"
                onClick={() => window.open("https://g.page/r/CQI02Dc6rnnQEBM/review", "_blank")}
                className="w-full hover:bg-orange-500"
              >
                <Star className="w-4 h-4 mr-2" />
                Donner mon avis en ligne
              </Button>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* PARRAINAGE */}
      <SectionCard title="Parrainage" icon={Handshake}>
        <div className="flex justify-center items-center gap-2">
          <div className="w-1/2 text-center">
            <div className="mb-2 text-3xl font-handwrite">
              Vous êtes satisfait de votre accompagnement lors de l'audit Groupe HER ENR ?
            </div>
            <div className="py-2 text-lg font-semibold">
              Pourquoi ne pas en parler autour de vous ?
            </div>
            <div className="w-fit px-3 py-2 my-8 mx-auto flex items-center justify-center text-2xl text-white font-bold bg-orange-500 rounded-full">
              <span>Jusqu'à 1000 € par filleul</span>
            </div>
            <Button
              variant="outline"
              //onClick={() => window.open("https://g.page/r/CQI02Dc6rnnQEBM/review", "_blank")}
              className="mt-8 w-full hover:bg-orange-500"
            >
              <a href="images/parrainage.pdf" download>
                Télécharger le PDF
              </a>
            </Button>
          </div>
          <div className="w-1/2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="block w-full"
              title="Cliquer pour agrandir"
            >
              <img
                src={"/images/parrainage.png"}
                alt={"formulaire parrainage HER-Enr"}
                className="w-full h-[60vh] object-contain"
                loading="lazy"
              />
            </button>
          </div>
        </div>
      </SectionCard>
      <AppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Aperçu">
        {isModalOpen && (
          <div className="flex flex-col gap-3">
            <img
              src={"images/parrainage.png"}
              alt={"formulaire parrainage Her-Enr"}
              className="w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        )}
      </AppModal>
    </div>
  );
};

export default StepAvis;