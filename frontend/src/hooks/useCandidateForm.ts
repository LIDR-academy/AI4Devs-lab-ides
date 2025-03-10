import { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { CandidateFormData, Education, WorkExperience, Skill, ProficiencyLevel } from '../types/candidate';
import { candidateService } from '../services/api';

// Estado inicial del formulario
const initialFormState: CandidateFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  summary: '',
  education: [],
  workExperience: [],
  skills: [],
  cv: null,
};

// Hook personalizado para el formulario de candidatos
export const useCandidateForm = () => {
  // Estado del formulario
  const [formData, setFormData] = useState<CandidateFormData>(initialFormState);
  
  // Estado de carga
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Estado de error
  const [error, setError] = useState<string | null>(null);
  
  // Estado de éxito
  const [success, setSuccess] = useState<boolean>(false);
  
  // Manejador para cambios en campos de texto
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);
  
  // Manejador para cambios en el archivo CV
  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({
        ...prev,
        cv: e.target.files![0],
      }));
    }
  }, []);
  
  // Manejador para agregar educación
  const addEducation = useCallback(() => {
    const newEducation: Education & { isNew: boolean } = {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: null,
      description: '',
      isNew: true,
    };
    
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  }, []);
  
  // Manejador para actualizar educación
  const updateEducation = useCallback((index: number, field: keyof Education, value: string | Date | null) => {
    setFormData(prev => {
      const updatedEducation = [...prev.education];
      updatedEducation[index] = {
        ...updatedEducation[index],
        [field]: value,
      };
      return {
        ...prev,
        education: updatedEducation,
      };
    });
  }, []);
  
  // Manejador para eliminar educación
  const removeEducation = useCallback((index: number) => {
    setFormData(prev => {
      const updatedEducation = [...prev.education];
      updatedEducation.splice(index, 1);
      return {
        ...prev,
        education: updatedEducation,
      };
    });
  }, []);
  
  // Manejador para agregar experiencia laboral
  const addWorkExperience = useCallback(() => {
    const newWorkExperience: WorkExperience & { isNew: boolean } = {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: null,
      description: '',
      isNew: true,
    };
    
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, newWorkExperience],
    }));
  }, []);
  
  // Manejador para actualizar experiencia laboral
  const updateWorkExperience = useCallback((index: number, field: keyof WorkExperience, value: string | Date | null) => {
    setFormData(prev => {
      const updatedWorkExperience = [...prev.workExperience];
      updatedWorkExperience[index] = {
        ...updatedWorkExperience[index],
        [field]: value,
      };
      return {
        ...prev,
        workExperience: updatedWorkExperience,
      };
    });
  }, []);
  
  // Manejador para eliminar experiencia laboral
  const removeWorkExperience = useCallback((index: number) => {
    setFormData(prev => {
      const updatedWorkExperience = [...prev.workExperience];
      updatedWorkExperience.splice(index, 1);
      return {
        ...prev,
        workExperience: updatedWorkExperience,
      };
    });
  }, []);
  
  // Manejador para agregar habilidad
  const addSkill = useCallback(() => {
    const newSkill: Skill & { isNew: boolean } = {
      name: '',
      proficiencyLevel: ProficiencyLevel.INTERMEDIATE,
      isNew: true,
    };
    
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  }, []);
  
  // Manejador para actualizar habilidad
  const updateSkill = useCallback((index: number, field: keyof Skill, value: string | ProficiencyLevel) => {
    setFormData(prev => {
      const updatedSkills = [...prev.skills];
      updatedSkills[index] = {
        ...updatedSkills[index],
        [field]: value,
      };
      return {
        ...prev,
        skills: updatedSkills,
      };
    });
  }, []);
  
  // Manejador para eliminar habilidad
  const removeSkill = useCallback((index: number) => {
    setFormData(prev => {
      const updatedSkills = [...prev.skills];
      updatedSkills.splice(index, 1);
      return {
        ...prev,
        skills: updatedSkills,
      };
    });
  }, []);
  
  // Manejador para enviar el formulario
  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await candidateService.createCandidate(formData);
      setSuccess(true);
      setFormData(initialFormState);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear el candidato');
    } finally {
      setIsLoading(false);
    }
  }, [formData]);
  
  // Manejador para resetear el formulario
  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setError(null);
    setSuccess(false);
  }, []);
  
  return {
    formData,
    isLoading,
    error,
    success,
    handleInputChange,
    handleFileChange,
    addEducation,
    updateEducation,
    removeEducation,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    addSkill,
    updateSkill,
    removeSkill,
    handleSubmit,
    resetForm,
  };
}; 