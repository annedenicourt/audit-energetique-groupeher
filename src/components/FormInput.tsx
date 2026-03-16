import { read } from "fs";
import React from "react";

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange?: (value: string) => void;
  type?: "text" | "number" | "email" | "tel" | "password";
  placeholder?: string;
  suffix?: string;
  required?: boolean;
  className?: string;
  readonly?: boolean;
  min?: string;
  max?: string;
  isMissing?: boolean;
  isFocus?: boolean;
  isWarning?: boolean,

}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  value,
  readonly,
  onChange,
  type = "text",
  placeholder = "",
  suffix,
  required = false,
  className,
  min,
  max,
  isMissing = false,
  isFocus = false,
  isWarning = false,
}) => {
  return (
    <div className={`form-field ${className}`} >
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`form-input ${suffix ? "pr-14" : ""} ${isMissing && "is-missing"} ${isFocus && "is-focus"} ${isWarning && "is-warning"}`}
          readOnly={readonly}
          step={1}
          min={min}
          max={max}
          autoComplete="off"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

export default FormInput;