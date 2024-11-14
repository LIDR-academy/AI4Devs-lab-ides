import React from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, error }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      alert('Por favor, sube un archivo PDF o DOCX');
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo no debe superar los 5MB');
      return;
    }

    onFileSelect(file);
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}; 