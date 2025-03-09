import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../ui/Button';

interface DocumentUploadProps {
  candidateId: number;
  onUploadSuccess: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ candidateId, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('CV');
  const [isEncrypted, setIsEncrypted] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto-fill name field with file name (without extension)
      const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
      if (!name) {
        setName(fileName);
      }
    }
  };

  const getFileType = (file: File): string => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'doc':
        return 'doc';
      case 'docx':
        return 'docx';
      case 'txt':
        return 'txt';
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Por favor seleccione un archivo');
      return;
    }

    if (!name) {
      toast.error('Por favor ingrese un nombre para el documento');
      return;
    }

    const fileType = getFileType(file);
    if (!fileType) {
      toast.error('Tipo de archivo no soportado. Solo se permiten PDF, DOC, DOCX y TXT');
      return;
    }

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      formData.append('type', type);
      formData.append('fileType', fileType);
      formData.append('isEncrypted', isEncrypted.toString());

      const response = await fetch(`http://localhost:3010/api/candidates/${candidateId}/documents`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error al subir el documento');
      }

      toast.success('Documento subido exitosamente');
      setFile(null);
      setName('');
      setType('CV');
      onUploadSuccess();
    } catch (error) {
      console.error('Error al subir documento:', error);
      toast.error(error instanceof Error ? error.message : 'Error al subir el documento');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Subir Documento</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Archivo
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {file && (
            <p className="mt-1 text-sm text-gray-500">
              Archivo seleccionado: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Documento
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: CV de Juan Pérez"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Documento
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CV">CV</option>
            <option value="Cover Letter">Carta de Presentación</option>
            <option value="Certificate">Certificado</option>
            <option value="Other">Otro</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isEncrypted"
            checked={isEncrypted}
            onChange={(e) => setIsEncrypted(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isEncrypted" className="ml-2 block text-sm text-gray-700">
            Encriptar documento
          </label>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? 'Subiendo...' : 'Subir Documento'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DocumentUpload; 