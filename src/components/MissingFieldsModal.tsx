import React from "react";
import AppModal from "./Modal";
import { MissingField } from "@/utils/validateSimulation";
import { CircleArrowRight, Info } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  missingFields: MissingField[];
  onGoToStep?: (step: number) => void;
}

const MissingFieldsModal: React.FC<Props> = ({ isOpen, onClose, missingFields, onGoToStep }) => {
  // Grouper par step
  const grouped = missingFields.reduce<Record<number, MissingField[]>>(
    (fieldsByStep, field) => {
      if (!fieldsByStep[field.step]) {
        fieldsByStep[field.step] = [];
      }
      fieldsByStep[field.step].push(field);
      return fieldsByStep;
    },
    {}
  );
  return (
    <AppModal isOpen={isOpen} onClose={onClose} title="Champs obligatoires manquants"
      className="bg-white rounded-xl shadow-xl max-w-lg max-h-[80vh] overflow-auto outline-none p-6"
    >
      <p className="text-sm text-muted-foreground mb-4">
        Veuillez compléter les informations suivantes avant de continuer :
      </p>

      {Object.entries(grouped).map(([step, fields]) => (
        <div key={step} className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold">
              Étape {step} — {fields[0].stepLabel}
            </h3>
            {onGoToStep && (
              <button
                className="flex items-center text-xs font-bold hover:underline"
                onClick={() => { onGoToStep(Number(step)); onClose(); }}
              >
                Aller à l'étape
                <CircleArrowRight size={18} className="ml-1" />
              </button>
            )}
          </div>
          <div>
            {fields.map((field) => (
              <div key={field.fieldKey} className="mb-1 ml-4 flex items-center">
                <Info size={18} className="text-red-500" />
                <div className="ml-3 text-sm ">{field.fieldLabel}</div>
              </div>
            ))}
          </div>
        </div>
      ))
      }
    </AppModal >
  );
};

export default MissingFieldsModal;
