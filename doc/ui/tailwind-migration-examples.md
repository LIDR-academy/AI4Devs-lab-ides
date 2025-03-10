# Ejemplos de Migración a Tailwind CSS

Este documento muestra ejemplos de cómo migrar componentes específicos de CSS personalizado a Tailwind CSS.

## FormField.tsx

### Versión Actual (Mezcla de CSS personalizado y Tailwind)

```tsx
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
    <div className={`form-group ${className}`}>
      <label 
        htmlFor={id} 
        className={`form-label block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
      >
        {label}
        {required && <span className="required text-error ml-1">*</span>}
      </label>
      
      {children}
      
      {error && (
        <div 
          className="form-error text-sm text-error mt-1" 
          id={`${id}-error`}
        >
          {error}
        </div>
      )}
      
      {hint && !error && (
        <div 
          className="form-hint text-sm text-gray-500 mt-1"
          id={`${id}-hint`}
        >
          {hint}
        </div>
      )}
    </div>
  );
};

export default FormField;
```

### Versión Migrada (Solo Tailwind CSS)

```tsx
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
```

## FileUploadField.tsx (Ejemplo Parcial)

### Versión Actual (Con CSS personalizado)

```tsx
// Fragmento del componente
<div className="file-upload-field">
  <label className="field-label">
    {label}
    {required && <span className="required">*</span>}
  </label>
  
  <div 
    className={`file-upload-area ${isDragActive ? 'drag-active' : ''} ${error ? 'has-error' : ''}`}
    onDragOver={handleDrag}
    onDragEnter={handleDrag}
    onDragLeave={handleDrag}
    onDrop={handleDrop}
  >
    <input 
      type="file"
      id={id}
      name={name}
      className="file-input"
      onChange={handleChange}
      accept={acceptedFileTypes}
      disabled={disabled}
      ref={fileInputRef}
    />
    
    {!value && (
      <div className="upload-placeholder">
        <div className="upload-icon">
          <svg>...</svg>
        </div>
        <p className="upload-text">
          Arrastra y suelta un archivo aquí, o
        </p>
        <button 
          type="button" 
          className="upload-button"
          onClick={handleButtonClick}
          disabled={disabled}
        >
          Seleccionar archivo
        </button>
        <p className="upload-hint">
          Formatos aceptados: {acceptedFileTypes}. Tamaño máximo: {maxSizeMB} MB
        </p>
      </div>
    )}
    
    {/* Resto del componente */}
  </div>
</div>
```

### Versión Migrada (Con Tailwind CSS)

```tsx
// Fragmento del componente
<div className="mb-6">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {label}
    {required && <span className="text-error-500 ml-1">*</span>}
  </label>
  
  <div 
    className={`border-2 border-dashed rounded-lg p-6 text-center bg-gray-50 transition-all
      ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'} 
      ${error ? 'border-error-500' : ''}
      ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    onDragOver={handleDrag}
    onDragEnter={handleDrag}
    onDragLeave={handleDrag}
    onDrop={handleDrop}
  >
    <input 
      type="file"
      id={id}
      name={name}
      className="sr-only"
      onChange={handleChange}
      accept={acceptedFileTypes}
      disabled={disabled}
      ref={fileInputRef}
    />
    
    {!value && (
      <div className="space-y-3">
        <div className="mx-auto w-12 h-12 text-gray-400">
          <svg className="w-full h-full">...</svg>
        </div>
        <p className="text-sm text-gray-600">
          Arrastra y suelta un archivo aquí, o
        </p>
        <button 
          type="button" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleButtonClick}
          disabled={disabled}
        >
          Seleccionar archivo
        </button>
        <p className="text-xs text-gray-500">
          Formatos aceptados: {acceptedFileTypes}. Tamaño máximo: {maxSizeMB} MB
        </p>
      </div>
    )}
    
    {/* Resto del componente */}
  </div>
</div>
```

## CandidateCard.tsx (Ejemplo Parcial)

### Versión Actual (Con CSS personalizado)

```tsx
<div className={`candidate-card ${className}`}>
  <div className="candidate-header">
    <div className="candidate-avatar" style={{ backgroundColor: getAvatarColor(`${firstName} ${lastName}`) }}>
      {firstName.charAt(0)}{lastName.charAt(0)}
    </div>
    <div className="candidate-info">
      <h3 className="candidate-name">{firstName} {lastName}</h3>
      {position && <p className="candidate-position">{position}</p>}
    </div>
  </div>
  
  <div className="candidate-body">
    <div className="candidate-contact">
      <div className="contact-item">
        <span className="contact-icon">
          <svg>...</svg>
        </span>
        <span className="contact-text">{email}</span>
      </div>
      
      {phone && (
        <div className="contact-item">
          <span className="contact-icon">
            <svg>...</svg>
          </span>
          <span className="contact-text">{phone}</span>
        </div>
      )}
    </div>
    
    {/* Resto del componente */}
  </div>
</div>
```

### Versión Migrada (Con Tailwind CSS)

```tsx
<div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
  <div className="p-4 flex items-center space-x-4">
    <div 
      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-lg"
      style={{ backgroundColor: getAvatarColor(`${firstName} ${lastName}`) }}
    >
      {firstName.charAt(0)}{lastName.charAt(0)}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{firstName} {lastName}</h3>
      {position && <p className="text-sm text-gray-600">{position}</p>}
    </div>
  </div>
  
  <div className="px-4 pb-4">
    <div className="space-y-2">
      <div className="flex items-center text-sm">
        <span className="text-gray-500 w-5 h-5 mr-2">
          <svg className="w-full h-full">...</svg>
        </span>
        <span className="text-gray-700">{email}</span>
      </div>
      
      {phone && (
        <div className="flex items-center text-sm">
          <span className="text-gray-500 w-5 h-5 mr-2">
            <svg className="w-full h-full">...</svg>
          </span>
          <span className="text-gray-700">{phone}</span>
        </div>
      )}
    </div>
    
    {/* Resto del componente */}
  </div>
</div>
``` 