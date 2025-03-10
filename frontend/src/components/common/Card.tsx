import React from 'react';

export interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  hoverable?: boolean;
  bordered?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  hoverable = false,
  bordered = true,
  shadow = 'md',
}) => {
  // Clases base
  const baseClasses = 'bg-white rounded-lg overflow-hidden';
  
  // Clases para bordes
  const borderClasses = bordered ? 'border border-gray-200' : '';
  
  // Clases para sombras
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };
  
  // Clases para hover
  const hoverClasses = hoverable ? 'transition-all duration-normal hover:shadow-lg' : '';
  
  // Combinar todas las clases
  const cardClasses = `${baseClasses} ${borderClasses} ${shadowClasses[shadow]} ${hoverClasses} ${className}`;
  
  return (
    <div className={cardClasses}>
      {(title || subtitle) && (
        <div className={`p-4 border-b border-gray-200 ${headerClassName}`}>
          {title && (
            typeof title === 'string' 
              ? <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              : title
          )}
          {subtitle && (
            typeof subtitle === 'string'
              ? <div className="mt-1 text-sm text-gray-600">{subtitle}</div>
              : subtitle
          )}
        </div>
      )}
      
      <div className={`p-4 ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`p-4 border-t border-gray-200 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 