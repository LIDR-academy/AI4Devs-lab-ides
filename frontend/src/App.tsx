import React from 'react';
import { FormProvider } from './context/FormContext';
import CandidateForm from './components/CandidateForm/CandidateForm';

function App() {
  return (
    <FormProvider>
      <CandidateForm />
    </FormProvider>
  );
}

export default App;
