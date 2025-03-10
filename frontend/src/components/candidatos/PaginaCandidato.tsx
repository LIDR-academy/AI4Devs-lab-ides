import React, { useState } from 'react';
import FormularioCandidato from './FormularioCandidato';

const PaginaCandidato: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);

  const handleAddClick = () => {
    setEditingId(undefined);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    // Aquí podría ir una función para refrescar la lista de candidatos
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>Gestión de Candidatos</h1>
        {!showForm && (
          <button
            onClick={handleAddClick}
            type="button"
            style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem'
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }}
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Añadir Candidato
          </button>
        )}
      </div>

      {showForm ? (
        <FormularioCandidato
          candidatoId={editingId}
          onSubmitSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p style={{ color: '#4b5563' }}>
            Aquí se mostrará la lista de candidatos.
            <br />
            Haga clic en "Añadir Candidato" para agregar un nuevo candidato al sistema.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaginaCandidato; 