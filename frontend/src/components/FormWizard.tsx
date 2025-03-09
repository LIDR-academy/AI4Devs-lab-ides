import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { candidateService } from '../services/api';

// Step components to be created
import PersonalInfoStep from './steps/PersonalInfoStep';
import EducationStep from './steps/EducationStep';
import ExperienceStep from './steps/ExperienceStep';
import SkillsStep from './steps/SkillsStep';
import DocumentsStep from './steps/DocumentsStep';

// Navigation button component
const NavigationButton = ({
  onClick,
  text,
  isPrimary = false,
  isDisabled = false
}: {
  onClick: () => void;
  text: string;
  isPrimary?: boolean;
  isDisabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={isDisabled}
    className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
      isPrimary
        ? 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
    }`}
  >
    {text}
  </button>
);

// Step indicator component
const StepIndicator = ({
  currentStep,
  totalSteps,
  stepTitles
}: {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}) => (
  <div className="mb-8">
    <div className="flex justify-between items-center w-full">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              step === currentStep
                ? 'bg-indigo-600 text-white'
                : step < currentStep
                ? 'bg-indigo-200 text-indigo-800'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step}
          </div>
          <span className="text-xs text-gray-500 text-center">{stepTitles[step - 1]}</span>
        </div>
      ))}
    </div>
    {/* Progress bar */}
    <div className="w-full h-2 bg-gray-200 rounded-full mt-4">
      <div
        className="h-full bg-indigo-600 rounded-full"
        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
      ></div>
    </div>
  </div>
);

const FormWizard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    formData,
    currentStep,
    goToNextStep,
    goToPreviousStep,
    isFirstStep,
    isLastStep,
    resetForm,
    isEditMode,
    candidateId,
    isLoading
  } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Step titles from translations
  const stepTitles = [
    t('candidateForm.steps.personalInfo'),
    t('candidateForm.steps.education'),
    t('candidateForm.steps.experience'),
    t('candidateForm.steps.skills'),
    t('candidateForm.steps.documents')
  ];

  // Render current step component
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep />;
      case 2:
        return <EducationStep />;
      case 3:
        return <ExperienceStep />;
      case 4:
        return <SkillsStep />;
      case 5:
        return <DocumentsStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  // Validate current step before proceeding
  const validateStep = () => {
    switch (currentStep) {
      case 1:
        // Personal Info validation
        if (!formData.firstName.trim()) return false;
        if (!formData.lastName.trim()) return false;
        if (!formData.email.trim()) return false;
        if (!formData.phone.trim()) return false;
        if (!formData.address.trim()) return false;
        return true;

      // Add validation for other steps as needed

      default:
        return true;
    }
  };

  // Handle next step navigation
  const handleNext = () => {
    if (validateStep()) {
      goToNextStep();
    } else {
      setError(t('notifications.error.invalidForm'));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep()) {
      setError(t('notifications.error.invalidForm'));
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Create a clean copy of the form data without file if it's null
      const dataToSubmit = { ...formData };

      // Remove unnecessary fields that might cause issues
      if (!dataToSubmit.cvFile) {
        delete dataToSubmit.cvFile;
      }

      // When updating, we don't need to include id fields in nested objects
      if (isEditMode) {
        // Clean up education data
        if (dataToSubmit.education) {
          dataToSubmit.education = dataToSubmit.education.map(edu => {
            // Exclude id and candidateId fields for nested updates
            const { id, candidateId, ...cleanEdu } = edu as any;
            return cleanEdu;
          });
        }

        // Clean up work experience data
        if (dataToSubmit.workExperience) {
          dataToSubmit.workExperience = dataToSubmit.workExperience.map(exp => {
            const { id, candidateId, ...cleanExp } = exp as any;
            return cleanExp;
          });
        }
      }

      let response;

      if (isEditMode && candidateId) {
        // Update existing candidate
        response = await candidateService.update(parseInt(candidateId), dataToSubmit);
      } else {
        // Create new candidate
        response = await candidateService.create(dataToSubmit);
      }

      if (response.success) {
        // Show success message and redirect
        const message = isEditMode
          ? t('notifications.success.candidateUpdated')
          : t('notifications.success.candidateCreated');

        alert(message);
        resetForm();
        navigate('/candidates');
      } else {
        setError(response.message || t('notifications.error.somethingWentWrong'));
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(t('notifications.error.somethingWentWrong'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditMode ? t('candidateForm.titleEdit') : t('candidateForm.title')}
      </h1>

      {/* Step indicator */}
      <StepIndicator
        currentStep={currentStep}
        totalSteps={5}
        stepTitles={stepTitles}
      />

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Current step */}
      <div className="mb-8">
        {renderStep()}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <NavigationButton
          onClick={goToPreviousStep}
          text={t('candidateForm.buttons.previous')}
          isDisabled={isFirstStep}
        />

        {isLastStep ? (
          <NavigationButton
            onClick={handleSubmit}
            text={t('candidateForm.buttons.submit')}
            isPrimary
            isDisabled={isSubmitting}
          />
        ) : (
          <NavigationButton
            onClick={handleNext}
            text={t('candidateForm.buttons.next')}
            isPrimary
          />
        )}
      </div>
    </div>
  );
};

export default FormWizard;