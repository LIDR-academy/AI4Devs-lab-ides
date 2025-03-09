import React, { useState, useEffect } from 'react';
import { CandidateFormData } from '../../types/candidate';
import useFormState from '../../hooks/useFormState';
import useFormValidation from '../../hooks/useFormValidation';
import { candidateApi } from '../../services/api';

// Initial form state
const initialFormState: CandidateFormData = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  direccion: '',
  educacion: '',
  experiencia: '',
};

// Validation rules
const validationRules = {
  nombre: { required: true, minLength: 2, maxLength: 50 },
  apellido: { required: true, minLength: 2, maxLength: 50 },
  email: { required: true, isEmail: true },
  telefono: { pattern: /^[0-9+\-\s()]*$/ },
  educacion: { required: true },
  experiencia: { required: true },
  cv: { 
    isFile: true, 
    allowedFileTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxFileSize: 5 * 1024 * 1024 // 5MB
  }
};

interface CandidateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ onSuccess, onCancel }) => {
  // Form state and validation hooks
  const { formData, handleInputChange, handleFileChange, resetForm } = useFormState(initialFormState);
  const { errors, validateForm, validateField, setErrors } = useFormValidation();
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Options for select fields
  const [educationOptions, setEducationOptions] = useState<string[]>([]);
  const [experienceOptions, setExperienceOptions] = useState<string[]>([]);
  
  // Load options on component mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [educationData, experienceData] = await Promise.all([
          candidateApi.getEducationOptions(),
          candidateApi.getExperienceOptions()
        ]);
        
        setEducationOptions(educationData);
        setExperienceOptions(experienceData);
      } catch (error) {
        console.error('Error loading options:', error);
      }
    };
    
    loadOptions();
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    // Validate form
    const isValid = validateForm(formData, validationRules);
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      // Submit form data to API
      const response = await candidateApi.createCandidate(formData);
      
      if (response.success) {
        setSubmitSuccess(true);
        resetForm();
        if (onSuccess) onSuccess();
      } else {
        // Handle API errors
        if (response.errors && response.errors.length > 0) {
          const newErrors: Record<string, string> = {};
          response.errors.forEach(error => {
            newErrors[error.param] = error.msg;
          });
          setErrors(newErrors);
        } else {
          setSubmitError(response.message || 'Error al crear el candidato');
        }
      }
    } catch (error) {
      setSubmitError('Error de conexión con el servidor');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle field blur for individual field validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value, validationRules[name as keyof typeof validationRules]);
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Añadir Nuevo Candidato</h2>
      
      {submitSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          Candidato creado exitosamente
        </div>
      )}
      
      {submitError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre y Apellido - 2 columns on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.nombre ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              aria-invalid={!!errors.nombre}
              aria-describedby={errors.nombre ? "nombre-error" : undefined}
            />
            {errors.nombre && (
              <p id="nombre-error" className="mt-1 text-sm text-red-600">
                {errors.nombre}
              </p>
            )}
          </div>
          
          {/* Apellido */}
          <div>
            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
              Apellido *
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.apellido ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              aria-invalid={!!errors.apellido}
              aria-describedby={errors.apellido ? "apellido-error" : undefined}
            />
            {errors.apellido && (
              <p id="apellido-error" className="mt-1 text-sm text-red-600">
                {errors.apellido}
              </p>
            )}
          </div>
        </div>
        
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>
        
        {/* Teléfono */}
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono || ''}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.telefono ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
            aria-invalid={!!errors.telefono}
            aria-describedby={errors.telefono ? "telefono-error" : undefined}
          />
          {errors.telefono && (
            <p id="telefono-error" className="mt-1 text-sm text-red-600">
              {errors.telefono}
            </p>
          )}
        </div>
        
        {/* Dirección */}
        <div>
          <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion || ''}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.direccion ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
            aria-invalid={!!errors.direccion}
            aria-describedby={errors.direccion ? "direccion-error" : undefined}
          />
          {errors.direccion && (
            <p id="direccion-error" className="mt-1 text-sm text-red-600">
              {errors.direccion}
            </p>
          )}
        </div>
        
        {/* Educación y Experiencia - 2 columns on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Educación */}
          <div>
            <label htmlFor="educacion" className="block text-sm font-medium text-gray-700 mb-1">
              Educación *
            </label>
            <select
              id="educacion"
              name="educacion"
              value={formData.educacion}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.educacion ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              aria-invalid={!!errors.educacion}
              aria-describedby={errors.educacion ? "educacion-error" : undefined}
            >
              <option value="">Seleccione una opción</option>
              {educationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.educacion && (
              <p id="educacion-error" className="mt-1 text-sm text-red-600">
                {errors.educacion}
              </p>
            )}
          </div>
          
          {/* Experiencia */}
          <div>
            <label htmlFor="experiencia" className="block text-sm font-medium text-gray-700 mb-1">
              Experiencia *
            </label>
            <select
              id="experiencia"
              name="experiencia"
              value={formData.experiencia}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.experiencia ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              aria-invalid={!!errors.experiencia}
              aria-describedby={errors.experiencia ? "experiencia-error" : undefined}
            >
              <option value="">Seleccione una opción</option>
              {experienceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.experiencia && (
              <p id="experiencia-error" className="mt-1 text-sm text-red-600">
                {errors.experiencia}
              </p>
            )}
          </div>
        </div>
        
        {/* CV Upload */}
        <div>
          <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-1">
            CV (PDF o DOCX, máx. 5MB)
          </label>
          <input
            type="file"
            id="cv"
            name="cv"
            onChange={handleFileChange}
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.cv ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
            aria-invalid={!!errors.cv}
            aria-describedby={errors.cv ? "cv-error" : undefined}
          />
          {errors.cv && (
            <p id="cv-error" className="mt-1 text-sm text-red-600">
              {errors.cv}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Formatos aceptados: PDF, DOCX. Tamaño máximo: 5MB.
          </p>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </span>
            ) : (
              'Guardar Candidato'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm; 