import React, { useMemo, useState } from "react";
import { TrendingUp, Sun, Thermometer, Flame, Droplets, Grid2x2, Trash2, SquareArrowOutUpRight } from "lucide-react";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import SectionCard from "../SectionCard";
import { ScenariosData, ScenarioData, DimensionnementData, FenetreData } from "@/types/formData";
import { fenetreMatiereOptions, fenetreOuvrantOptions, fenetreTypeOptions } from "@/utils/handleForm";
import AppModal from "../Modal";

interface StepDimensionnementProps {
  data: DimensionnementData;
  onChange: (
    field: keyof DimensionnementData | string,
    value: string | DimensionnementData | FenetreData[]
  ) => void;
}

const emptyFenetre = (): FenetreData => ({
  type: "",
  ouverture: "",
  matiere: "",
});

const StepDimensionnement: React.FC<StepDimensionnementProps> = ({ data, onChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string, caption: string } | null>(null);

  const images = useMemo(
    () => [
      {
        src: "/images/plan_ite_cote.png", alt: "exemple plan isolation par l'extérieur", caption: "Exemple plan pour ITE",
      },
      {
        src: "/images/photo_exemple_ite.png", alt: "photo exemple ite", caption: "Exemple photo ITE",
      }
    ],
    []
  );

  const fenetres: FenetreData[] = data.dimensionnementFenetres?.length ? data.dimensionnementFenetres : [{ type: "", ouverture: "", matiere: "" }];

  const setFenetres = (next: FenetreData[]) => {
    onChange("dimensionnementFenetres", next);
  };

  const addFenetre = () => {
    setFenetres([...fenetres, emptyFenetre()]);
  };

  const removeFenetre = (index: number) => {
    if (fenetres.length <= 1) return; // on garde 1 ligne minimum
    setFenetres(fenetres.filter((_, i) => i !== index));
  };

  const updateFenetre = (index: number, field: keyof FenetreData, value: string) => {
    setFenetres(
      fenetres.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    );
  };

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Dimensionnement
        </h2>
      </div>
      {/* Dimensionnement pac air-eau */}
      <SectionCard title="PAC air-eau (chauffage / ECS)" icon={Thermometer} link="https://projipac.atlantic-pros.fr/fr" textLink="Dimensionnement PAC air-eau">
        <div className="flex">
          <a
            href="https://drive.google.com/drive/folders/1n2Jbxya4hiUhaFDjFeZlbti1onKemoLo"
            target="_blank"
            className="mr-4 mb-4 flex flex-row items-center text-sm"
          >
            Voir produits
            <SquareArrowOutUpRight size={20} className="ml-1" />
          </a>
        </div>
        <FormInput
          label="Modèle recommandé"
          name="dimensionnementPACaireau"
          value={data.dimensionnementPACaireau}
          onChange={(v) => onChange("dimensionnementPACaireau", v)}
          type="text"
          placeholder=""
          suffix=""
        />
      </SectionCard>

      {/* Dimensionnement pac air-air */}
      <SectionCard title="PAC air-air (chauffage / climatisation)" icon={Thermometer} link="https://drive.google.com/drive/folders/1X4BQvAhTwJ96eitthgExWrJQFCX2LD6o" textLink="Dimensionnement PAC air-air">
        <div className="flex">
          <a
            href="https://drive.google.com/drive/folders/1najEkUvKQOARVl5VdSuTJGjUy0SDDirm"
            target="_blank"
            className="mr-4 mb-4 flex flex-row items-center text-sm"
          >
            Voir produits
            <SquareArrowOutUpRight size={20} className="ml-1" />
          </a>
        </div>
        <FormInput
          label="Modèle recommandé"
          name="dimensionnementPACairair"
          value={data.dimensionnementPACairair}
          onChange={(v) => onChange("dimensionnementPACairair", v)}
          type="text"
          placeholder=""
          suffix=""
        />
      </SectionCard>

      {/* Dimensionnement multi+ */}
      <SectionCard title="Multi + (chauffage / climatisation / ECS)" icon={Thermometer} link="https://drive.google.com/drive/folders/1X4BQvAhTwJ96eitthgExWrJQFCX2LD6o" textLink="Dimensionnement Multi +">
        <div className="flex">
          <a
            href="https://drive.google.com/drive/folders/1PFy6qJAfBNBHT8JB9NZpQ6m86Tpg8-Cx"
            target="_blank"
            className="mr-4 mb-4 flex flex-row items-center text-sm"
          >
            Voir produits
            <SquareArrowOutUpRight size={20} className="ml-1" />
          </a>
        </div>
        <FormInput
          label="Modèle recommandé"
          name="dimensionnementMultiplus"
          value={data.dimensionnementMultiplus}
          onChange={(v) => onChange("dimensionnementMultiplus", v)}
          type="text"
          placeholder=""
          suffix=""
        />
      </SectionCard>
      {/* Dimensionnement poele */}
      <SectionCard title="Poêle à bois/granulés" icon={Flame} link="https://drive.google.com/drive/folders/1UZs1ZzAUtGprJXfS2I6poBCfQZh4hS-y" textLink="Dimensionnement poêle">
        <div className="flex">
          <a
            href="https://drive.google.com/drive/folders/1b981tKniOLV9lfhhKieBz5fZSknYZfNk"
            target="_blank"
            className="mr-4 mb-4 flex flex-row items-center text-sm"
          >
            Voir produits
            <SquareArrowOutUpRight size={20} className="ml-1" />
          </a>
        </div>
        <FormInput
          label="Modèle recommandé"
          name="dimensionnementPoele"
          value={data.dimensionnementPoele}
          onChange={(v) => onChange("dimensionnementPoele", v)}
          type="text"
          placeholder=""
          suffix=""
        />
      </SectionCard>

      {/* Dimensionnement chauffe-eau thermodynamique */}
      <SectionCard title="Chauffe-eau thermodynamique (ECS)" icon={Droplets}>
        <div className="flex">
          <a
            href="https://drive.google.com/drive/folders/10-H63QvaNOOqVufBMXwN50v-vgM26qlR"
            target="_blank"
            className="mr-4 mb-4 flex flex-row items-center text-sm"
          >
            Voir produits
            <SquareArrowOutUpRight size={20} className="ml-1" />
          </a>
        </div>

        <FormInput
          label="Modèle recommandé"
          name="dimensionnementThermodynamique"
          value={data.dimensionnementThermodynamique}
          onChange={(v) => onChange("dimensionnementThermodynamique", v)}
          type="text"
          placeholder=""
          suffix=""
        />
      </SectionCard>

      {/* Dimensionnement chauffe-eau solaire */}
      <SectionCard title="Chauffe-eau solaire (ECS)" icon={Droplets}>
        <div className="flex">
          <a
            href="https://drive.google.com/drive/folders/1qEKl9isVVUNuJ8LkN4jTVNHNH1j6_mfF"
            target="_blank"
            className="mr-4 mb-4 flex flex-row items-center text-sm"
          >
            Voir produits
            <SquareArrowOutUpRight size={20} className="ml-1" />
          </a>
        </div>
        <FormInput
          label="Modèle recommandé"
          name="dimensionnementECSSolaire"
          value={data.dimensionnementECSSolaire}
          onChange={(v) => onChange("dimensionnementECSSolaire", v)}
          type="text"
          placeholder=""
          suffix=""
        />
      </SectionCard>

      {/* Dimensionnement SSC */}
      <SectionCard title="Système Solaire Combiné (SSC)" icon={Sun}>
        <div className="flex">
          <a
            href="https://drive.google.com/drive/folders/1nuHsX7-y1rZ4XfcY3CBuiW6xXGwupeY1"
            target="_blank"
            className="mr-4 mb-4 flex flex-row items-center text-sm"
          >
            Voir produits
            <SquareArrowOutUpRight size={20} className="ml-1" />
          </a>
        </div>
        <FormInput
          label="Modèle recommandé"
          name="dimensionnementSSC"
          value={data.dimensionnementSSC}
          onChange={(v) => onChange("dimensionnementSSC", v)}
          type="text"
          placeholder=""
          suffix=""
        />
      </SectionCard>

      {/* Dimensionnement solaire */}
      <SectionCard title="Photovoltaïque" icon={Sun} link="https://app.revolt.eco/groupe-her-enr/projects" textLink="Aller sur REVOLT">
        <div className="flex">
          <a
            href="https://drive.google.com/drive/folders/10-Sj0DgI11TyJw3UgjFMjlxDd7L8kY8X"
            target="_blank"
            className="mr-4 mb-4 flex flex-row items-center text-sm"
          >
            Voir produits
            <SquareArrowOutUpRight size={20} className="ml-1" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* <FormInput
            label="Résultat REVOLT"
            name="resultatRevolt"
            value={data.resultatRevolt}
            onChange={(v) => onChange("resultatRevolt", v)}
            type="text"
            placeholder="0"
          /> */}
          <FormInput
            label="Consommation électrique annuelle"
            name="consommationPVElecAnnuelle"
            value={data.consommationPVElecAnnuelle}
            onChange={(v) => onChange("consommationPVElecAnnuelle", v)}
            type="number"
            placeholder="0"
            suffix="kWh/an"
          />
          <FormInput
            label="Puissance PV recommandée"
            name="puissancePVRecommandee"
            value={data.puissancePVRecommandee}
            onChange={(v) => onChange("puissancePVRecommandee", v)}
            type="number"
            placeholder="0"
            suffix="kWc"
          />
          <FormInput
            label="Production PV estimée"
            name="productionPVEstimee"
            value={data.productionPVEstimee}
            onChange={(v) => onChange("productionPVEstimee", v)}
            type="number"
            placeholder="0"
            suffix="kWh/an"
          />
          <FormInput
            label="Puissance batterie physique recommandée"
            name="batteriePhysiqueReco"
            value={data.batteriePhysiqueReco}
            onChange={(v) => onChange("batteriePhysiqueReco", v)}
            type="text"
            placeholder="0"
            suffix="kWh/an"
          />
          <FormInput
            label="Puissance batterie virtuelle recommandée"
            name="batterieVirtuelleReco"
            value={data.batterieVirtuelleReco}
            onChange={(v) => onChange("batterieVirtuelleReco", v)}
            type="text"
            placeholder="0"
            suffix="kWh/an"
          />
        </div>
      </SectionCard>

      {/* Dimensionnement Isolation */}
      <SectionCard title="Isolation" icon={Thermometer}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Combles perdus (surface mesurée en m2)"
            name="dimensionnementComblesPerdus"
            value={data.dimensionnementComblesPerdus}
            onChange={(v) => onChange("dimensionnementComblesPerdus", v)}
            type="number"
            placeholder=""
            suffix="m2"
          />
          <FormInput
            label="Sous-rampants (surface mesurée en m2)"
            name="dimensionnementRampants"
            value={data.dimensionnementRampants}
            onChange={(v) => onChange("dimensionnementRampants", v)}
            type="number"
            placeholder=""
            suffix="m2"
          />
        </div>
      </SectionCard>

      {/* Dimensionnement ITE */}
      <SectionCard title="Isolation des murs par l'extérieur" icon={Thermometer} link="https://drive.google.com/drive/folders/1NEX9Sl43vbTRJDb5LPfxWcH236_YeSr-" textLink="Voir produits">
        <div>Faire photos et plans de façade pour devis R2</div>
        {/* Illustrations */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div
              key={`${img.src}-${idx}`}
              className="border border-slate-200 rounded-lg overflow-hidden transition-transform duration-300 ease-out hover:scale-105"
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedImage(img);
                  setIsModalOpen(true);
                }}
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
      </SectionCard>
      <AppModal
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedImage(null);
          setIsModalOpen(false);
        }}
        title="Exemple"
      >
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

      {/* Fenêtres / Portes-fenêtres */}
      <SectionCard title="Menuiseries (Fenêtres/Portes-fenêtres)" icon={Grid2x2} link="https://drive.google.com/drive/folders/1o4fsS_9WEmZKH4WPurk7iFENORgj4Bx-" textLink="Voir produits">
        <button
          type="button"
          onClick={addFenetre}
          className="nav-button nav-button--primary px-2 text-xs font-bold"
        >
          Ajouter
        </button>

        <div>
          {fenetres.map((fenetre, idx) => (
            <div key={idx} className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className=" font-semibold">Menuiserie {idx + 1}</div>
                <button
                  type="button"
                  onClick={() => removeFenetre(idx)}
                  disabled={fenetres.length === 1}
                  className="px-2 py-1 text-xs disabled:hidden"
                >
                  <Trash2 />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="form-field">
                  <label className="form-label">Type de menuiserie</label>
                  <select
                    value={fenetre.type}
                    onChange={(e) => updateFenetre(idx, "type", e.target.value)}
                    className="form-select"
                  >
                    <option value="">Sélectionner</option>
                    {fenetreTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label">Type d'ouverture</label>
                  <select
                    value={fenetre.ouverture}
                    onChange={(e) => updateFenetre(idx, "ouverture", e.target.value)}
                    className="form-select"
                  >
                    <option value="">Sélectionner</option>
                    {fenetreOuvrantOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label">Matière</label>
                  <select
                    value={fenetre.matiere}
                    onChange={(e) => updateFenetre(idx, "matiere", e.target.value)}
                    className="form-select"
                  >
                    <option value="">Sélectionner</option>
                    {fenetreMatiereOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default StepDimensionnement;