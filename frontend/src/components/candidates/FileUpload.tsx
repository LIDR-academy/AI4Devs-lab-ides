import React, { useState, useRef } from 'react';
import Icon from '../common/Icon';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // en bytes
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  accept = '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  maxSize = 5 * 1024 * 1024, // 5MB por defecto
  label,
  hint,
  error: externalError,
  required = false
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [internalError, setInternalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropAreaId = `file-drop-${Math.random().toString(36).substring(2, 9)}`;
  
  // Usar error externo o interno
  const error = externalError || internalError;

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    // Validar tipo de archivo
    const validTypes = accept.split(',');
    const fileType = file.type;
    const fileExtension = '.' + file.name.split('.').pop();
    
    const isValidType = validTypes.some(type => 
      type === fileType || type === fileExtension
    );
    
    if (!isValidType) {
      setInternalError('Tipo de archivo no permitido. Solo se aceptan PDF y DOCX.');
      return false;
    }
    
    // Validar tamaño
    if (file.size > maxSize) {
      setInternalError(`El archivo excede el tamaño máximo permitido (${maxSize / (1024 * 1024)}MB).`);
      return false;
    }
    
    setInternalError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      if (validateFile(file)) {
        setFileName(file.name);
        onFileChange(file);
      } else {
        onFileChange(null);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (validateFile(file)) {
        setFileName(file.name);
        onFileChange(file);
      } else {
        onFileChange(null);
      }
    }
  };

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleRemoveFile = () => {
    setFileName('');
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // Clases para el área de drop
  const dropAreaClasses = `
    flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md 
    transition-colors duration-normal
    ${dragActive ? 'border-primary bg-primary-light bg-opacity-10' : 'border-gray-300'} 
    ${error ? 'border-error-500' : ''}
    ${!fileName ? 'hover:bg-gray-50' : ''}
  `;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={dropAreaId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-error-500">*</span>}
        </label>
      )}
      
      <div
        id={dropAreaId}
        className={dropAreaClasses}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Área para soltar archivos"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleButtonClick();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="sr-only"
          aria-label="Seleccionar archivo"
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${dropAreaId}-error` : undefined}
        />
        
        {fileName ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-2">
              <Icon name="document" size="md" className="text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">{fileName}</span>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-sm text-error-500 hover:text-error-700 transition-colors duration-normal flex items-center"
            >
              <Icon name="delete" size="sm" className="mr-1" />
              Eliminar archivo
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Icon name="upload" size="lg" className="text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">
              Arrastra y suelta un archivo aquí, o
            </p>
            <button
              type="button"
              onClick={handleButtonClick}
              className="px-3 py-1.5 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light transition-all duration-normal"
            >
              Seleccionar archivo
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <p id={`${dropAreaId}-error`} className="mt-1 text-sm text-error-500">{error}</p>
      )}
      
      {hint && !error && (
        <p className="mt-1 text-xs text-gray-500">{hint}</p>
      )}
      
      {!hint && (
        <p className="mt-1 text-xs text-gray-500">
          Formatos permitidos: PDF, DOCX. Tamaño máximo: {maxSize / (1024 * 1024)}MB.
        </p>
      )}
    </div>
  );
};

export default FileUpload; 