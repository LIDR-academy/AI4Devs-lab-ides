import React, { forwardRef } from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: boolean;
  hint?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  className = '',
  label,
  error = false,
  disabled = false,
  hint,
  id,
  ...props
}, ref) => {
  // Clases base para el input
  const inputBaseClasses = 'h-4 w-4 rounded border focus:outline-none focus:ring-2 transition-all duration-normal';
  
  // Clases según estado para el input
  const inputStateClasses = error
    ? 'border-error-500 text-error-500 focus:border-error-500 focus:ring-error-500 focus:ring-opacity-30'
    : 'border-gray-300 text-primary focus:border-primary focus:ring-primary focus:ring-opacity-30';
  
  // Clases para estado deshabilitado para el input
  const inputDisabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  
  // Combinar todas las clases para el input
  const inputClasses = `${inputBaseClasses} ${inputStateClasses} ${inputDisabledClasses} ${className}`;
  
  // Clases para el label
  const labelClasses = `ml-2 text-sm ${disabled ? 'text-gray-500' : 'text-gray-700'}`;
  
  // Generar un ID único si no se proporciona
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div>
      <div className="flex items-center">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={inputClasses}
          disabled={disabled}
          aria-invalid={error}
          aria-describedby={hint || error ? `${checkboxId}-description` : undefined}
          {...props}
        />
        <label htmlFor={checkboxId} className={labelClasses}>
          {label}
        </label>
      </div>
      
      {(hint || error) && (
        <div 
          id={`${checkboxId}-description`}
          className={`mt-1 text-sm ${error ? 'text-error-500' : 'text-gray-500'}`}
        >
          {error || hint}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox; 