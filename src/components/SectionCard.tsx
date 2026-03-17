import React from "react";
import { CircleAlert, LucideIcon, SquareArrowOutUpRight } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

interface SectionCardProps {
  title?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  link?: string[]
  textLink?: string[];
  legend?: string;
  showCheckbox?: boolean;
  checkboxChecked?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
  checkboxLabel?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon: Icon,
  children,
  className = "",
  link = [],
  textLink = [],
  legend = "",
  showCheckbox = false,
  checkboxChecked = false,
  onCheckboxChange,
  checkboxLabel,

}) => {
  return (
    <div className={`section-card animate-slide-up ${className}`}>
      <div className="flex flex-row items-center mb-4">
        {showCheckbox && (
          <Checkbox checked={checkboxChecked} onCheckedChange={(checked) =>
            onCheckboxChange?.(checked === true)
          } className="mr-3 w-5 h-5 rounded data-[state=checked]:bg-green-500 data-[state=checked]:border-0" title="Sélectionner ce produit" />
        )}
        <h3 className="section-title mr-3">
          {Icon && <Icon className="w-5 h-5 text-primary" />}
          {title}
        </h3>

        {link && (
          <div className="flex gap-1">
            {(Array.isArray(link) ? link : [link]).map((item, index) => (
              <a
                key={index}
                href={item}
                target="_blank"
                rel="noopener"
                className="ml-2 flex text-xs mr-1 underline"
              >
                <span className="mr-1 underline">{textLink[index]}</span>
                <SquareArrowOutUpRight size={18} />
              </a>
            ))}
          </div>
        )}
        {legend &&
          <button className="py-1 px-2 flex items-center font-semibold text-xs text-white bg-orange-500 rounded-md gap-2 cursor-default">
            <CircleAlert size={15} />
            {legend}
          </button>
        }
      </div>

      {children}
    </div>
  );
};

export default SectionCard;