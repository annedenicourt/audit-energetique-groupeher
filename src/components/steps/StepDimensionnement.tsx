import React, { useMemo, useState } from "react";
import { TrendingUp, Sun, Thermometer, Flame, Droplets, Grid2x2, Fan, SquareArrowOutUpRight, CircleAlert, AlertCircle } from "lucide-react";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import SectionCard from "../SectionCard";
import { DimensionnementData, FenetreData, SelectedDimensionnementSections, DimensionnementSectionKey } from "@/types/formData";
import { fenetreMatiereOptions, fenetreOuvrantOptions, fenetreTypeOptions } from "@/utils/handleForm";
import AppModal from "../Modal";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface StepDimensionnementProps {
  data: DimensionnementData;
  onChange: (
    field: keyof DimensionnementData | string,
    value: string | DimensionnementData | FenetreData[] | SelectedDimensionnementSections
  ) => void;
}

const emptyFenetre = (): FenetreData => ({
  quantite: "",
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

  const updateSelectedSection = (
    key: DimensionnementSectionKey,
    checked: boolean
  ) => {
    onChange("selectedSections", {
      ...data.selectedSections,
      [key]: checked,
    });
  };

  const fenetres: FenetreData[] = data.dimensionnementFenetres?.length ? data.dimensionnementFenetres : [{ quantite: "", type: "", ouverture: "", matiere: "" }];

  const setFenetres = (next: FenetreData[]) => {
    onChange("dimensionnementFenetres", next);
  };

  /* const addFenetre = () => {
    setFenetres([...fenetres, emptyFenetre()]);
  };

  const removeFenetre = (index: number) => {
    if (fenetres.length <= 1) return; // on garde 1 ligne minimum
    setFenetres(fenetres.filter((_, i) => i !== index));
  }; */

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
      <SectionCard
        title="PAC air-eau & hybride (chauffage / ECS)"
        icon={Thermometer}
        link={[
          "https://www.prime-energie-edf.fr/controles-qualite/le-controle-de-la-qualite-d-installation-de-votre-pompe-a-chaleur",
          "https://projipac.atlantic-pros.fr/fr",
        ]}
        textLink={[
          "1-Contrôle qualité",
          "2-Note de dimensionnement PAC air-eau",
        ]}
        legend="À transmettre au client"
        showCheckbox
        checkboxChecked={data.selectedSections?.pacAirEau}
        onCheckboxChange={(checked) => updateSelectedSection("pacAirEau", checked)}
      >
        {data.selectedSections?.pacAirEau &&
          <div>
            <div className="mb-4 flex gap-x-2">
              <div className="w-fit py-1 px-2 flex items-center justify-center bg-primary font-bold text-white border rounded-md">
                <a
                  href="https://drive.google.com/drive/folders/1n2Jbxya4hiUhaFDjFeZlbti1onKemoLo"
                  target="_blank"
                  className="flex flex-row items-center text-xs"
                >
                  Voir produits
                  <SquareArrowOutUpRight size={20} className="ml-1" />
                </a>
              </div>
              <button className="py-1 px-2 flex items-center font-semibold text-xs text-white bg-orange-500 rounded-md gap-2 cursor-default">
                <CircleAlert size={15} />
                Fiche produit, RGE et décennale à transmettre au client
              </button>
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
          </div>
        }
      </SectionCard>

      {/* Dimensionnement pac air-air */}
      <SectionCard
        title="PAC air-air (chauffage / climatisation)"
        icon={Thermometer}
        link={["https://drive.google.com/drive/folders/1X4BQvAhTwJ96eitthgExWrJQFCX2LD6o"]}
        textLink={["Dimensionnement PAC air-air"]}
        showCheckbox
        checkboxChecked={data.selectedSections?.pacAirAir}
        onCheckboxChange={(checked) => updateSelectedSection("pacAirAir", checked)}
      >
        {data.selectedSections?.pacAirAir &&
          <div>
            <div className="mb-4 flex gap-x-2">
              <div className="w-fit py-1 px-2 flex items-center justify-center bg-primary font-bold text-white border rounded-md">
                <a
                  href="https://drive.google.com/drive/folders/1najEkUvKQOARVl5VdSuTJGjUy0SDDirm"
                  target="_blank"
                  className="flex flex-row items-center text-xs"
                >
                  Voir produits
                  <SquareArrowOutUpRight size={20} className="ml-1" />
                </a>
              </div>
              <button className="py-1 px-2 flex items-center font-semibold text-xs text-white bg-orange-500 rounded-md gap-2 cursor-default">
                <CircleAlert size={15} />
                Fiche produit, RGE et décennale à transmettre au client
              </button>
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
          </div>
        }
      </SectionCard>

      {/* Dimensionnement multi+ */}
      <SectionCard
        title="Multi + (chauffage / climatisation / ECS)"
        icon={Thermometer}
        link={["https://drive.google.com/drive/folders/1X4BQvAhTwJ96eitthgExWrJQFCX2LD6o"]}
        textLink={["Dimensionnement Multi +"]}
        showCheckbox
        checkboxChecked={data.selectedSections?.multiplus}
        onCheckboxChange={(checked) => updateSelectedSection("multiplus", checked)}
      >
        {data.selectedSections?.multiplus &&
          <div>
            <div className="mb-4 flex gap-x-2">
              <div className="w-fit py-1 px-2 flex items-center justify-center bg-primary font-bold text-white border rounded-md">
                <a
                  href="https://drive.google.com/drive/folders/1PFy6qJAfBNBHT8JB9NZpQ6m86Tpg8-Cx"
                  target="_blank"
                  className="flex flex-row items-center text-xs"
                >
                  Voir produits
                  <SquareArrowOutUpRight size={20} className="ml-1" />
                </a>
              </div>
              <button className="py-1 px-2 flex items-center font-semibold text-xs text-white bg-orange-500 rounded-md gap-2 cursor-default">
                <CircleAlert size={15} />
                Fiche produit, RGE et décennale à transmettre au client
              </button>
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
          </div>
        }
      </SectionCard>
      {/* Dimensionnement poele */}
      <SectionCard
        title="Poêle à bois/granulés"
        icon={Flame}
        link={["https://drive.google.com/drive/folders/1UZs1ZzAUtGprJXfS2I6poBCfQZh4hS-y"]}
        textLink={["Dimensionnement poêle"]}
        showCheckbox
        checkboxChecked={data.selectedSections?.poele}
        onCheckboxChange={(checked) => updateSelectedSection("poele", checked)}
      >
        {data.selectedSections?.poele &&
          <div>
            <div className="mb-4 flex gap-x-2">
              <div className="w-fit py-1 px-2 flex items-center justify-center bg-primary font-bold text-white border rounded-md">
                <a
                  href="https://drive.google.com/drive/folders/1b981tKniOLV9lfhhKieBz5fZSknYZfNk"
                  target="_blank"
                  className="flex flex-row items-center text-xs"
                >
                  Voir produits
                  <SquareArrowOutUpRight size={20} className="ml-1" />
                </a>
              </div>
              <button className="py-1 px-2 flex items-center font-semibold text-xs text-white bg-orange-500 rounded-md gap-2 cursor-default">
                <CircleAlert size={15} />
                Fiche produit, RGE et décennale à transmettre au client
              </button>
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
          </div>
        }

      </SectionCard>

      {/* Dimensionnement chauffe-eau thermodynamique */}
      <SectionCard
        title="Chauffe-eau thermodynamique (ECS)"
        icon={Droplets}
        showCheckbox
        checkboxChecked={data.selectedSections?.thermodynamique}
        onCheckboxChange={(checked) => updateSelectedSection("thermodynamique", checked)}
      >
        {data.selectedSections?.thermodynamique &&
          <div>
            <div className="mb-4 flex gap-x-2">
              <div className="w-fit py-1 px-2 flex items-center justify-center bg-primary font-bold text-white border rounded-md">
                <a
                  href="https://drive.google.com/drive/folders/10-H63QvaNOOqVufBMXwN50v-vgM26qlR"
                  target="_blank"
                  className="flex flex-row items-center text-xs"
                >
                  Voir produits
                  <SquareArrowOutUpRight size={20} className="ml-1" />
                </a>
              </div>
              <button className="py-1 px-2 flex items-center font-semibold text-xs text-white bg-orange-500 rounded-md gap-2 cursor-default">
                <CircleAlert size={15} />
                Fiche produit, RGE et décennale à transmettre au client
              </button>
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
          </div>
        }

      </SectionCard>

      {/* Dimensionnement chauffe-eau solaire */}
      <SectionCard
        title="Chauffe-eau solaire (ECS)"
        icon={Droplets}
        showCheckbox
        checkboxChecked={data.selectedSections?.ecsSolaire}
        onCheckboxChange={(checked) => updateSelectedSection("ecsSolaire", checked)}
      >
        {data.selectedSections?.ecsSolaire &&
          <div>
            <div className="mb-4 flex gap-x-2">
              <div className="w-fit py-1 px-2 flex items-center justify-center bg-primary font-bold text-white border rounded-md">
                <a
                  href="https://drive.google.com/drive/folders/1qEKl9isVVUNuJ8LkN4jTVNHNH1j6_mfF"
                  target="_blank"
                  className="flex flex-row items-center text-xs"
                >
                  Voir produits
                  <SquareArrowOutUpRight size={20} className="ml-1" />
                </a>
              </div>
              <button className="py-1 px-2 flex items-center font-semibold text-xs text-white bg-orange-500 rounded-md gap-2 cursor-default">
                <CircleAlert size={15} />
                Fiche produit, RGE et décennale à transmettre au client
              </button>
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
          </div>
        }

      </SectionCard>

      {/* Dimensionnement SSC */}
      <SectionCard
        title="Système Solaire Combiné (SSC)"
        icon={Sun}
        showCheckbox
        checkboxChecked={data.selectedSections?.ssc}
        onCheckboxChange={(checked) => updateSelectedSection("ssc", checked)}
      >
        {data.selectedSections?.ssc &&
          <div>
            <div className="mb-4 flex gap-x-2">
              <div className="w-fit py-1 px-2 flex items-center justify-center bg-primary font-bold text-white border rounded-md">
                <a
                  href="https://drive.google.com/drive/folders/1nuHsX7-y1rZ4XfcY3CBuiW6xXGwupeY1"
                  target="_blank"
                  className="flex flex-row items-center text-xs"
                >
                  Voir produits
                  <SquareArrowOutUpRight size={20} className="ml-1" />
                </a>
              </div>
              <button className="py-1 px-2 flex items-center font-semibold text-xs text-white bg-orange-500 rounded-md gap-2 cursor-default">
                <CircleAlert size={15} />
                Fiche produit, RGE et décennale à transmettre au client
              </button>
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
          </div>
        }

      </SectionCard>

      {/* Dimensionnement solaire */}
      <SectionCard
        title="Photovoltaïque"
        icon={Sun}
        link={["https://app.revolt.eco/groupe-her-enr/projects"]}
        textLink={["Dimensionnement solaire REVOLT"]}
        showCheckbox
        checkboxChecked={data.selectedSections?.photovoltaique}
        onCheckboxChange={(checked) => updateSelectedSection("photovoltaique", checked)}
      >
        {data.selectedSections?.photovoltaique &&
          <div>
            <div className="mb-4 flex gap-x-2">
              <div className="w-fit py-1 px-2 flex items-center justify-center bg-primary font-bold text-white border rounded-md">
                <a
                  href="https://drive.google.com/drive/folders/10-Sj0DgI11TyJw3UgjFMjlxDd7L8kY8X"
                  target="_blank"
                  className="flex flex-row items-center text-xs"
                >
                  Voir produits
                  <SquareArrowOutUpRight size={20} className="ml-1" />
                </a>
              </div>
              <button className="py-1 px-2 flex items-center font-semibold text-xs text-white bg-orange-500 rounded-md gap-2 cursor-default">
                <CircleAlert size={15} />
                Fiche produit, RGE et décennale à transmettre au client
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Consommation électrique annuelle"
                name="consommationPVElecAnnuelle"
                value={data.consommationPVElecAnnuelle}
                onChange={(v) => onChange("consommationPVElecAnnuelle", v)}
                type="number"
                placeholder="0"
                suffix="kW/an"
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
                suffix="kW/an"
              />
              <FormInput
                label="Puissance batterie physique recommandée"
                name="batteriePhysiqueReco"
                value={data.batteriePhysiqueReco}
                onChange={(v) => onChange("batteriePhysiqueReco", v)}
                type="text"
                placeholder="0"
                suffix="kW"
              />
              <FormInput
                label="Puissance batterie virtuelle recommandée"
                name="batterieVirtuelleReco"
                value={data.batterieVirtuelleReco}
                onChange={(v) => onChange("batterieVirtuelleReco", v)}
                type="text"
                placeholder="0"
                suffix="kW/mois"
              />
            </div>
          </div>
        }

      </SectionCard>

      {/* Dimensionnement Isolation */}
      <SectionCard
        title="Isolation"
        icon={Thermometer}
        showCheckbox
        checkboxChecked={data.selectedSections?.isolation}
        onCheckboxChange={(checked) => updateSelectedSection("isolation", checked)}
      >
        {data.selectedSections?.isolation &&
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <FormInput
              label="Plancher bas (surface mesurée en m2)"
              name="dimensionnementPlancherBas"
              value={data.dimensionnementPlancherBas}
              onChange={(v) => onChange("dimensionnementPlancherBas", v)}
              type="number"
              placeholder=""
              suffix="m2"
            />
          </div>
        }

      </SectionCard>

      {/* Dimensionnement ITE */}
      <SectionCard
        title="Isolation des murs par l'extérieur"
        icon={Thermometer}
        /* link={["https://drive.google.com/drive/folders/1NEX9Sl43vbTRJDb5LPfxWcH236_YeSr-"]}
        textLink={["Voir produits"]} */
        showCheckbox
        checkboxChecked={data.selectedSections?.ite}
        onCheckboxChange={(checked) => updateSelectedSection("ite", checked)}
      >
        {data.selectedSections?.ite &&
          <div>
            <div className="mb-4 flex gap-x-2">
              <div className="w-fit py-1 px-2 flex items-center justify-center bg-primary font-bold text-white border rounded-md">
                <a
                  href="https://drive.google.com/drive/folders/1NEX9Sl43vbTRJDb5LPfxWcH236_YeSr-"
                  target="_blank"
                  className="flex flex-row items-center text-xs"
                >
                  Voir produits
                  <SquareArrowOutUpRight size={20} className="ml-1" />
                </a>
              </div>
              <button className="py-1 px-2 flex items-center font-semibold text-xs text-white bg-orange-500 rounded-md gap-2 cursor-default">
                <CircleAlert size={15} />
                Fiche produit, RGE et décennale à transmettre au client
              </button>
            </div>
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
          </div>
        }

      </SectionCard>


      {/* Menuiseries */}
      <SectionCard
        title="Menuiseries (présenter l'échantillon)"
        icon={Grid2x2}
        showCheckbox
        checkboxChecked={data.selectedSections?.menuiseries}
        onCheckboxChange={(checked) => updateSelectedSection("menuiseries", checked)}
      >
        {data.selectedSections?.menuiseries &&
          <div>
            <div className="mb-4 flex gap-x-2">
              <div className="w-fit py-1 px-2 flex items-center justify-center bg-primary font-bold text-white border rounded-md">
                <a
                  href="https://drive.google.com/drive/folders/1o4fsS_9WEmZKH4WPurk7iFENORgj4Bx-"
                  target="_blank"
                  className="flex flex-row items-center text-xs"
                >
                  Voir produits
                  <SquareArrowOutUpRight size={20} className="ml-1" />
                </a>
              </div>
              <button className="py-1 px-2 flex items-center font-semibold text-xs text-white bg-orange-500 rounded-md gap-2 cursor-default">
                <CircleAlert size={15} />
                Fiche produit, RGE et décennale à transmettre au client
              </button>
            </div>
            <div className="p-3 space-y-2">
              <div className="grid grid-rows-2 grid-flow-col gap-4">
                <div className="col-span-2">
                  <div className=" font-semibold">Menuiseries</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="form-field">
                      <FormInput
                        label="Quantité"
                        name="quantiteMenuiseries"
                        value={fenetres[0].quantite}
                        onChange={(value) => updateFenetre(0, "quantite", value)}
                        type="number"
                        min="0"
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="matiere" className="form-label">Matière</label>
                      <select
                        value={fenetres[0].matiere}
                        onChange={(e) => updateFenetre(0, "matiere", e.target.value)}
                        className="form-select"
                        name="matiere"
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
                <div className="row-span-2 col-span-1">
                  <div>
                    <div className=" font-semibold">Volets roulants</div>
                    <div className="form-field">
                      <FormInput
                        label="Quantité"
                        name="quantiteVolets"
                        value={data.quantiteVolets}
                        onChange={(v) => onChange("quantiteVolets", v)}
                        type="number"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="row-span-3">
                  <div className="-mt-4 mb-4 text-sm text-center">Arguments OKNOPLAST</div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage({
                        src: "/images/Argument fenêtre oknoplast.jpg",
                        alt: "arguments Oknoplast",
                        caption: "Arguments Oknoplast",
                      });
                      setIsModalOpen(true);
                    }}
                    title="Cliquer pour agrandir"
                    className="block w-full"
                  >
                    <img
                      src="/images/Argument fenêtre oknoplast.jpg"
                      alt="arguments Oknoplast"
                      className="w-full h-40 md:h-56 object-contain"
                      loading="lazy"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

      </SectionCard>

      {/* VMC */}
      <SectionCard
        title="VMC"
        icon={Fan}
        showCheckbox
        checkboxChecked={data.selectedSections?.vmc}
        onCheckboxChange={(checked) => updateSelectedSection("vmc", checked)}
      >
        {data.selectedSections?.vmc &&
          <div>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 cursor-pointer py-1">
                <input
                  type="checkbox"
                  name="dimensionnementVMC"
                  checked={data.dimensionnementVMC === "creation"}
                  onChange={() => onChange("dimensionnementVMC", "creation")}
                  className="w-4 h-4 rounded border-input accent-primary"
                />
                <span className="text-sm">Création</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={data.dimensionnementVMC === "remplacement"}
                  onChange={() => onChange("dimensionnementVMC", "remplacement")}
                  className="w-4 h-4 rounded border-input accent-primary"
                />
                <span className="text-sm">Remplacement</span>
              </label>
            </div>
            {data.dimensionnementVMC === "creation" &&
              <button className="mt-4 py-1 px-2 flex items-center font-semibold text-sm text-white bg-orange-500 rounded-md gap-2 cursor-default">
                <CircleAlert size={15} />
                Création VMC impossible avec plafonds hourdis
              </button>
            }
          </div>

        }
      </SectionCard>

      {/* Autres produits */}
      <SectionCard
        title="Autre produit"
        //icon={Grid2x2}
        showCheckbox
        checkboxChecked={data.selectedSections?.autreProduit}
        onCheckboxChange={(checked) => updateSelectedSection("autreProduit", checked)}
      >
        {data.selectedSections?.autreProduit &&
          <div className="mb-4">
            <FormInput
              label="Détails"
              name="detailsAutreProduit"
              value={data.dimmensionnementAutreProduit}
              onChange={(v) => onChange("dimmensionnementAutreProduit", v)}
            />
          </div>
        }
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
    </div>
  );
};

export default StepDimensionnement;