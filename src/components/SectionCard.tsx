 import React from "react";
 import { LucideIcon } from "lucide-react";
 
 interface SectionCardProps {
   title: string;
   icon?: LucideIcon;
   children: React.ReactNode;
   className?: string;
 }
 
 const SectionCard: React.FC<SectionCardProps> = ({
   title,
   icon: Icon,
   children,
   className = "",
 }) => {
   return (
     <div className={`section-card animate-slide-up ${className}`}>
       <h3 className="section-title">
         {Icon && <Icon className="w-5 h-5 text-primary" />}
         {title}
       </h3>
       {children}
     </div>
   );
 };
 
 export default SectionCard;