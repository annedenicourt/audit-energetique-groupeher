 import React from "react";
 
 interface FormTextareaProps {
   label: string;
   name: string;
   value: string;
   onChange: (value: string) => void;
   placeholder?: string;
   rows?: number;
   required?: boolean;
 }
 
 const FormTextarea: React.FC<FormTextareaProps> = ({
   label,
   name,
   value,
   onChange,
   placeholder = "",
   rows = 4,
   required = false,
 }) => {
   return (
     <div className="form-field">
       <label htmlFor={name} className="form-label">
         {label}
         {required && <span className="text-destructive ml-1">*</span>}
       </label>
       <textarea
         id={name}
         name={name}
         value={value}
         onChange={(e) => onChange(e.target.value)}
         placeholder={placeholder}
         rows={rows}
         className="form-input resize-none"
       />
     </div>
   );
 };
 
 export default FormTextarea;