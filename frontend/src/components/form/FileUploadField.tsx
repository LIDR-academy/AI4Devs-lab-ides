import React, { useState, useRef, useEffect } from 'react';
import Icon from '../common/Icon';

// Interfaces
export interface FileUploadFieldProps {
  value: File | null;
  onChange: (file: File | null) => void;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
  required?: boolean;
  showPreview?: boolean;
  label?: string;
  name?: string;
  id?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
}

// Componente principal
const FileUploadField: React.FC<FileUploadFieldProps> = ({
  value,
  onChange,
  acceptedFileTypes = '.pdf,.doc,.docx',
  maxSizeMB = 5,
  required = false,
  showPreview = true,
  label = 'Subir CV',
  name = 'cv',
  id = 'cv-upload',
  error,
  hint,
  disabled = false,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  // ID para mensajes de estado
  const statusId = `${id}-status`;
  const errorId = `${id}-error`;
  
  // Efecto para limpiar la URL del objeto cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
  // Efecto para generar la vista previa cuando cambia el archivo
  useEffect(() => {
    if (value && showPreview) {
      // Limpiar la URL anterior si existe
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Crear una URL para el archivo
      const objectUrl = URL.createObjectURL(value);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [value, showPreview]);
  
  // Simulación de carga para demostración
  const simulateUpload = () => {
    setIsUploading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  // Validar el archivo
  const validateFile = (file: File): boolean => {
    // Validar tipo de archivo
    const fileType = file.type;
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    const acceptedTypes = acceptedFileTypes.split(',').map(type => 
      type.trim().replace('.', '')
    );
    
    const isValidType = acceptedTypes.some(type => 
      fileType.includes(type) || (fileExtension && type.includes(fileExtension))
    );
    
    if (!isValidType) {
      setFileError(`Tipo de archivo no válido. Por favor, sube un archivo ${acceptedFileTypes}`);
      return false;
    }
    
    // Validar tamaño de archivo
    if (file.size > maxSizeBytes) {
      setFileError(`El archivo es demasiado grande. El tamaño máximo es ${maxSizeMB} MB`);
      return false;
    }
    
    setFileError(null);
    return true;
  };
  
  // Manejadores de eventos
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };
  
  const handleFile = (file: File) => {
    if (validateFile(file)) {
      onChange(file);
      simulateUpload();
      // Anunciar para lectores de pantalla
      announceStatus(`Archivo ${file.name} seleccionado y cargando.`);
    } else {
      onChange(null);
      // Anunciar error para lectores de pantalla
      if (fileError) {
        announceStatus(fileError, true);
      }
    }
  };
  
  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  
  const handleRemoveFile = () => {
    onChange(null);
    setFileError(null);
    setProgress(0);
    setIsUploading(false);
    
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    
    // Anunciar para lectores de pantalla
    announceStatus('Archivo eliminado.');
  };
  
  // Función para anunciar estados a lectores de pantalla
  const announceStatus = (message: string, isError = false) => {
    const statusElement = document.getElementById(isError ? errorId : statusId);
    if (statusElement) {
      statusElement.textContent = message;
    }
  };
  
  // Actualizar el mensaje de estado cuando cambia el progreso
  useEffect(() => {
    if (isUploading && value) {
      announceStatus(`Cargando archivo ${value.name}, ${progress}% completado.`);
    } else if (progress === 100 && value) {
      announceStatus(`Archivo ${value.name} cargado correctamente.`);
    }
  }, [progress, isUploading, value]);
  
  // Formatear el tamaño del archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Obtener el icono según el tipo de archivo
  const getFileIcon = (): JSX.Element => {
    if (!value) return <></>;
    
    const fileType = value.type;
    
    if (fileType.includes('pdf')) {
      return <Icon name="document" size="lg" className="text-red-600" />;
    } else if (fileType.includes('word') || fileType.includes('doc')) {
      return <Icon name="document" size="lg" className="text-blue-700" />;
    } else {
      return <Icon name="document" size="lg" className="text-gray-500" />;
    }
  };
  
  return (
    <div className="mb-8">
      <label htmlFor={id} className="block text-base font-semibold text-gray-900 mb-2">
        {label} {required && <span className="text-error-500 ml-1">*</span>}
      </label>
      
      {/* Área de arrastrar y soltar */}
      <div 
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-gray-50 transition-all duration-fast cursor-pointer
          ${dragActive ? 'border-primary bg-primary-50' : 'border-gray-300 hover:border-primary hover:bg-primary-50/50'} 
          ${(fileError || error) ? 'border-error-500 bg-error-50/50' : ''}
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onKeyDown={(e) => {
          // Permitir activar el área con Enter o Space
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleButtonClick();
          }
        }}
        tabIndex={0}
        role="button"
        aria-controls={id}
        aria-describedby={`${id}-description ${statusId}`}
      >
        <input
          ref={inputRef}
          type="file"
          id={id}
          name={name}
          className="sr-only"
          accept={acceptedFileTypes}
          onChange={handleChange}
          aria-invalid={!!(fileError || error)}
          aria-describedby={`${id}-description ${fileError || error ? errorId : ''}`}
          aria-required={required}
        />
        
        {!value ? (
          // Estado sin archivo
          <div className="flex flex-col items-center text-center">
            <Icon name="upload" size="xl" className="w-12 h-12 text-primary mb-4" />
            <p className="text-base text-gray-700 mb-2">
              Arrastra y suelta tu CV aquí o <button type="button" className="text-primary font-semibold underline hover:text-primary-dark" onClick={handleButtonClick}>selecciona un archivo</button>
            </p>
            <p className="text-sm text-gray-500" id={`${id}-description`}>
              Formatos aceptados: {acceptedFileTypes}. Tamaño máximo: {maxSizeMB} MB
            </p>
          </div>
        ) : (
          // Estado con archivo
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center gap-4">
              {getFileIcon()}
              <div className="flex-1">
                <p className="text-base font-medium text-gray-900 mb-1 break-words">{value.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(value.size)}</p>
              </div>
            </div>
            
            {isUploading ? (
              // Barra de progreso
              <div className="flex items-center gap-4 w-full">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700 min-w-[40px] text-right">{progress}%</span>
              </div>
            ) : (
              // Acciones del archivo
              <div className="flex gap-4 md:flex-row flex-col">
                {showPreview && previewUrl && (
                  <a 
                    href={previewUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 text-sm font-medium text-primary bg-primary-100 rounded-md hover:bg-primary-200 transition-colors duration-fast"
                    aria-label={`Ver archivo ${value.name}`}
                  >
                    <Icon name="view" size="sm" />
                    Ver
                  </a>
                )}
                <button 
                  type="button" 
                  className="inline-flex items-center gap-1 px-2 py-1 text-sm font-medium text-error-500 bg-error-100 rounded-md hover:bg-error-200 transition-colors duration-fast"
                  onClick={handleRemoveFile}
                  aria-label={`Eliminar archivo ${value.name}`}
                >
                  <Icon name="delete" size="sm" />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Mensajes de estado para lectores de pantalla */}
      <div 
        id={statusId} 
        className="sr-only" 
        aria-live="polite"
        aria-atomic="true"
      ></div>
      
      {/* Mensaje de error */}
      {(fileError || error) && (
        <div 
          className="mt-1 text-sm text-error-500" 
          id={errorId}
          aria-live="assertive"
          role="alert"
        >
          {fileError || error}
        </div>
      )}

      {/* Mensaje de ayuda */}
      {hint && !fileError && !error && (
        <div className="mt-1 text-sm text-gray-500">
          {hint}
        </div>
      )}
    </div>
  );
};

export default FileUploadField; 