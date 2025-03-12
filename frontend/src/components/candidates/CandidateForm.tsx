import React, { useRef, useEffect } from 'react';
import { EducationField } from './EducationField';
import { WorkExperienceField } from './WorkExperienceField';
import { useCandidateForm } from '../../hooks/useCandidateForm';
import { Education, WorkExperience } from '../../types/Candidate';

interface CandidateFormProps {
  onCancel: () => void;
}

/**
 * Componente principal para el formulario de creación de candidatos
 */
export const CandidateForm: React.FC<CandidateFormProps> = ({ onCancel }) => {
  // Referencias para los campos del formulario
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);

  const {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    generalError,
    handleInputChange,
    handleEducationChange,
    addEducation,
    removeEducation,
    handleWorkExperienceChange,
    addWorkExperience,
    removeWorkExperience,
    handleFileChange,
    handleSubmit,
    resetForm
  } = useCandidateForm();

  // Efecto para enfocar el primer campo con error
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      
      switch (firstErrorField) {
        case 'firstName':
          firstNameRef.current?.focus();
          firstNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;
        case 'lastName':
          lastNameRef.current?.focus();
          lastNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;
        case 'email':
          emailRef.current?.focus();
          emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;
        case 'phone':
          phoneRef.current?.focus();
          phoneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;
        case 'education':
          educationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        default:
          break;
      }
    }
  }, [errors]);

  // Manejador personalizado para el envío del formulario
  const handleFormSubmit = async (e: React.FormEvent) => {
    await handleSubmit(e);
  };

  // Si el formulario se envió con éxito, mostrar mensaje de confirmación
  if (isSuccess) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="text-center py-8">
          <div className="mb-4 flex justify-center">
            <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Candidato añadido con éxito!</h2>
          <p className="text-gray-600 mb-6">
            El candidato ha sido registrado correctamente en el sistema.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Volver al dashboard
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Añadir otro candidato
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Añadir nuevo candidato</h1>
      
      {generalError && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700" role="alert">
          <p className="font-medium">Error</p>
          <p>{generalError}</p>
        </div>
      )}
      
      <form onSubmit={handleFormSubmit} noValidate>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Información personal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                ref={firstNameRef}
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
                aria-required="true"
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              />
              {errors.firstName && (
                <p id="firstName-error" className="mt-1 text-sm text-red-600">
                  {errors.firstName}
                </p>
              )}
            </div>
            
            {/* Apellido */}
            <div className="form-group">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <input
                ref={lastNameRef}
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
                aria-required="true"
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              />
              {errors.lastName && (
                <p id="lastName-error" className="mt-1 text-sm text-red-600">
                  {errors.lastName}
                </p>
              )}
            </div>
            
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                ref={emailRef}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>
            
            {/* Teléfono */}
            <div className="form-group">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <input
                ref={phoneRef}
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
                aria-required="true"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="mt-1 text-sm text-red-600">
                  {errors.phone}
                </p>
              )}
            </div>
            
            {/* Dirección */}
            <div className="form-group md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                ref={addressRef}
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-invalid={!!errors.address}
                aria-describedby={errors.address ? 'address-error' : undefined}
              />
              {errors.address && (
                <p id="address-error" className="mt-1 text-sm text-red-600">
                  {errors.address}
                </p>
              )}
            </div>
            
            {/* CV */}
            <div className="form-group md:col-span-2">
              <label htmlFor="cvFile" className="block text-sm font-medium text-gray-700 mb-1">
                Curriculum Vitae (PDF/DOCX)
              </label>
              <input
                type="file"
                id="cvFile"
                name="cvFile"
                onChange={handleFileChange}
                accept=".pdf,.docx"
                className={`w-full px-3 py-2 border ${errors.cvFile ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-invalid={!!errors.cvFile}
                aria-describedby={errors.cvFile ? 'cvFile-error' : undefined}
              />
              {errors.cvFile && (
                <p id="cvFile-error" className="mt-1 text-sm text-red-600">
                  {errors.cvFile}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Formatos aceptados: PDF, DOCX. Tamaño máximo: 5MB
              </p>
            </div>
          </div>
        </div>
        
        {/* Sección de Educación */}
        <div className="mb-8" ref={educationRef}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Educación</h2>
            <button
              type="button"
              onClick={addEducation}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              + Añadir educación
            </button>
          </div>
          
          {errors.education && (
            <p className="mb-4 text-sm text-red-600">
              {errors.education}
            </p>
          )}
          
          {formData.education.map((education: Education, index: number) => (
            <EducationField
              key={index}
              education={education}
              index={index}
              onChange={handleEducationChange}
              onRemove={removeEducation}
              isRemovable={formData.education.length > 1}
              errors={errors}
            />
          ))}
        </div>
        
        {/* Sección de Experiencia Laboral */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Experiencia Laboral</h2>
            <button
              type="button"
              onClick={addWorkExperience}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              + Añadir experiencia
            </button>
          </div>
          
          {formData.workExperience.map((workExperience: WorkExperience, index: number) => (
            <WorkExperienceField
              key={index}
              workExperience={workExperience}
              index={index}
              onChange={handleWorkExperienceChange}
              onRemove={removeWorkExperience}
              isRemovable={formData.workExperience.length > 1}
              errors={errors}
            />
          ))}
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar candidato'}
          </button>
        </div>
      </form>
    </div>
  );
}; 