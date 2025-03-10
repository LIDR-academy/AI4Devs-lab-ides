import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  error?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className = '',
  options = [],
  error = false,
  disabled = false,
  placeholder,
  icon,
  ...props
}, ref) => {
  // Clases base
  const baseClasses = 'w-full px-3 py-2 text-gray-900 border rounded-md focus:outline-none appearance-none transition-all duration-normal';
  
  // Clases según estado
  const stateClasses = error
    ? 'border-error-500 focus:border-error-500 focus:ring-2 focus:ring-error-500 focus:ring-opacity-30'
    : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30';
  
  // Clases para estado deshabilitado
  const disabledClasses = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : '';
  
  // Clases para icono
  const iconClasses = icon ? 'pl-10' : '';
  
  // Combinar todas las clases
  const selectClasses = `${baseClasses} ${stateClasses} ${disabledClasses} ${iconClasses} ${className}`;
  
  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
          {icon}
        </div>
      )}
      
      <select
        ref={ref}
        className={selectClasses}
        disabled={disabled}
        aria-invalid={error}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Flecha personalizada */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
});

Select.displayName = 'Select';

export default Select; 