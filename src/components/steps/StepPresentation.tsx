import React, { useState } from "react";
import { TrendingUp, Sun, Thermometer, SquareArrowOutUpRight } from "lucide-react";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import SectionCard from "../SectionCard";
import { ScenariosData, ScenarioData, DimensionnementData } from "@/types/formData";
import AppModal from "../Modal";



const StepPresentation = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string, caption: string } | null>(null);

  const openImage = (img: { src: string; alt: string, caption: string }) => {
    setSelectedImage(img);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="text-center">
      {/* Page title */}
      <div className="mb-4 flex flex-row items-center gap-x-3">
        <h2 className="mr-4 text-2xl font-display font-bold text-foreground">
          Présentation Groupe HER-Enr
        </h2>
        <button className="py-1 px-2 flex items-center font-semibold text-sm text-white bg-orange-500 rounded-md gap-2 cursor-default">
          <a
            href="https://particulier.edf.fr/fr/accueil/aides-financement/professionnels/resultats.html?raisonSociale=HER%20ENR"
            target="_blank"
            className="flex flex-row items-center text-sm font-bold"
          >
            Partenaire Economies d'énergie EDF
            <SquareArrowOutUpRight size={20} className="ml-1" />
          </a>
        </button>
        <button className="py-1 px-2 flex items-center font-semibold text-sm text-white bg-orange-500 rounded-md gap-2 cursor-default">
          <a
            href="https://france-renov.gouv.fr/annuaire-rge/identifier?company=85156645500057&date=2026-02-09"
            target="_blank"
            className="flex flex-row items-center text-sm font-bold"
          >
            Mandataire Administratif MaPrimeRénov'
            <SquareArrowOutUpRight size={20} className="ml-1" />
          </a>
        </button>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={"/images/protocole_secu.png"}
          alt={"protocole sécuritaire HER-Enr"}
          className="w-full h-[60vh] object-contain"
          loading="lazy"
        />
      </button>

      <AppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Aperçu">
        {isModalOpen && (
          <div className="flex flex-col gap-3">
            <img
              src={"images/protocole_secu.png"}
              alt={"protocole sécuritaire HER-Enr"}
              className="w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        )}
      </AppModal>
    </div>
  );
};

export default StepPresentation;