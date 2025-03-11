import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { FormState, FormStep, CandidateFormData, FormAction } from '../types/candidate';

// Estado inicial completo
const initialFormData: CandidateFormData = {
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

const initialState: FormState = {
  currentStep: 'personal',
  formData: initialFormData,
  isSubmitting: false,
  submitError: null,
  isSuccess: false
};

const FormContext = createContext<{
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
} | undefined>(undefined);

// Reducer para manejar las actualizaciones de estado
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload,
        submitError: null // Clear errors when changing steps
      };
    case 'UPDATE_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload
        }
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        submitError: action.payload
      };
    case 'SET_SUCCESS':
      return {
        ...state,
        isSuccess: action.payload
      };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
};

// Provider Component
export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

// Hook para navegar entre pasos
export const useFormNavigation = () => {
  const { state, dispatch } = useForm();
  const steps: FormStep[] = ['personal', 'education', 'experience', 'document', 'review'];
  const currentStepIndex = steps.indexOf(state.currentStep);

  return {
    currentStep: state.currentStep,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    steps,
    goToNextStep: () => {
      if (currentStepIndex < steps.length - 1) {
        dispatch({ type: 'SET_STEP', payload: steps[currentStepIndex + 1] });
      }
    },
    goToPreviousStep: () => {
      if (currentStepIndex > 0) {
        dispatch({ type: 'SET_STEP', payload: steps[currentStepIndex - 1] });
      }
    }
  };
}; 