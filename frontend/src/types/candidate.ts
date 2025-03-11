export type FormStep = 'personal' | 'education' | 'experience' | 'document' | 'review';

export interface Education {
  title: string;
  institution: string;
  startDate: Date;
  endDate: Date;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: Date;
  endDate: Date;
}

export interface Document {
  name: string;
  file: File;
}

export interface CandidateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  education: Education[];
  workExperience: WorkExperience[];
  document: Document | null;
}

export interface FormState {
  currentStep: FormStep;
  formData: CandidateFormData;
  isSubmitting: boolean;
  submitError: string | null;
  isSuccess: boolean;
}

export type FormAction =
  | { type: 'SET_STEP'; payload: FormStep }
  | { type: 'UPDATE_DATA'; payload: Partial<CandidateFormData> }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SUCCESS'; payload: boolean }
  | { type: 'RESET_FORM' };

// Estado inicial del formulario
export const initialFormState: CandidateFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  education: [{
    title: '',
    institution: '',
    startDate: new Date(),
    endDate: new Date()
  }],
  workExperience: [{
    company: '',
    position: '',
    startDate: new Date(),
    endDate: new Date()
  }],
  document: null
}; 