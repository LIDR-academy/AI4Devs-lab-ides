import React, { useState } from 'react';
import CandidateForm from './CandidateForm';
import './AddCandidateButton.css';

const AddCandidateButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button className="add-candidate-button" onClick={openModal}>
        <span className="icon">+</span>
        <span className="text">Añadir Candidato</span>
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Añadir Nuevo Candidato</h2>
              <button className="close-modal-button" onClick={closeModal}>×</button>
            </div>
            <div className="modal-content">
              <CandidateForm onClose={closeModal} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddCandidateButton; 