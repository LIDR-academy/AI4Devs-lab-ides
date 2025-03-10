import { useForm } from '../context/FormContext';
import { FormStep, Education, WorkExperience, FormAction } from '../types/candidate';
import { Dispatch } from 'react';
import {
  validatePersonalInfo,
  validateEducation,
  validateWorkExperience,
  validateDocument,
  ValidationError
} from '../utils/validation';

interface UseFormSubmit {
  isSubmitting: boolean;
  submitError: string | null;
  validateStep: (step: FormStep) => boolean;
  submitForm: () => Promise<void>;
  dispatch: Dispatch<FormAction>;
  isSuccess: boolean;
}

export const useFormSubmit = (): UseFormSubmit => {
  const { state, dispatch } = useForm();

  const validateStep = (step: FormStep): boolean => {
    try {
      switch (step) {
        case 'personal':
          validatePersonalInfo(state.formData);
          break;
        case 'education':
          validateEducation(state.formData.education);
          break;
        case 'experience':
          validateWorkExperience(state.formData.workExperience);
          break;
        case 'document':
          validateDocument(state.formData.document);
          break;
        case 'review':
          // Validate all steps before final submission
          validatePersonalInfo(state.formData);
          validateEducation(state.formData.education);
          validateWorkExperience(state.formData.workExperience);
          validateDocument(state.formData.document);
          break;
      }
      // Clear any previous validation errors
      dispatch({ type: 'SET_ERROR', payload: null });
      return true;
    } catch (error) {
      if (error instanceof ValidationError) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'An unexpected error occurred' });
      }
      return false;
    }
  };

  const submitForm = async () => {
    try {
      // Validate all data before submission
      if (!validateStep('review')) {
        return;
      }

      dispatch({ type: 'SET_SUBMITTING', payload: true });

      // First create the candidate
      const candidateResponse = await fetch('/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: state.formData.firstName,
          lastName: state.formData.lastName,
          email: state.formData.email,
          phone: state.formData.phone,
          education: state.formData.education,
          workExperience: state.formData.workExperience,
        }),
      });

      if (!candidateResponse.ok) {
        throw new Error('Failed to create candidate');
      }

      const { id } = await candidateResponse.json();

      // If there's a document, upload it
      if (state.formData.document?.file) {
        const formData = new FormData();
        formData.append('file', state.formData.document.file);

        const documentResponse = await fetch(`/api/candidates/${id}/document`, {
          method: 'POST',
          body: formData,
        });

        if (!documentResponse.ok) {
          throw new Error('Failed to upload document');
        }
      }

      dispatch({ type: 'SET_SUBMITTING', payload: false });
      dispatch({ type: 'SET_SUCCESS', payload: true });
    } catch (error) {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to submit form'
      });
    }
  };

  return {
    validateStep,
    submitForm,
    isSubmitting: state.isSubmitting,
    submitError: state.submitError,
    isSuccess: state.isSuccess,
    dispatch
  };
}; 