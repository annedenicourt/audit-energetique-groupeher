import React, { useEffect, useMemo, useState } from "react";
import { Banknote, LineChart, CheckCircle2, ArrowBigRight, CircleX } from "lucide-react";
import FormInput from "../FormInput";
import SectionCard from "../SectionCard";
import { FinancementData } from "@/types/formData";
import { Chronologie } from "../Chronologie";
import AppModal from "../Modal";

interface StepFinancementProps {
  data: FinancementData;
  onChange: (field: keyof FinancementData, value: string) => void;
  economiesMensuellesMoyennes: string;
  aidesMaPrimeRenov: string;
  aidesCEE: string;
  economiesPremiereAnne: string;
  economies10eAnnee: string;
}

const StepFinancement: React.FC<StepFinancementProps> = ({ data, onChange, economiesMensuellesMoyennes, aidesMaPrimeRenov, aidesCEE, economiesPremiereAnne, economies10eAnnee }) => {

  const [isActive, setIsActive] = useState<string>("economies5eAnnee");
  const [resultCalc, setResultCalc] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string, caption: string } | null>(null);

  const images = useMemo(
    () => [
      {
        src: "/images/comparatif_bancaire_1.png", alt: "Comparatif bancaire 1", caption: "Comparatif 5000 € - page 1",
      },
      {
        src: "/images/comparatif_bancaire_2.png", alt: "Comparatif bancaire 2", caption: "Comparatif 10000 € - page 2",
      },
      {
        src: "/images/comparatif_bancaire_3.png", alt: "Comparatif bancaire 3", caption: "Comparatif 15000 € - page 3",
      },
      {
        src: "/images/comparatif_bancaire_4.png", alt: "Comparatif bancaire 3", caption: "Comparatif 20000 € - page 4",
      },
    ],
    []
  );

  const getBackground = (mensualite) => {
    let result = ""
    const numMensualite = Number(mensualite)
    if (mensualite && numMensualite >= -50) {
      result = "ring-lime-500"
    }
    return result
  }

  const openImage = (img: { src: string; alt: string, caption: string }) => {
    setSelectedImage(img);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    let result = 0
    if (isActive === "economiesPremiereAnnee") {
      result = Number(economiesPremiereAnne) - Number(data.mensualiteConfort)
    } else if (isActive === "economies10eAnnee") {
      result = Number(economies10eAnnee) - Number(data.mensualiteConfort)
    } else {
      result = Number(economiesMensuellesMoyennes) - Number(data.mensualiteConfort)
    }
    setResultCalc(Math.round(result).toString())

  }, [data.mensualiteConfort, economies10eAnnee, economiesMensuellesMoyennes, economiesPremiereAnne, isActive])

  return (
    <div className="">
      {/* Page title */}
      <div className="mb-16">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Écofinancement & Synthèse
        </h2>
        <p className="text-muted-foreground">
          Transfert de charge et projection des économies
        </p>
      </div>
      {/* Frise */}
      <Chronologie data={data} onChange={onChange} aidesMaPrimeRenov={aidesMaPrimeRenov} aidesCEE={aidesCEE} />
      {/* Transfert de charge */}
      <SectionCard title="Transfert de charge" icon={Banknote}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="mt-0 md:mt-5 flex items-center justify-center">
            <FormInput
              label="Mensualité de confort"
              name="mensualiteConfort"
              value={data.mensualiteConfort}
              type="number"
              placeholder="0"
              suffix="€"
              readonly={true}
              isFocus={true}
            />
          </div>
          <div>
            <div onClick={() => setIsActive("economiesPremiereAnnee")}>
              <div className="form-label">Économies dès la 1ère année</div>
              <div className={`my-3 flex items-center justify-between form-input bg-green-500/20 cursor-pointer  ${isActive === "economiesPremiereAnnee" && "ring ring-offset-2 ring-lime-500"}`}>
                <span>{economiesPremiereAnne || 0}</span>
                <span className="text-muted-foreground text-sm font-medium">€</span>
              </div>
            </div>
            <div onClick={() => setIsActive("economies5eAnnee")}>
              <div className="form-label">Économies moy. mens. sur 10 ans (la 5e année)</div>
              <div className={`my-3 flex items-center justify-between form-input bg-green-500/20 cursor-pointer  ${isActive === "economies5eAnnee" && "ring ring-offset-2 ring-lime-500"}`}>
                <span>{economiesMensuellesMoyennes || 0}</span>
                <span className="text-muted-foreground text-sm font-medium">€</span>
              </div>
            </div>
            <div onClick={() => setIsActive("economies10eAnnee")}>
              <div className="form-label">Économies la 10e année</div>
              <div className={`mt-3 flex items-center justify-between form-input bg-green-500/20 cursor-pointer  ${isActive === "economies10eAnnee" && "ring ring-offset-2 ring-lime-500"}`}>
                <span>{economies10eAnnee || 0}</span>
                <span className="text-muted-foreground text-sm font-medium">€</span>
              </div>
            </div>
          </div>
          <div className={`flex flex-col justify-center items-center`}>
            <div className="font-bold">Gain financier</div>
            <div className="mt-0 md:mt-5">
              <FormInput
                label=""
                name="mensualiteMoinsEconomies"
                value={resultCalc}
                // onChange={(v) => onChange("mensualiteMoinsEconomies", v)}
                type="number"
                placeholder="0"
                suffix="€/mois"
                readonly={true}
                className={`ring ring-offset-2 rounded-md ${getBackground(data.mensualiteMoinsEconomies)}`}
                isFocus={true}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Inconvenients  NO TRAVUX */}
      <div className="mt-8 p-6 bg-red-100 rounded-xl border border-border">
        <h4 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <CircleX className="w-5 h-5 text-primary" />
          Les inconvénients de la facture d'énergie sans travaux
        </h4>
        <ul className="space-y-3 text-sm text-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Facture d'énergie = crédit à vie à 7% d'augmentation moyenne sur 10 ans</span>
          </li>
        </ul>
      </div>

      {/* Avantages écofinancement */}
      <div className="mt-4 p-6 bg-green-500/20 rounded-xl border border-border">
        <h4 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          Les avantages de l'écofinancement
          <ArrowBigRight />
          un paiement comptant mais quand vous voulez
        </h4>
        <ul className="space-y-3 text-sm text-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Possibilité de régler comptant sans frais en fin de chantier, sans engagement de financement</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Pack Sécurité 6 mois pour ne pas avancer MaPrimeRénov' et CEE tout en commençant à réaliser des économies</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Possibilité de solder tout ou partiellement sans frais jusqu'à 10 000 €</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Augmentez ou réduisez vos mensualités comme vous le souhaitez</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Possibilité de reporter une mensualité une fois par an</span>
          </li>
        </ul>
      </div>

      <div className="mt-8 section-title">Comparatif autres banques</div>

      {/* Illustrations */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <div
            key={`${img.src}-${idx}`}
            className="border border-slate-200 rounded-lg overflow-hidden transition-transform duration-300 ease-out hover:scale-105"
          >
            <button
              type="button"
              onClick={() => openImage(img)}
              className="block w-full"
              title="Cliquer pour agrandir"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-40 object-cover"
                loading="lazy"
              />
            </button>

            <div className="p-2 text-xs text-center text-muted-foreground">
              {img.caption}
            </div>
          </div>
        ))}
      </div>

      <AppModal isOpen={isModalOpen} onClose={closeModal} title="Aperçu">
        {selectedImage && (
          <div className="flex flex-col gap-3">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full max-h-[75vh] object-contain rounded-lg"
            />
            <div className="text-sm text-center text-muted-foreground">
              {selectedImage.caption}
            </div>
          </div>
        )}
      </AppModal>
    </div>


  );
};

export default StepFinancement;