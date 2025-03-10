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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Candidatos</h1>
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
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
          <p className="text-gray-600">
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