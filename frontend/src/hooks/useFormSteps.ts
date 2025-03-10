import { useState } from 'react';

export const useFormSteps = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const steps = [
    'Información Personal',
    'Educación',
    'Experiencia',
    'Documentos'
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    currentStep,
    steps,
    nextStep,
    prevStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === steps.length,
  };
}; 