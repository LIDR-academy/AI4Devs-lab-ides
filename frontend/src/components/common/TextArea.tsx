import React, { forwardRef } from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  rows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  className = '',
  error = false,
  disabled = false,
  rows = 4,
  resize = 'vertical',
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
  
  // Clases para resize
  const resizeClasses = `resize-${resize}`;
  
  // Combinar todas las clases
  const textareaClasses = `${baseClasses} ${stateClasses} ${disabledClasses} ${resizeClasses} ${className}`;
  
  return (
    <textarea
      ref={ref}
      className={textareaClasses}
      disabled={disabled}
      rows={rows}
      aria-invalid={error}
      {...props}
    />
  );
});

TextArea.displayName = 'TextArea';

export default TextArea; 