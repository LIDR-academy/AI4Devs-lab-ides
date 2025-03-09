import React from 'react';
import CandidateForm from '../components/candidates/CandidateForm';

const AddCandidate: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Añadir Nuevo Candidato
      </h1>
      <CandidateForm />
    </div>
  );
};

export default AddCandidate; 