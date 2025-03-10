import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  disabled,
  type = 'button',
  ...props
}) => {
  // Clases base
  const baseClasses = 'btn inline-flex items-center justify-center font-medium transition-all focus:outline-none focus-visible';
  
  // Clases según variante
  const variantClasses = {
    primary: 'btn-primary text-white bg-primary border-primary hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-opacity-50',
    secondary: 'btn-secondary text-primary bg-transparent border border-primary hover:bg-primary-light hover:bg-opacity-10 focus:ring-2 focus:ring-primary focus:ring-opacity-30',
    tertiary: 'btn-tertiary text-primary bg-transparent border-transparent hover:bg-primary-light hover:bg-opacity-10 focus:ring-2 focus:ring-primary focus:ring-opacity-30',
    danger: 'btn-danger text-white bg-error border-error hover:bg-error-dark focus:ring-2 focus:ring-error focus:ring-opacity-50',
  };
  
  // Clases según tamaño
  const sizeClasses = {
    sm: 'btn-sm text-sm py-1 px-3 rounded-md',
    md: 'text-base py-2 px-4 rounded-md',
    lg: 'text-lg py-3 px-6 rounded-md',
  };
  
  // Clases para ancho completo
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Clases para estado deshabilitado
  const disabledClasses = (disabled || isLoading) ? 'opacity-70 cursor-not-allowed' : '';
  
  // Combinar todas las clases
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${disabledClasses} ${className}`;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="spinner mr-2 -ml-1 w-5 h-5 animate-spin" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {!isLoading && icon && iconPosition === 'left' && (
        <span className="mr-2 -ml-1">{icon}</span>
      )}
      
      {children}
      
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="ml-2 -mr-1">{icon}</span>
      )}
    </button>
  );
};

export default Button; 