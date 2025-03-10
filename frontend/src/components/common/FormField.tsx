import React from 'react';

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  labelClassName?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  error,
  required = false,
  hint,
  className = '',
  labelClassName = '',
  children,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={id} 
        className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
      >
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
      
      {children}
      
      {error && (
        <div 
          className="text-sm text-error-500 mt-1" 
          id={`${id}-error`}
          aria-live="polite"
        >
          {error}
        </div>
      )}
      
      {hint && !error && (
        <div 
          className="text-sm text-gray-500 mt-1"
          id={`${id}-hint`}
        >
          {hint}
        </div>
      )}
    </div>
  );
};

export default FormField; 