import React, { useState, useEffect } from 'react';
import FormularioCandidato from './FormularioCandidato';
import { Container, Button, Card, Table, Badge, Spinner, Form, InputGroup } from 'react-bootstrap';
import { candidatoService } from '../../services/api';

const PaginaCandidato: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [candidatos, setCandidatos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidato, setSelectedCandidato] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Cargar candidatos al montar el componente
  useEffect(() => {
    cargarCandidatos();
  }, []);

  // Función para cargar todos los candidatos
  const cargarCandidatos = async () => {
    setIsLoading(true);
    try {
      const response = await candidatoService.getCandidatos();
      if (response.data) {
        setCandidatos(response.data);
      }
    } catch (error) {
      console.error('Error al cargar candidatos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingId(undefined);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    cargarCandidatos(); // Recargar la lista después de añadir o editar
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowDetails(false);
  };

  const handleEditClick = (id: string) => {
    setEditingId(id);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleViewDetails = (candidato: any) => {
    setSelectedCandidato(candidato);
    setShowDetails(true);
  };

  const handleDeleteCandidato = async (id: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este candidato?')) {
      try {
        await candidatoService.deleteCandidato(id);
        cargarCandidatos(); // Recargar la lista después de eliminar
      } catch (error) {
        console.error('Error al eliminar candidato:', error);
      }
    }
  };

  // Filtrar candidatos por término de búsqueda
  const candidatosFiltrados = candidatos.filter(candidato => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      candidato.nombre.toLowerCase().includes(searchTermLower) ||
      candidato.apellido.toLowerCase().includes(searchTermLower) ||
      candidato.email.toLowerCase().includes(searchTermLower) ||
      (candidato.educacion && candidato.educacion.toLowerCase().includes(searchTermLower)) ||
      (candidato.experiencia_laboral && candidato.experiencia_laboral.toLowerCase().includes(searchTermLower))
    );
  });

  // Componente de detalles del candidato
  const DetallesCandidato = () => {
    if (!selectedCandidato) return null;
    
    return (
      <Card className="shadow-sm mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center bg-light">
          <h5 className="mb-0">Detalles del Candidato</h5>
          <Button variant="link" onClick={() => setShowDetails(false)}>Cerrar</Button>
        </Card.Header>
        <Card.Body>
          <div className="row mb-4">
            <div className="col-md-6">
              <h6 className="text-muted mb-1">Información Personal</h6>
              <p className="mb-1"><strong>Nombre:</strong> {selectedCandidato.nombre} {selectedCandidato.apellido}</p>
              <p className="mb-1"><strong>Email:</strong> {selectedCandidato.email}</p>
              <p className="mb-1"><strong>Teléfono:</strong> {selectedCandidato.telefono}</p>
              {selectedCandidato.direccion && (
                <p className="mb-1"><strong>Dirección:</strong> {selectedCandidato.direccion}</p>
              )}
            </div>
            <div className="col-md-6">
              <h6 className="text-muted mb-1">Formación y Experiencia</h6>
              {selectedCandidato.educacion && (
                <p className="mb-1"><strong>Educación:</strong> {selectedCandidato.educacion}</p>
              )}
              {selectedCandidato.experiencia_laboral && (
                <p className="mb-1"><strong>Experiencia:</strong> {selectedCandidato.experiencia_laboral}</p>
              )}
              <p className="mb-1"><strong>Fecha de registro:</strong> {new Date(selectedCandidato.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="d-flex gap-2 justify-content-end">
            <Button 
              variant="outline-primary"
              size="sm"
              onClick={() => {
                window.open(candidatoService.getCvUrl(selectedCandidato.id), '_blank');
              }}
            >
              Ver CV
            </Button>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => handleEditClick(selectedCandidato.id)}
            >
              Editar
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
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
      ) : showDetails ? (
        <DetallesCandidato />
      ) : (
        <Card className="shadow-sm">
          <Card.Body>
            {/* Buscador de candidatos */}
            <InputGroup className="mb-4">
              <Form.Control
                placeholder="Buscar candidatos por nombre, email, educación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setSearchTerm('')}
                >
                  ×
                </Button>
              )}
              <Button variant="outline-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </Button>
            </InputGroup>

            {isLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p className="mt-2 text-muted">Cargando candidatos...</p>
              </div>
            ) : candidatosFiltrados.length === 0 ? (
              <div className="text-center py-5">
                {searchTerm ? (
                  <p className="text-muted">No se encontraron candidatos que coincidan con "{searchTerm}"</p>
                ) : (
                  <p className="text-muted">No hay candidatos registrados. Haga clic en "Añadir Candidato" para comenzar.</p>
                )}
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Contacto</th>
                      <th>Educación</th>
                      <th>Experiencia</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidatosFiltrados.map((candidato) => (
                      <tr key={candidato.id} className="align-middle">
                        <td 
                          style={{ cursor: 'pointer' }} 
                          onClick={() => handleViewDetails(candidato)}
                        >
                          <div className="fw-semibold">{candidato.nombre} {candidato.apellido}</div>
                          <div className="text-muted small">
                            {new Date(candidato.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div className="small">{candidato.email}</div>
                          <div className="small text-muted">{candidato.telefono}</div>
                        </td>
                        <td>
                          {candidato.educacion ? (
                            <span className="small">{candidato.educacion}</span>
                          ) : (
                            <span className="text-muted small">No especificada</span>
                          )}
                        </td>
                        <td>
                          {candidato.experiencia_laboral ? (
                            <span className="small">{candidato.experiencia_laboral}</span>
                          ) : (
                            <span className="text-muted small">No especificada</span>
                          )}
                        </td>
                        <td className="text-end">
                          <div className="d-flex gap-1 justify-content-end">
                            <Button 
                              variant="link" 
                              className="p-1 text-primary" 
                              onClick={() => handleViewDetails(candidato)}
                              title="Ver detalles"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                              </svg>
                            </Button>
                            <Button 
                              variant="link" 
                              className="p-1 text-secondary" 
                              onClick={() => handleEditClick(candidato.id)}
                              title="Editar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                              </svg>
                            </Button>
                            <Button 
                              variant="link" 
                              className="p-1 text-danger" 
                              onClick={() => handleDeleteCandidato(candidato.id)}
                              title="Eliminar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                              </svg>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default PaginaCandidato; 