import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className = '',
  error = false,
  icon,
  iconPosition = 'left',
  disabled = false,
  ...props
}, ref) => {
  // Clases base
  const baseClasses = 'w-full px-3 py-2 text-gray-900 placeholder-gray-400 border rounded-md focus:outline-none transition-all duration-normal';
  
  // Clases según estado
  const stateClasses = error
    ? 'border-error-500 focus:border-error-500 focus:ring-2 focus:ring-error-500 focus:ring-opacity-30'
    : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30';
  
  // Clases para estado deshabilitado
  const disabledClasses = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : '';
  
  // Clases para icono
  const iconClasses = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';
  
  // Combinar todas las clases
  const inputClasses = `${baseClasses} ${stateClasses} ${disabledClasses} ${iconClasses} ${className}`;
  
  return (
    <div className="relative">
      {icon && iconPosition === 'left' && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
          {icon}
        </div>
      )}
      
      <input
        ref={ref}
        className={inputClasses}
        disabled={disabled}
        aria-invalid={error}
        {...props}
      />
      
      {icon && iconPosition === 'right' && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
          {icon}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 