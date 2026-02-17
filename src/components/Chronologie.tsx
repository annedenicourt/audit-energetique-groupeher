import React from "react";
import { DimensionnementData, FenetreData, FinancementData } from "@/types/formData";
import { CornerUpRight, Redo } from "lucide-react";


interface ChronologieProps {
  data: FinancementData;
  //onChange?: (value: string) => void;
  onChange: (field: keyof FinancementData, value: string) => void;
  aidesMaPrimeRenov: string;
  aidesCEE: string;
}

export const Chronologie: React.FC<ChronologieProps> = ({ data, onChange, aidesCEE, aidesMaPrimeRenov }) => {

  return (
    <div className="relative mb-16 w-full max-w-[1200px] mx-auto">
      <div className="relative w-[90%] m-auto flex flex-row justify-between z-10">
        <div className="w-5/12 flex flex-row justify-between">
          <div className="">
            <input
              className="px-3 py-2 mb-6 w-20 text-sm text-center border border-slate-300 rounded-md"
              type="text"
              name=""
              value={data.mois1}
              onChange={(e) => onChange("mois1", e.target.value)}
              placeholder="Mois"
            />
            <div className="w-20 h-20 flex justify-center items-center bg-orange-500 rounded-full">
              <div className="text-xs text-white font-bold">Demande</div>
            </div>
            <div className="mt-6 text-center">0 €</div>
          </div>
          <div className="">
            <input
              className="px-3 py-2 mb-6 w-20 text-sm text-center border border-slate-300 rounded-md"
              type="text"
              name=""
              value={data.mois2}
              onChange={(e) => onChange("mois2", e.target.value)}
              placeholder="Mois"
            />
            <div className="w-20 h-20 flex justify-center items-center bg-orange-500 rounded-full">
              <div className="text-xs text-white font-bold">Métré</div>
            </div>
            <div className="mt-6 text-center">0 €</div>
          </div>
          <div className="">
            <input
              className="px-3 py-2 mb-6 w-20 text-sm text-center border border-slate-300 rounded-md"
              type="text"
              name=""
              value={data.mois3}
              onChange={(e) => onChange("mois3", e.target.value)}
              placeholder="Mois"
            />
            <div className="w-20 h-20 flex justify-center items-center bg-orange-500 rounded-full">
              <div className="text-xs text-white font-bold">Pose</div>
            </div>
            <div className="mt-6 text-center">0 €</div>
          </div>
        </div>
        <div className="relative w-2/12">
          <div className="absolute -top-36 -left-5 rotate-12">
            <Redo size={200} strokeWidth={0.5} className="text-slate-300" />
          </div>
          <div className="mb-3 text-sm text-center">Report 6 mois à 0€/mois</div>
          <div className="w-full h-36 p-2 bg-white border border-slate-300 rounded-lg">
            <div className="mb-3 text-sm text-center">Aides obtenues</div>
            <div className="mb-2 flex flex-row items-center justify-between">
              <label className="mr-2">MPR</label>
              <input
                type="text"
                name=""
                defaultValue={aidesMaPrimeRenov}
                placeholder=""
                readOnly
                className="w-[65%] border border-slate-300 rounded bg-muted text-muted-foreground cursor-default outline-none ring-0 ring-transparent border-input shadow-none" />
            </div>
            <div className="flex flex-row items-center justify-between">
              <label className="mr-2">CEE</label>
              <input
                type="text"
                name=""
                defaultValue={aidesCEE}
                placeholder=""
                readOnly
                className="w-[65%] border border-slate-300 rounded bg-muted text-muted-foreground cursor-default outline-none ring-0 ring-transparent border-input shadow-none" />
            </div>
          </div>
          <div className="mt-2 text-xs text-center">à réinjecter dans la 2e mensualité</div>
        </div>
        <div className="w-3/12 flex flex-row justify-between">
          <div className="">
            <input
              className="px-3 py-2 mb-6 w-20 text-sm text-center border border-slate-300 rounded-md"
              type="text"
              name=""
              value={data.mois4}
              onChange={(e) => onChange("mois4", e.target.value)}
              placeholder="Mois"
            />
            <div className="w-20 h-20 flex justify-center items-center bg-orange-500 rounded-full">
              <div className="text-xs text-center text-white font-bold">1ère mensualité</div>
            </div>
            <input
              className="px-1 py-2 mt-4 w-20 text-xs text-center border border-slate-300 rounded-md"
              type="number"
              name=""
              placeholder="Montant"
              min={"0"}
              value={data.mensualite1}
              onChange={(e) => onChange("mensualite1", e.target.value)}
            />
          </div>
          <div className="">
            <input
              className="px-3 py-2 mb-6 w-20 text-sm text-center border border-slate-300 rounded-md"
              type="text"
              name=""
              value={data.mois5}
              onChange={(e) => onChange("mois5", e.target.value)}
              placeholder="Mois"
            />
            <div className="w-20 h-20 flex justify-center items-center bg-orange-500 rounded-full">
              <div className="text-xs text-white text-center font-bold">2e mensualité de confort</div>
            </div>
            <input
              className="px-1 py-2 mt-4 w-20 text-xs text-center border border-slate-300 rounded-md"
              type="number"
              name=""
              min={"0"}
              value={data.mensualiteConfort}
              onChange={(e) => onChange("mensualiteConfort", e.target.value)}
              placeholder="Montant"
            />
          </div>
        </div>
      </div>
      <div className="absolute top-[50%] h-0.5 w-full bg-orange-500 z-0" />
    </div>
  );
}


