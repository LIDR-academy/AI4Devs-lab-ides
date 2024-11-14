import React, { useState } from 'react';
import { Modal } from '../components/common/Modal';
import { AddCandidateForm } from '../components/candidates/AddCandidateForm';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard de Reclutamiento</h1>
        <button 
          className="add-candidate-button"
          onClick={() => setIsModalOpen(true)}
        >
          Añadir Candidato
        </button>
      </header>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        <AddCandidateForm />
      </Modal>
    </div>
  );
}; 