import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { candidateService } from '../services/api';
import { Candidate } from '../types';

const Dashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await candidateService.getAll();
      if (response.success) {
        setCandidates(response.data);
      } else {
        setError(response.message);
      }
    } catch (error: any) {
      setError(error.message || 'Error al cargar los candidatos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este candidato?')) {
      try {
        const response = await candidateService.delete(id);
        if (response.success) {
          toast.success('Candidato eliminado exitosamente');
          fetchCandidates();
        } else {
          toast.error(response.message);
        }
      } catch (error: any) {
        toast.error(error.message || 'Error al eliminar el candidato');
      }
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center text-primary">Sistema de Gestión de Candidatos</h1>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col className="d-flex justify-content-end">
          <Link to="/candidates/new">
            <Button variant="primary">
              <i className="bi bi-plus-circle me-2"></i>
              Añadir Nuevo Candidato
            </Button>
          </Link>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3">Cargando candidatos...</p>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : candidates.length === 0 ? (
                <Alert variant="info">
                  No hay candidatos registrados. ¡Añade el primero!
                </Alert>
              ) : (
                <Table striped hover responsive>
                  <thead className="bg-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Educación</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((candidate) => (
                      <tr key={candidate.id}>
                        <td>{`${candidate.firstName} ${candidate.lastName}`}</td>
                        <td>{candidate.email}</td>
                        <td>{candidate.phone || 'N/A'}</td>
                        <td>{candidate.education || 'N/A'}</td>
                        <td>
                          <Link to={`/candidates/${candidate.id}`} className="btn btn-sm btn-info me-2">
                            <i className="bi bi-eye"></i> Ver
                          </Link>
                          <Link to={`/candidates/edit/${candidate.id}`} className="btn btn-sm btn-warning me-2">
                            <i className="bi bi-pencil"></i> Editar
                          </Link>
                          <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => candidate.id && handleDelete(candidate.id)}
                          >
                            <i className="bi bi-trash"></i> Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; 