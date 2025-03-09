import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { candidateService } from '../services/api';

// Types for Education
type Education = {
  id?: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  summary?: string;
};

// Types for Experience
type WorkExperience = {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  summary?: string;
};

// Types for Skills and Languages
type Skill = string;
type Language = string;

// Form data type
export type CandidateFormData = {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  linkedinProfile?: string;
  desiredSalary?: number;

  // Education
  education: Education[];

  // Work Experience
  workExperience: WorkExperience[];

  // Skills and Languages
  skills: Skill[];
  languages: Language[];

  // Documents
  cvFile?: File | null;
  isLinkedinCV?: boolean;
};

// Form context type
type FormContextType = {
  formData: CandidateFormData;
  updateFormData: (data: Partial<CandidateFormData>) => void;
  currentStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  addEducation: () => void;
  updateEducation: (index: number, data: Partial<Education>) => void;
  removeEducation: (index: number) => void;
  addWorkExperience: () => void;
  updateWorkExperience: (index: number, data: Partial<WorkExperience>) => void;
  removeWorkExperience: (index: number) => void;
  addSkill: (skill: string) => void;
  removeSkill: (index: number) => void;
  addLanguage: (language: string) => void;
  removeLanguage: (index: number) => void;
  resetForm: () => void;
  isEditMode: boolean;
  candidateId: string | undefined;
  isLoading: boolean;
};

// Initial form data
const initialFormData: CandidateFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  linkedinProfile: '',
  desiredSalary: undefined,
  education: [],
  workExperience: [],
  skills: [],
  languages: [],
  cvFile: null,
  isLinkedinCV: false
};

// Create context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Total number of steps
const TOTAL_STEPS = 5;

// Form provider
export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<CandidateFormData>(initialFormData);

  // Determine if we're in edit mode
  const isEditMode = !!id;

  // Fetch candidate data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchCandidate = async () => {
        try {
          setIsLoading(true);
          const response = await candidateService.getById(parseInt(id));
          if (response.success) {
            // Transform dates from ISO string to YYYY-MM-DD
            const candidate = response.data;

            // Process education
            const education = candidate.education?.map((edu: any) => ({
              ...edu,
              startDate: edu.startDate.substring(0, 10),
              endDate: edu.endDate.substring(0, 10)
            })) || [];

            // Process work experience
            const workExperience = candidate.workExperience?.map((exp: any) => ({
              ...exp,
              startDate: exp.startDate.substring(0, 10),
              endDate: exp.endDate.substring(0, 10)
            })) || [];

            // Process skills and languages
            const skills = candidate.skills?.map((skill: any) => skill.name) || [];
            const languages = candidate.languages?.map((lang: any) => lang.name) || [];

            // Update form data
            setFormData({
              ...initialFormData,
              ...candidate,
              education,
              workExperience,
              skills,
              languages,
              // Clear file since we can't populate it
              cvFile: null
            });
          }
        } catch (err) {
          console.error('Error fetching candidate:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCandidate();
    }
  }, [id, isEditMode]);

  // Update form data
  const updateFormData = (data: Partial<CandidateFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  // Step navigation
  const goToNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
    }
  };

  // Education handlers
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: '',
          degree: '',
          startDate: '',
          endDate: '',
          summary: ''
        }
      ]
    }));
  };

  const updateEducation = (index: number, data: Partial<Education>) => {
    setFormData(prev => {
      const newEducation = [...prev.education];
      newEducation[index] = { ...newEducation[index], ...data };
      return { ...prev, education: newEducation };
    });
  };

  const removeEducation = (index: number) => {
    setFormData(prev => {
      const newEducation = [...prev.education];
      newEducation.splice(index, 1);
      return { ...prev, education: newEducation };
    });
  };

  // Work Experience handlers
  const addWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          summary: ''
        }
      ]
    }));
  };

  const updateWorkExperience = (index: number, data: Partial<WorkExperience>) => {
    setFormData(prev => {
      const newWorkExperience = [...prev.workExperience];
      newWorkExperience[index] = { ...newWorkExperience[index], ...data };
      return { ...prev, workExperience: newWorkExperience };
    });
  };

  const removeWorkExperience = (index: number) => {
    setFormData(prev => {
      const newWorkExperience = [...prev.workExperience];
      newWorkExperience.splice(index, 1);
      return { ...prev, workExperience: newWorkExperience };
    });
  };

  // Skills handlers
  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => {
      const newSkills = [...prev.skills];
      newSkills.splice(index, 1);
      return { ...prev, skills: newSkills };
    });
  };

  // Languages handlers
  const addLanguage = (language: string) => {
    if (language && !formData.languages.includes(language)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, language]
      }));
    }
  };

  const removeLanguage = (index: number) => {
    setFormData(prev => {
      const newLanguages = [...prev.languages];
      newLanguages.splice(index, 1);
      return { ...prev, languages: newLanguages };
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        updateFormData,
        currentStep,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        isFirstStep: currentStep === 1,
        isLastStep: currentStep === TOTAL_STEPS,
        addEducation,
        updateEducation,
        removeEducation,
        addWorkExperience,
        updateWorkExperience,
        removeWorkExperience,
        addSkill,
        removeSkill,
        addLanguage,
        removeLanguage,
        resetForm,
        isEditMode,
        candidateId: id,
        isLoading
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use form context
export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};