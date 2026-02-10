import React, { useState } from "react";
import { TrendingUp, Sun, Thermometer, Flame, Droplets, Grid2x2, Trash2 } from "lucide-react";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import SectionCard from "../SectionCard";
import { ScenariosData, ScenarioData, DimensionnementData, FenetreData } from "@/types/formData";
import { fenetreMatiereOptions, fenetreOuvrantOptions, fenetreTypeOptions } from "@/utils/handleForm";

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
      {/* Dimensionnement thermique */}
      <SectionCard title="PAC air-eau (chauffage / ECS)" icon={Thermometer} link="https://projipac.atlantic-pros.fr/fr" textLink="Dimensionnement PAC">
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
      <SectionCard title="PAC air-air (chauffage / climatisation)" icon={Thermometer}>
        <FormInput
          label="Modèle recommandé"
          name="dimensionnementFabricant"
          value={data.dimensionnementPACairair}
          onChange={(v) => onChange("dimensionnementPACairair", v)}
          type="text"
          placeholder=""
          suffix=""
        />
      </SectionCard>

      {/* Dimensionnement multi+ */}
      <SectionCard title="Multi + (chauffage / climatisation / ECS)" icon={Thermometer}>
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
      <SectionCard title="Poêle à bois/granulés" icon={Flame}>
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

      {/* Dimensionnement chauffe-eau thermodynamique */}
      <SectionCard title="Chauffe-eau thermodynamique (ECS)" icon={Droplets}>
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

      {/* Dimensionnement chauffe-eau solaire */}
      <SectionCard title="Chauffe-eau solaire (ECS)" icon={Droplets}>
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

      {/* Dimensionnement SSC */}
      <SectionCard title="Système Solaire Combiné (SSC)" icon={Sun}>
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

      {/* Dimensionnement solaire */}
      <SectionCard title="Photovoltaïque" icon={Sun} link="https://app.revolt.eco/groupe-her-enr/projects" textLink="Aller sur REVOLT">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Résultat REVOLT"
            name="consommationElecAnnuelle"
            value={data.consommationElecAnnuelle}
            onChange={(v) => onChange("consommationElecAnnuelle", v)}
            type="text"
            placeholder="0"
          />
          <FormInput
            label="Consommation électrique annuelle"
            name="consommationElecAnnuelle"
            value={data.consommationElecAnnuelle}
            onChange={(v) => onChange("consommationElecAnnuelle", v)}
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
            name="productionPVEstimee"
            value={data.productionPVEstimee}
            onChange={(v) => onChange("productionPVEstimee", v)}
            type="text"
            placeholder="0"
            suffix="kWh/an"
          />
          <FormInput
            label="Puissance batterie virtuelle recommandée"
            name="productionPVEstimee"
            value={data.productionPVEstimee}
            onChange={(v) => onChange("productionPVEstimee", v)}
            type="text"
            placeholder="0"
            suffix="kWh/an"
          />
        </div>
        <div className="mt-6 text-sm font-bold">
          <a href="https://drive.google.com/drive/u/1/folders/1nc7A9KeNsI7zjV8xkcOSaaTM_6T4R6wv" target="_blank">Voir Produits</a>
        </div>
      </SectionCard>

      {/* Dimensionnement Isolation */}
      <SectionCard title="Isolation" icon={Thermometer}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Combles perdus (surface mesurée en m2)"
            name="dimensionnementMultiplus"
            value={data.dimensionnementMultiplus}
            onChange={(v) => onChange("dimensionnementMultiplus", v)}
            type="number"
            placeholder=""
            suffix="m2"
          />
          <FormInput
            label="Sous-rampants (surface mesurée en m2)"
            name="dimensionnementMultiplus"
            value={data.dimensionnementMultiplus}
            onChange={(v) => onChange("dimensionnementMultiplus", v)}
            type="number"
            placeholder=""
            suffix="m2"
          />
        </div>
      </SectionCard>

      {/* Dimensionnement ITE */}
      <SectionCard title="Isolation des murs par l'extérieur" icon={Thermometer}>
        <div>
          <img src="" alt="" />
        </div>
      </SectionCard>

      {/* Fenêtres / Portes-fenêtres */}
      <SectionCard title="Fenêtres / Portes-fenêtres" icon={Grid2x2}>
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