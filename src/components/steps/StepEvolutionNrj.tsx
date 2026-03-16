import React, { useMemo, useState } from "react";
import { FileText, Zap, ChartLine } from "lucide-react";
import FormInput from "../FormInput";
import FormTextarea from "../FormTextarea";
import SectionCard from "../SectionCard";
import { ClientData, EvolutionData } from "@/types/formData";
import FormSelect from "../FormSelect";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Bar,
  BarChart,
  Cell
} from "recharts";
import { energieOptions } from "@/utils/handleForm";
import AppModal from "../Modal";

interface StepEvolutionProps {
  data: EvolutionData;
  onChange: (field: keyof EvolutionData, value: string) => void;
  client: ClientData;
}


const StepEvolutionNrj: React.FC<StepEvolutionProps> = ({ data, onChange, client }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string, caption: string } | null>(null);

  const images = useMemo(
    () => [
      {
        src: "/images/prix_elec_france.png", alt: "Graphique évolution 1", caption: "Évolution du prix de l'électricité",
      },
      {
        src: "/images/prix_gaz_france.png", alt: "Graphique évolution 2", caption: "Évolution du prix du gaz",
      },
      {
        src: "/images/prix_fioul_france.png", alt: "Graphique évolution 3", caption: "Évolution du prix du fioul",
      },
      {
        src: "/images/prix_global_france.png", alt: "Graphique évolution 3", caption: "Contexte énergétique global",
      },
    ],
    []
  );

  const openImage = (img: { src: string; alt: string, caption: string }) => {
    setSelectedImage(img);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };


  const ChartData = [
    { name: "- 5 ans", value: 80, color: "#22c55e" },
    { name: "Aujourd’hui", value: 150, color: "#f59e0b" },
    { name: "+ 5 ans", value: 240, color: "#f97316" },
    { name: "+ 10 ans", value: 300, color: "#f91616" },
  ];

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Évolution de la facture énergétique
        </h2>
        <div className="text-xs text-red-500">* champs obligatoires</div>
      </div>

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

      {/* Projection évolution des coûts - avant travaux */}
      <SectionCard title="Projection d'évolution des coûts de l'énergie (avant travaux)" icon={ChartLine}>
        <div className="w-4/5 mx-auto">
          <div className="h-[200px] w-full -ml-8">
            <ResponsiveContainer>
              <BarChart
                data={ChartData}
                margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine
                />
                <YAxis
                  tick={false}
                  tickLine={false}
                  axisLine
                />
                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                >
                  {ChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <FormInput
              label="Facture - 5 ans"
              name="coutNrjMoins5ans"
              value={data.coutNrjMoins5ans}
              type="number"
              placeholder="0"
              suffix="€/an"
              readonly={true}
              className="text-sm"
              isFocus={true}
            />
            <FormInput
              label="Facture aujourd'hui"
              name="coutNrjAujourdhui"
              value={data.coutNrjAujourdhui}
              onChange={(v) => onChange("coutNrjAujourdhui", v)}
              type="number"
              placeholder="0"
              suffix="€/an"
              className="text-sm"
              isMissing={data.coutNrjAujourdhui === ""}
              required
            />
            <FormInput
              label="Estimation + 5 ans"
              name="coutNrj5Ans"
              value={data.coutNrj5Ans}
              type="text"
              placeholder="0"
              suffix="€/an"
              className="text-sm"
              readonly={true}
              isWarning={true}
            />
            <FormInput
              label="Estimation + 10 ans"
              name="coutNrj10Ans"
              value={data.coutNrj10Ans}
              type="text"
              placeholder="0"
              suffix="€/an"
              className="text-sm"
              readonly={true}
              isWarning={true}
            />
          </div>

        </div>
        <FormInput
          label="Dépense totale cumulée sur 10 ans (avant travaux)"
          name="depenseTotal10ans"
          value={data.depenseTotal10ans}
          type="text"
          placeholder="0"
          suffix="€"
          className="mt-6"
          readonly={true}
          isWarning={true}
        />

        <p className="mt-3 font-bold text-center text-xs text-muted-foreground">
          Source CRE : augmentation moyenne estimée à 7% par an sur une durée de 10 ans
        </p>
      </SectionCard>

      {/* Notes */}
      <SectionCard title="Notes / Remarques" icon={FileText}>
        <FormTextarea
          label="Observations complémentaires"
          name="notes"
          value={data.notes}
          onChange={(v) => onChange("notes", v)}
          placeholder="Ajoutez ici toutes les observations importantes..."
          rows={12}
        />
      </SectionCard>
    </div>
  );
};

export default StepEvolutionNrj;