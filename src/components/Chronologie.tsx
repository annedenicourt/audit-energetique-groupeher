import React from "react";

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string; // ✅ optionnel
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}: FieldProps) {
  return (
    <input
      aria-label={label}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={
        "rounded-md border border-slate-300 bg-white/90 px-2 py-1 text-sm shadow-sm " +
        "focus:outline-none focus:ring-2 focus:ring-slate-300 " +
        className
      }
    />
  );
}


export default function Chronologie({ values, setValue }) {
  // values = { mois_demande, mois_metre, mois_pose, mois_m1, mois_m2, mpr, cee, reinject_m1, reinject_m2 }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-extrabold tracking-tight">
        PLAN À GESTION LIBRE - CHRONOLOGIE
      </h2>

      {/* Conteneur responsive calé sur le ratio de l'image */}
      <div className="mt-6 w-full max-w-5xl">
        <div className="relative w-full overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* IMPORTANT: ratio proche de ton visuel (à ajuster). Exemple ~ 16:9 */}
          <div className="relative aspect-[16/9] w-full">
            {/* Image de fond */}
            <img
              src="/chronologie.png"
              alt="Frise chronologique"
              className="absolute inset-0 h-full w-full rounded-xl object-contain"
              draggable={false}
            />

            {/* Champs overlay (positions en %) */}
            {/* Mois (3 premiers à gauche) */}
            <div className="absolute left-[18%] top-[40%] w-[12%]">
              <Field
                label="Mois Demande"
                placeholder="Mois"
                value={values?.mois_demande}
                onChange={(v) => setValue("mois_demande", v)}
              />
            </div>

            <div className="absolute left-[32%] top-[40%] w-[12%]">
              <Field
                label="Mois Métré"
                placeholder="Mois"
                value={values?.mois_metre}
                onChange={(v) => setValue("mois_metre", v)}
              />
            </div>

            <div className="absolute left-[46%] top-[40%] w-[12%]">
              <Field
                label="Mois Pose"
                placeholder="Mois"
                value={values?.mois_pose}
                onChange={(v) => setValue("mois_pose", v)}
              />
            </div>

            {/* Mois à droite */}
            <div className="absolute left-[67%] top-[40%] w-[12%]">
              <Field
                label="Mois 1ère mensualité"
                placeholder="Mois"
                value={values?.mois_m1}
                onChange={(v) => setValue("mois_m1", v)}
              />
            </div>

            <div className="absolute left-[87%] top-[40%] w-[12%]">
              <Field
                label="Mois 2e mensualité"
                placeholder="Mois"
                value={values?.mois_m2}
                onChange={(v) => setValue("mois_m2", v)}
              />
            </div>

            {/* Aides obtenues (dans le cadre) */}
            <div className="absolute left-[63%] top-[54%] w-[10%]">
              <Field
                label="MPR"
                placeholder="€"
                value={values?.mpr}
                onChange={(v) => setValue("mpr", v)}
              />
            </div>

            <div className="absolute left-[63%] top-[65%] w-[10%]">
              <Field
                label="CEE"
                placeholder="€"
                value={values?.cee}
                onChange={(v) => setValue("cee", v)}
              />
            </div>

            {/* Montants à réinjecter (2 grands champs en bas à droite) */}
            <div className="absolute left-[64%] top-[74%] w-[19%]">
              <Field
                label="À réinjecter 1"
                placeholder="Montant à réinjecter"
                className="py-2"
                value={values?.reinject_m1}
                onChange={(v) => setValue("reinject_m1", v)}
              />
            </div>

            <div className="absolute left-[83%] top-[74%] w-[19%]">
              <Field
                label="À réinjecter 2"
                placeholder="Montant à réinjecter"
                className="py-2"
                value={values?.reinject_m2}
                onChange={(v) => setValue("reinject_m2", v)}
              />
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-sm font-semibold text-slate-700">
          Hypothèse : augmentation moyenne estimée à 6% par an sur une durée de 10 ans
        </p>
      </div>
    </div>
  );
}
