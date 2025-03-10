import React from 'react';
import AddCandidateForm from './components/AddCandidateForm';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Añadir Candidato</h1>
        <AddCandidateForm />
      </div>
    </div>
  );
};

export default App;
