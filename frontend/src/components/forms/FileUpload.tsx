import React, { useState, useRef } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  onChange: (file: File | null) => void;
  maxSize: number;
  acceptedTypes: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({ onChange, maxSize, acceptedTypes }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (selectedFile: File): boolean => {
    if (selectedFile.size > maxSize) {
      setError(`El archivo excede el tamaño máximo de ${maxSize / (1024 * 1024)}MB`);
      return false;
    }
    
    const fileExtension = `.${selectedFile.name.split('.').pop()?.toLowerCase()}`;
    if (!acceptedTypes.includes(fileExtension)) {
      setError(`Tipo de archivo no permitido. Formatos aceptados: ${acceptedTypes.join(', ')}`);
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        onChange(selectedFile);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        onChange(selectedFile);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-container">
      <div 
        className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept={acceptedTypes.join(',')}
          style={{ display: 'none' }}
        />
        
        {file ? (
          <div className="file-info">
            <span className="file-name">{file.name}</span>
            <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
          </div>
        ) : (
          <>
            <div className="upload-icon">📁</div>
            <p>Arrastra y suelta tu archivo aquí o haz clic para seleccionarlo</p>
            <p className="file-types">Tipos permitidos: {acceptedTypes.join(', ')}</p>
          </>
        )}
      </div>
      
      {error && <div className="file-error">{error}</div>}
      
      {file && (
        <button 
          className="btn btn-secondary remove-file-btn"
          onClick={(e) => {
            e.stopPropagation();
            setFile(null);
            onChange(null);
          }}
        >
          Eliminar archivo
        </button>
      )}
    </div>
  );
};

export default FileUpload; 