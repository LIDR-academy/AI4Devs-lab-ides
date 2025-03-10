import React from 'react';
import { useFormNavigation } from '../../context/FormContext';
import PersonalInfoStep from './steps/PersonalInfoStep';
import EducationStep from './steps/EducationStep';
import ExperienceStep from './steps/ExperienceStep';
import DocumentStep from './steps/DocumentStep';
import ReviewStep from './steps/ReviewStep';

const CandidateForm: React.FC = () => {
  const { currentStep } = useFormNavigation();

  const renderStep = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalInfoStep />;
      case 'education':
        return <EducationStep />;
      case 'experience':
        return <ExperienceStep />;
      case 'document':
        return <DocumentStep />;
      case 'review':
        return <ReviewStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {renderStep()}
      </div>
    </div>
  );
};

export default CandidateForm; 