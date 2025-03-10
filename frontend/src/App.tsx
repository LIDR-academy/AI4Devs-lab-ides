import React, { useState, useEffect } from 'react';
import './App.css';
import AddCandidateForm from './components/AddCandidateForm';
import Modal from './components/Modal';
import CandidateTable from './components/CandidateTable';
import Toast from './components/Toast';
import { config } from './config/config';

interface Candidate {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion: string;
  educacion: string;
  experiencia: string;
  cvUrl: string;
}

interface ToastState {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'success',
    visible: false
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${config.api.baseUrl}/api/candidates`);
      if (!response.ok) {
        throw new Error('Error al cargar los candidatos');
      }
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({
      message,
      type,
      visible: true
    });
  };

  const handleSubmitSuccess = () => {
    handleCloseModal();
    fetchCandidates();
    showToast('Candidato agregado exitosamente', 'success');
  };

  const handleSubmitError = (error: string) => {
    showToast(error, 'error');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Sistema de Gestión de Talento</h1>
        <p className="App-description">
          Dashboard del Reclutador
        </p>
        <button className="add-candidate-button" onClick={handleOpenModal}>
          Añadir Candidato
        </button>
      </header>

      <CandidateTable candidates={candidates} />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddCandidateForm 
          onSubmitSuccess={handleSubmitSuccess}
          onSubmitError={handleSubmitError}
        />
      </Modal>

      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, visible: false }))}
        />
      )}
    </div>
  );
}

export default App;
