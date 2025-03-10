import React, { useState } from 'react';
import FormularioCandidato from './FormularioCandidato';
import { Container, Button, Card } from 'react-bootstrap';

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
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Gestión de Candidatos</h1>
        {!showForm && (
          <Button 
            variant="primary" 
            onClick={handleAddClick}
            className="d-flex align-items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              fill="currentColor" 
              className="bi bi-plus-circle me-2" 
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
            Añadir Candidato
          </Button>
        )}
      </div>

      {showForm ? (
        <FormularioCandidato
          candidatoId={editingId}
          onSubmitSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      ) : (
        <Card className="shadow-sm">
          <Card.Body className="text-muted p-4">
            <p>
              Aquí se mostrará la lista de candidatos.
              <br />
              Haga clic en "Añadir Candidato" para agregar un nuevo candidato al sistema.
            </p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default PaginaCandidato; 