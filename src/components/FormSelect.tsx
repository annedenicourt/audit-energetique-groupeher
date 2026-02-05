 import React from "react";
 
 interface Option {
   value: string;
   label: string;
 }
 
 interface FormSelectProps {
   label: string;
   name: string;
   value: string;
   onChange: (value: string) => void;
   options: Option[];
   placeholder?: string;
   required?: boolean;
 }
 
 const FormSelect: React.FC<FormSelectProps> = ({
   label,
   name,
   value,
   onChange,
   options,
   placeholder = "Sélectionner...",
   required = false,
 }) => {
   return (
     <div className="form-field">
       <label htmlFor={name} className="form-label">
         {label}
         {required && <span className="text-destructive ml-1">*</span>}
       </label>
       <select
         id={name}
         name={name}
         value={value}
         onChange={(e) => onChange(e.target.value)}
         className="form-select"
       >
         <option value="">{placeholder}</option>
         {options.map((option) => (
           <option key={option.value} value={option.value}>
             {option.label}
           </option>
         ))}
       </select>
     </div>
   );
 };
 
 export default FormSelect;