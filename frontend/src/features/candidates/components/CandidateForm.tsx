import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useCreateCandidate } from '../hooks/useCandidates';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import EducationFormSection, { EducationItem } from './EducationFormSection';
import WorkExperienceFormSection, { WorkExperienceItem } from './WorkExperienceFormSection';

// Esquema para educación
const educationSchema = z.object({
  institution: z.string().min(1, 'La institución es obligatoria'),
  degree: z.string().min(1, 'El título es obligatorio'),
  field: z.string().optional(),
  startDate: z.string().min(1, 'La fecha de inicio es obligatoria'),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

// Esquema para experiencia laboral
const workExperienceSchema = z.object({
  company: z.string().min(1, 'La empresa es obligatoria'),
  position: z.string().min(1, 'La posición es obligatoria'),
  startDate: z.string().min(1, 'La fecha de inicio es obligatoria'),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

// Esquema de validación con Zod
const candidateSchema = z.object({
  firstName: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/, 'El nombre solo puede contener letras, espacios, apóstrofes y guiones'),
  lastName: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder los 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/, 'El apellido solo puede contener letras, espacios, apóstrofes y guiones'),
  email: z.string()
    .min(1, 'El email es obligatorio')
    .email('Formato de email inválido. Ejemplo: nombre@dominio.com'),
  phone: z.string()
    .min(1, 'El teléfono es obligatorio')
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{3,6}$/, 'Formato de teléfono inválido. Ejemplo: +34 612 345 678'),
  status: z.enum(['new', 'contacted', 'interview', 'offer', 'hired', 'rejected']).default('new'),
  skillsInput: z.string().optional(),
  notes: z.string().optional(),
  education: z.array(educationSchema).optional().default([]),
  workExperience: z.array(workExperienceSchema).optional().default([]),
});

// Tipo inferido del esquema
type CandidateFormData = z.infer<typeof candidateSchema>;

const CandidateForm: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: createCandidate, isPending, isError, error } = useCreateCandidate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState({
    personalInfo: true,
    education: true,
    workExperience: true,
    additional: true
  });
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields, isSubmitting, isDirty, isSubmitted },
    reset,
    watch,
    trigger
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      status: 'new',
      skillsInput: '',
      education: [],
      workExperience: []
    },
    mode: 'onBlur', // Validar solo al perder el foco
    reValidateMode: 'onBlur' // Revalidar solo al perder el foco
  });

  // Función para validar un campo solo si no está vacío
  const validateFieldIfNotEmpty = (field: keyof CandidateFormData) => {
    const value = watch(field);
    if (value && String(value).trim() !== '') {
      trigger(field);
    }
  };

  // Función para alternar la expansión de secciones
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const onSubmit = async (data: CandidateFormData) => {
    // Limpiar errores previos
    setApiError(null);
    setIsAuthError(false);
    
    // Convertir los datos del formulario al formato esperado por la API
    const candidateData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      status: data.status,
      skills: data.skillsInput && typeof data.skillsInput === 'string' 
        ? data.skillsInput.split(',').map(skill => skill.trim()).filter(Boolean) 
        : [],
      notes: data.notes,
      education: data.education,
      workExperience: data.workExperience
    };
    
    try {
      // Llamar a la API para crear el candidato
      await createCandidate(candidateData as any, {
        onSuccess: (response) => {
          console.log('Candidato creado con éxito:', response);
          
          if (response.success && response.data && response.data.id) {
            // Guardar datos del candidato en sessionStorage para mostrarlos en la página de éxito
            sessionStorage.setItem('createdCandidate', JSON.stringify(response.data));
            // Redirigir a la página de éxito
            navigate('/candidates/success');
          } else {
            // Si hay un error en la respuesta
            setApiError(response.error || 'Error al crear el candidato');
          }
        },
        onError: (error: any) => {
          console.error('Error al crear candidato:', error);
          
          // Verificar si es un error de autenticación
          if (error.response?.status === 401 || error.response?.status === 403) {
            setIsAuthError(true);
            setApiError('Sesión expirada o sin permisos. Por favor, inicie sesión nuevamente.');
          } else if (error.response?.data?.errors) {
            // Mostrar errores de validación específicos
            const validationErrors = error.response.data.errors;
            const errorMessages = validationErrors.map((err: any) => 
              `${err.field}: ${err.message}`
            ).join(', ');
            setApiError(`Error de validación: ${errorMessages}`);
          } else {
            // Mostrar el mensaje de error
            setApiError(
              error.response?.data?.error || 
              error.message || 
              'Error al crear el candidato. Por favor, inténtelo de nuevo.'
            );
          }
        }
      });
    } catch (error: any) {
      console.error('Error general al crear candidato:', error);
      setApiError(error.message || 'Error al crear el candidato');
    }
  };

  // Función para manejar el intento de envío
  const handleFormSubmit = async (e: React.FormEvent) => {
    // Validar todos los campos antes de enviar
    const isValid = await trigger();
    
    if (!isValid) {
      e.preventDefault();
      // Mostrar el panel de errores y desplazarse hacia él
      const errorSummary = document.getElementById('error-summary');
      if (errorSummary) {
        errorSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Componente para el encabezado de sección
  const SectionHeader = ({ title, section }: { title: string, section: keyof typeof expandedSections }) => (
    <div 
      className="flex justify-between items-center py-2 px-4 bg-gray-100 rounded-md cursor-pointer"
      onClick={() => toggleSection(section)}
    >
      <h3 className="text-lg font-medium text-gray-800">{title}</h3>
      <button type="button" className="text-gray-500 hover:text-gray-700">
        {expandedSections[section] ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Añadir Nuevo Candidato</h2>
      
      {/* Mostrar errores de la API */}
      {apiError && (
        <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-50 text-red-700 flex items-start">
          <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-medium">{apiError}</p>
            {isAuthError && (
              <button 
                className="mt-2 text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                onClick={() => navigate('/login')}
              >
                Ir a iniciar sesión
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Indicador de carga */}
      {isPending && (
        <div className="mb-6 p-4 border-l-4 border-blue-500 bg-blue-50 text-blue-700">
          <p className="font-medium">Creando candidato...</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" onInvalid={handleFormSubmit}>
        {/* Resumen de errores - solo mostrar después de intentar enviar */}
        {isSubmitted && Object.keys(errors).length > 0 && (
          <div id="error-summary" className="p-4 border-l-4 border-red-500 bg-red-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Hay {Object.keys(errors).length} {Object.keys(errors).length === 1 ? 'error' : 'errores'} en el formulario
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {errors.firstName && <li>{errors.firstName.message}</li>}
                    {errors.lastName && <li>{errors.lastName.message}</li>}
                    {errors.email && <li>{errors.email.message}</li>}
                    {errors.phone && <li>{errors.phone.message}</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Sección de información personal */}
        <div className="space-y-4">
          <SectionHeader title="Información Personal" section="personalInfo" />
          
          {expandedSections.personalInfo && (
            <div className="p-4 border rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-bold text-gray-700">
                    Nombre *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="firstName"
                      {...register('firstName', {
                        onBlur: () => validateFieldIfNotEmpty('firstName')
                      })}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-steel-blue-500 focus:border-steel-blue-500 sm:text-sm px-3 py-2 ${
                        touchedFields.firstName && errors.firstName 
                          ? 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                          : touchedFields.firstName && !errors.firstName && watch('firstName')
                            ? 'border-green-300 pr-10 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300'
                      }`}
                      placeholder="Introduce tu nombre"
                      aria-invalid={errors.firstName ? "true" : "false"}
                      aria-describedby="firstName-error"
                    />
                    {touchedFields.firstName && errors.firstName && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    {touchedFields.firstName && !errors.firstName && watch('firstName') && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {touchedFields.firstName && errors.firstName ? (
                    <p id="firstName-error" className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">Introduce tu nombre completo (solo letras)</p>
                  )}
                </div>
                
                {/* Apellido */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-bold text-gray-700">
                    Apellido *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="lastName"
                      {...register('lastName', {
                        onBlur: () => validateFieldIfNotEmpty('lastName')
                      })}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-steel-blue-500 focus:border-steel-blue-500 sm:text-sm px-3 py-2 ${
                        touchedFields.lastName && errors.lastName 
                          ? 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                          : touchedFields.lastName && !errors.lastName && watch('lastName')
                            ? 'border-green-300 pr-10 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300'
                      }`}
                      placeholder="Introduce tu apellido"
                      aria-invalid={errors.lastName ? "true" : "false"}
                      aria-describedby="lastName-error"
                    />
                    {touchedFields.lastName && errors.lastName && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    {touchedFields.lastName && !errors.lastName && watch('lastName') && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {touchedFields.lastName && errors.lastName ? (
                    <p id="lastName-error" className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">Introduce tu apellido (solo letras)</p>
                  )}
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                    Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      {...register('email', {
                        onBlur: () => validateFieldIfNotEmpty('email')
                      })}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-steel-blue-500 focus:border-steel-blue-500 sm:text-sm px-3 py-2 ${
                        touchedFields.email && errors.email 
                          ? 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                          : touchedFields.email && !errors.email && watch('email')
                            ? 'border-green-300 pr-10 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300'
                      }`}
                      placeholder="ejemplo@dominio.com"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby="email-error"
                    />
                    {touchedFields.email && errors.email && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    {touchedFields.email && !errors.email && watch('email') && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {touchedFields.email && errors.email ? (
                    <p id="email-error" className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">Formato: nombre@dominio.com</p>
                  )}
                </div>
                
                {/* Teléfono */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-700">
                    Teléfono *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone', {
                        onBlur: () => validateFieldIfNotEmpty('phone')
                      })}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-steel-blue-500 focus:border-steel-blue-500 sm:text-sm px-3 py-2 ${
                        touchedFields.phone && errors.phone 
                          ? 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                          : touchedFields.phone && !errors.phone && watch('phone')
                            ? 'border-green-300 pr-10 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300'
                      }`}
                      placeholder="+34 612 345 678"
                      aria-invalid={errors.phone ? "true" : "false"}
                      aria-describedby="phone-error"
                    />
                    {touchedFields.phone && errors.phone && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    {touchedFields.phone && !errors.phone && watch('phone') && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {touchedFields.phone && errors.phone ? (
                    <p id="phone-error" className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">Formato: +34 612 345 678</p>
                  )}
                </div>
                
                {/* Estado */}
                <div>
                  <label htmlFor="status" className="block text-sm font-bold text-gray-700">
                    Estado
                  </label>
                  <select
                    id="status"
                    {...register('status')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-steel-blue-500 focus:ring-steel-blue-500 sm:text-sm px-3 py-2"
                  >
                    <option value="new">Nuevo</option>
                    <option value="contacted">Contactado</option>
                    <option value="interview">Entrevista</option>
                    <option value="offer">Oferta</option>
                    <option value="hired">Contratado</option>
                    <option value="rejected">Rechazado</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Sección de educación */}
        <div className="space-y-4">
          <SectionHeader title="Educación" section="education" />
          
          {expandedSections.education && (
            <div className="p-4 border rounded-md">
              <EducationFormSection 
                control={control} 
                register={register} 
                errors={errors} 
              />
            </div>
          )}
        </div>
        
        {/* Sección de experiencia laboral */}
        <div className="space-y-4">
          <SectionHeader title="Experiencia Laboral" section="workExperience" />
          
          {expandedSections.workExperience && (
            <div className="p-4 border rounded-md">
              <WorkExperienceFormSection 
                control={control} 
                register={register} 
                errors={errors} 
              />
            </div>
          )}
        </div>
        
        {/* Sección de información adicional */}
        <div className="space-y-4">
          <SectionHeader title="Información Adicional" section="additional" />
          
          {expandedSections.additional && (
            <div className="p-4 border rounded-md">
              {/* Habilidades */}
              <div className="mb-4">
                <label htmlFor="skillsInput" className="block text-sm font-bold text-gray-700">
                  Habilidades (separadas por comas)
                </label>
                <input
                  type="text"
                  id="skillsInput"
                  {...register('skillsInput')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-steel-blue-500 focus:ring-steel-blue-500 sm:text-sm px-3 py-2"
                  placeholder="Ej: JavaScript, React, Node.js"
                />
              </div>
              
              {/* Notas */}
              <div>
                <label htmlFor="notes" className="block text-sm font-bold text-gray-700">
                  Notas adicionales
                </label>
                <textarea
                  id="notes"
                  {...register('notes')}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-steel-blue-500 focus:ring-steel-blue-500 sm:text-sm px-3 py-2"
                  placeholder="Información adicional sobre el candidato..."
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-steel-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleFormSubmit}
            disabled={isPending}
            className={`inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-steel-blue-500 ${
              isPending 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-steel-blue-600 hover:bg-steel-blue-700'
            } disabled:opacity-50`}
          >
            {isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : (
              'Guardar candidato'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm; 