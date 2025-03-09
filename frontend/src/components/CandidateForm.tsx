import React from 'react';
import { FormProvider } from '../context/FormContext';
import FormWizard from './FormWizard';

const CandidateForm: React.FC = () => {
  return (
    <FormProvider>
      <FormWizard />
    </FormProvider>
  );
};

export default CandidateForm;