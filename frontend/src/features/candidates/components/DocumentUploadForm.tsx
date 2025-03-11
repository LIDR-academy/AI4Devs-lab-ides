import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiUpload, FiFile, FiX, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { candidateService } from '../services/candidateService';

// Esquema de validación con Zod
const documentSchema = z.object({
  name: z.string().min(1, 'El nombre del documento es obligatorio'),
  type: z.enum(['CV', 'Cover Letter', 'Certificate', 'Other'], {
    errorMap: () => ({ message: 'Seleccione un tipo de documento válido' }),
  }),
  isEncrypted: z.boolean().default(true),
});

// Tipo inferido del esquema
type DocumentFormData = z.infer<typeof documentSchema>;

// Tipos de archivos permitidos
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
];

// Extensiones permitidas para mostrar al usuario
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.txt'];

// Tamaño máximo de archivo (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface DocumentUploadFormProps {
  candidateId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  candidateId,
  onSuccess,
  onCancel,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      type: 'CV',
      isEncrypted: true,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFileError(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Validar tipo de archivo
    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      setFileError(`Tipo de archivo no permitido. Formatos aceptados: ${ALLOWED_EXTENSIONS.join(', ')}`);
      setFile(null);
      return;
    }

    // Validar tamaño de archivo
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError('El archivo excede el tamaño máximo permitido (10MB)');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 1;
      if (progress > 100) progress = 100;
      setUploadProgress(progress);
      
      if (progress === 100) {
        clearInterval(interval);
      }
    }, 200);
    return interval;
  };

  const onSubmit = async (data: DocumentFormData) => {
    if (!file) {
      setFileError('Por favor, seleccione un archivo para subir');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      console.log(`Iniciando carga de documento para candidato ID: ${candidateId}`);
      
      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('type', data.type);
      formData.append('fileType', file.name.split('.').pop() || '');
      formData.append('isEncrypted', data.isEncrypted.toString());
      formData.append('file', file);

      console.log('FormData creado con los siguientes campos:');
      console.log('- name:', data.name);
      console.log('- type:', data.type);
      console.log('- fileType:', file.name.split('.').pop() || '');
      console.log('- isEncrypted:', data.isEncrypted.toString());
      console.log('- file:', file.name, '(', file.size, 'bytes )');

      // Simular progreso mientras se carga el archivo
      const progressInterval = simulateProgress();

      try {
        // Realizar la petición al backend usando el servicio de candidatos
        const response = await candidateService.uploadDocument(candidateId, formData);
        
        clearInterval(progressInterval);
        
        console.log('Respuesta de la carga de documento:', response);

        if (!response.success) {
          let errorMessage = 'Error al subir el documento';
          
          if (response.error) {
            if (typeof response.error === 'string') {
              errorMessage = response.error;
            } else if (typeof response.error === 'object') {
              errorMessage = JSON.stringify(response.error);
            }
          }
          
          throw new Error(errorMessage);
        }

        // Mostrar éxito y resetear el formulario
        setUploadProgress(100);
        setUploadSuccess(true);
        setTimeout(() => {
          reset();
          clearFile();
          setUploadSuccess(false);
          setUploadProgress(0);
          onSuccess();
        }, 1500);
      } catch (uploadError) {
        clearInterval(progressInterval);
        console.error('Error en la petición de carga:', uploadError);
        setFileError(uploadError instanceof Error ? uploadError.message : 'Error al subir el documento');
        setIsUploading(false);
        setUploadProgress(0);
      }
    } catch (error) {
      console.error('Error general al subir el documento:', error);
      setFileError(error instanceof Error ? error.message : 'Error al subir el documento');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Subir Documento</h2>
      
      {uploadSuccess && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <FiCheck className="h-5 w-5 mr-2" />
            <span className="block sm:inline">Documento subido correctamente</span>
          </div>
        </div>
      )}
      
      {fileError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{fileError}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nombre del documento */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre del documento *
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-steel-blue-500 focus:ring-steel-blue-500 sm:text-sm ${errors.name ? 'border-red-300' : ''}`}
            placeholder="Ej: CV de Juan Pérez"
            disabled={isUploading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        {/* Tipo de documento */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Tipo de documento *
          </label>
          <select
            id="type"
            {...register('type')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-steel-blue-500 focus:ring-steel-blue-500 sm:text-sm"
            disabled={isUploading}
          >
            <option value="CV">Currículum Vitae</option>
            <option value="Cover Letter">Carta de Presentación</option>
            <option value="Certificate">Certificado</option>
            <option value="Other">Otro</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>
        
        {/* Encriptación */}
        <div className="flex items-center">
          <input
            id="isEncrypted"
            type="checkbox"
            {...register('isEncrypted')}
            className="h-4 w-4 text-steel-blue-600 focus:ring-steel-blue-500 border-gray-300 rounded"
            disabled={isUploading}
          />
          <label htmlFor="isEncrypted" className="ml-2 block text-sm text-gray-700">
            Encriptar documento (recomendado para proteger la información)
          </label>
        </div>
        
        {/* Carga de archivo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Archivo *
          </label>
          
          {!file ? (
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-steel-blue-600 hover:text-steel-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-steel-blue-500"
                  >
                    <span>Seleccionar archivo</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.docx,.doc,.txt"
                      disabled={isUploading}
                    />
                  </label>
                  <p className="pl-1">o arrastrar y soltar</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOCX, DOC o TXT hasta 10MB
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-1 flex items-center p-4 border border-gray-300 rounded-md bg-gray-50">
              <FiFile className="h-8 w-8 text-steel-blue-500 mr-3" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={clearFile}
                className="ml-4 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500"
                disabled={isUploading}
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        
        {/* Barra de progreso */}
        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-steel-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1 text-center">
              {uploadProgress < 100 
                ? `Subiendo... ${uploadProgress}%` 
                : 'Procesando documento...'}
            </p>
          </div>
        )}
        
        {/* Botones */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-steel-blue-500"
            disabled={isUploading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isUploading || !file}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-steel-blue-600 hover:bg-steel-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-steel-blue-500 disabled:opacity-50"
          >
            {isUploading ? 'Subiendo...' : 'Subir documento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentUploadForm; 