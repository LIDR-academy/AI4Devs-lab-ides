import React, { useState } from 'react';
import AddCandidateForm from './components/AddCandidateForm/AddCandidateForm';
import './App.css';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Seguimiento de Talento</h1>
      </header>
      <main className="App-main">
        <button onClick={openModal}>Añadir Nuevo Candidato</button> {/* Cambiar el texto del botón */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <AddCandidateForm />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
