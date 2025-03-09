import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import Alert from '../common/Alert';
import { createCandidate, updateCandidate, getCandidateById } from '../../services/candidateService';

interface CandidateFormProps {
  candidateId?: number;
  onSuccess?: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  workExperience: string;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ candidateId, onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    workExperience: ''
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const isEditMode = !!candidateId;

  useEffect(() => {
    // Si estamos en modo edición, cargar los datos del candidato
    if (isEditMode) {
      const loadCandidate = async () => {
        try {
          setLoading(true);
          const candidate = await getCandidateById(candidateId);
          setFormData({
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            phone: candidate.phone || '',
            address: candidate.address || '',
            education: candidate.education || '',
            workExperience: candidate.workExperience || ''
          });
          setLoading(false);
        } catch (err) {
          setError('Error al cargar los datos del candidato');
          setLoading(false);
        }
      };
      
      loadCandidate();
    }
  }, [candidateId, isEditMode]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'El nombre es obligatorio';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'El apellido es obligatorio';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El formato del email no es válido';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error de validación al editar el campo
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Crear FormData para enviar datos y archivo
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      
      if (file) {
        data.append('cv', file);
      }
      
      // Enviar datos al servidor
      if (isEditMode) {
        await updateCandidate(candidateId, data);
        setSuccess('Candidato actualizado correctamente');
      } else {
        await createCandidate(data);
        setSuccess('Candidato añadido correctamente');
        
        // Limpiar formulario después de añadir
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          education: '',
          workExperience: ''
        });
        setFile(null);
      }
      
      // Llamar al callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditMode ? 'Editar Candidato' : 'Añadir Nuevo Candidato'}
      </h2>
      
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Nombre *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                validationErrors.firstName ? 'border-red-500' : ''
              }`}
            />
            {validationErrors.firstName && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
            )}
          </div>
          
          {/* Apellido */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Apellido *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                validationErrors.lastName ? 'border-red-500' : ''
              }`}
            />
            {validationErrors.lastName && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
            )}
          </div>
          
          {/* Email */}
          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                validationErrors.email ? 'border-red-500' : ''
              }`}
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
            )}
          </div>
          
          {/* Teléfono */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          {/* Dirección */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          {/* Educación */}
          <div className="md:col-span-2">
            <label htmlFor="education" className="block text-sm font-medium text-gray-700">
              Educación
            </label>
            <textarea
              id="education"
              name="education"
              rows={3}
              value={formData.education}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          {/* Experiencia Laboral */}
          <div className="md:col-span-2">
            <label htmlFor="workExperience" className="block text-sm font-medium text-gray-700">
              Experiencia Laboral
            </label>
            <textarea
              id="workExperience"
              name="workExperience"
              rows={3}
              value={formData.workExperience}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          {/* Subida de CV */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              CV (PDF o DOCX, máx. 5MB)
            </label>
            <FileUpload onFileChange={handleFileChange} />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <span>Procesando...</span>
            ) : isEditMode ? (
              'Actualizar Candidato'
            ) : (
              'Añadir Candidato'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm; 