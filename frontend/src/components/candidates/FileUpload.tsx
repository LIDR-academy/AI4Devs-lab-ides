import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // en bytes
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  accept = '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  maxSize = 5 * 1024 * 1024 // 5MB por defecto
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      setError('Tipo de archivo no permitido. Solo se aceptan PDF y DOCX.');
      return false;
    }
    
    // Validar tamaño
    if (file.size > maxSize) {
      setError(`El archivo excede el tamaño máximo permitido (${maxSize / (1024 * 1024)}MB).`);
      return false;
    }
    
    setError(null);
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

  return (
    <div className="mt-1">
      <div
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${error ? 'border-red-500' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        
        {fileName ? (
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">{fileName}</span>
            </p>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Eliminar archivo
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-2">
              Arrastra y suelta un archivo aquí, o
            </p>
            <button
              type="button"
              onClick={handleButtonClick}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Seleccionar archivo
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      <p className="mt-1 text-xs text-gray-500">
        Formatos permitidos: PDF, DOCX. Tamaño máximo: {maxSize / (1024 * 1024)}MB.
      </p>
    </div>
  );
};

export default FileUpload; 