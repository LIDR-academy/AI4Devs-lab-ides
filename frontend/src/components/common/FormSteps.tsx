import React from 'react';
import './FormSteps.css';

interface FormStepsProps {
  steps: string[];
  currentStep: number;
}

export const FormSteps: React.FC<FormStepsProps> = ({ steps, currentStep }) => {
  return (
    <div className="form-steps">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${index + 1 === currentStep ? 'active' : ''} 
                     ${index + 1 < currentStep ? 'completed' : ''}`}
        >
          <div className="step-number">{index + 1}</div>
          <div className="step-label">{step}</div>
        </div>
      ))}
    </div>
  );
}; 