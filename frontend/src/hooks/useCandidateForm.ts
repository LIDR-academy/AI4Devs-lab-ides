import { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { CandidateFormData, Education, WorkExperience } from '../types/Candidate';
import { candidateService } from '../services/candidateService';

// Estado inicial para el formulario
const initialFormState: CandidateFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  education: [
    {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: null,
      description: ''
    }
  ],
  workExperience: [
    {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: null,
      description: ''
    }
  ],
  cvFile: null
};

// Tipo para los errores del formulario
type FormErrors = Record<string, string>;

/**
 * Hook personalizado para manejar el formulario de candidatos
 */
export const useCandidateForm = () => {
  // Estado del formulario
  const [formData, setFormData] = useState<CandidateFormData>(initialFormState);
  
  // Estado de errores de validación
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Estado de carga
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado de éxito
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Estado de error general
  const [generalError, setGeneralError] = useState<string | null>(null);

  /**
   * Maneja cambios en los campos de texto del formulario
   */
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo si existe
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  /**
   * Maneja cambios en los campos de educación
   */
  const handleEducationChange = useCallback((index: number, field: keyof Education, value: string | null) => {
    setFormData(prev => {
      const newEducation = [...prev.education];
      
      // Manejo especial para el campo endDate
      if (field === 'endDate') {
        // Si el valor es una cadena vacía o null, establecer como null
        // De lo contrario, usar el valor proporcionado
        newEducation[index] = { 
          ...newEducation[index], 
          [field]: value === '' ? null : value 
        };
      } else {
        newEducation[index] = { ...newEducation[index], [field]: value };
      }
      
      return { ...prev, education: newEducation };
    });
    
    // Limpiar errores relacionados con la educación
    setErrors(prev => {
      const newErrors = { ...prev };
      // Eliminar errores generales de educación
      delete newErrors.education;
      // Eliminar errores específicos del campo
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`education[${index}]`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  }, []);

  /**
   * Añade un nuevo campo de educación
   */
  const addEducation = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: null,
          description: ''
        }
      ]
    }));
  }, []);

  /**
   * Elimina un campo de educación
   */
  const removeEducation = useCallback((index: number) => {
    setFormData(prev => {
      const newEducation = [...prev.education];
      newEducation.splice(index, 1);
      return { ...prev, education: newEducation };
    });
  }, []);

  /**
   * Maneja cambios en los campos de experiencia laboral
   */
  const handleWorkExperienceChange = useCallback((index: number, field: keyof WorkExperience, value: string | null) => {
    setFormData(prev => {
      const newWorkExperience = [...prev.workExperience];
      
      // Manejo especial para el campo endDate
      if (field === 'endDate') {
        // Si el valor es una cadena vacía o null, establecer como null
        // De lo contrario, usar el valor proporcionado
        newWorkExperience[index] = { 
          ...newWorkExperience[index], 
          [field]: value === '' ? null : value 
        };
      } else {
        newWorkExperience[index] = { ...newWorkExperience[index], [field]: value };
      }
      
      return { ...prev, workExperience: newWorkExperience };
    });
    
    // Limpiar errores relacionados con la experiencia laboral
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`workExperience[${index}]`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  }, []);

  /**
   * Añade un nuevo campo de experiencia laboral
   */
  const addWorkExperience = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: null,
          description: ''
        }
      ]
    }));
  }, []);

  /**
   * Elimina un campo de experiencia laboral
   */
  const removeWorkExperience = useCallback((index: number) => {
    setFormData(prev => {
      const newWorkExperience = [...prev.workExperience];
      newWorkExperience.splice(index, 1);
      return { ...prev, workExperience: newWorkExperience };
    });
  }, []);

  /**
   * Maneja la carga del archivo CV
   */
  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, cvFile: file }));
  }, []);

  /**
   * Valida el formulario
   */
  const validateForm = useCallback((): boolean => {
    const validationErrors = candidateService.validateCandidateData(formData);
    
    if (validationErrors) {
      setErrors(validationErrors);
      return false;
    }
    
    setErrors({});
    return true;
  }, [formData]);

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setGeneralError(null);
    
    try {
      const response = await candidateService.createCandidate(formData);
      
      if (response.success) {
        setIsSuccess(true);
        // Opcionalmente, resetear el formulario
        // setFormData(initialFormState);
      } else {
        setGeneralError(response.message);
        if (response.errors) {
          // Convertir errores de la API al formato del formulario
          const apiErrors: FormErrors = {};
          Object.entries(response.errors).forEach(([key, messages]) => {
            apiErrors[key] = messages[0]; // Tomamos solo el primer mensaje de error
          });
          setErrors(apiErrors);
        }
      }
    } catch (error) {
      setGeneralError('Error al procesar la solicitud. Por favor, inténtelo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  /**
   * Resetea el formulario
   */
  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setErrors({});
    setIsSuccess(false);
    setGeneralError(null);
  }, []);

  return {
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
  };
}; 