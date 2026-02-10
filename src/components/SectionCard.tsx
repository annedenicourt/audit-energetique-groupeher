import React from "react";
import { LucideIcon, SquareArrowOutUpRight } from "lucide-react";

interface SectionCardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  link?: string;
  textLink?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon: Icon,
  children,
  className = "",
  link = "",
  textLink = ""

}) => {
  return (
    <div className={`section-card animate-slide-up ${className}`}>
      <div className="flex flex-row items-center mb-4">
        <h3 className="section-title">
          {Icon && <Icon className="w-5 h-5 text-primary" />}
          {title}
        </h3>
        {link &&
          <a href={link} target="_blank" className="ml-3 flex text-sm">
            <span className="mr-1 underline">{textLink}</span>
            <SquareArrowOutUpRight size={20} />
          </a>
        }
      </div>

      {children}
    </div>
  );
};

export default SectionCard;