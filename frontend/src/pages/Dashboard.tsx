import React, { useState } from 'react';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import CandidateModal from '../components/candidates/CandidateModal';

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCandidateAdded = () => {
    // In a real app, you might refresh the candidate list or show a notification
    console.log('Candidate added successfully');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        </div>
      </header>
      
      {/* Main content */}
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Action buttons */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Candidatos</h2>
            <button
              type="button"
              onClick={openModal}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <UserPlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Añadir Candidato
            </button>
          </div>
          
          {/* Placeholder content - in a real app, this would be a table of candidates */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center py-10">
                <p className="text-gray-500">
                  Aquí se mostrarán los candidatos. Utiliza el botón "Añadir Candidato" para agregar nuevos candidatos al sistema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Candidate Modal */}
      <CandidateModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSuccess={handleCandidateAdded} 
      />
    </div>
  );
};

export default Dashboard; 