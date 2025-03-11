import React from 'react';
import { useFormNavigation } from '../../context/FormContext';
import { useFormSubmit } from '../../hooks/useFormSubmit';

const StepNavigation: React.FC = () => {
  const { 
    currentStep,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    steps
  } = useFormNavigation();

  const { validateStep, submitForm } = useFormSubmit();

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      if (isLastStep) {
        await submitForm();
      } else {
        goToNextStep();
      }
    }
  };

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    steps.indexOf(currentStep) >= index
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-300 text-gray-300'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="mt-2 text-sm text-gray-600 capitalize">
                  {step}
                </span>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    steps.indexOf(currentStep) > index
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={goToPreviousStep}
          disabled={isFirstStep}
          className={`px-4 py-2 rounded ${
            isFirstStep
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gray-500 hover:bg-gray-600 text-white'
          }`}
        >
          Previous
        </button>
        
        <button
          type="button"
          onClick={handleNext}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          {isLastStep ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default StepNavigation; 