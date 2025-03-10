import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { candidateService } from '../services/api';
import { Candidate } from '../types';

const CandidateDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const response = await candidateService.getById(Number(id));
        if (response.success) {
          setCandidate(response.data);
        } else {
          setError(response.message);
        }
      } catch (error: any) {
        setError(error.message || 'Error al cargar los datos del candidato');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('¿Está seguro de eliminar este candidato?')) {
      try {
        const response = await candidateService.delete(Number(id));
        if (response.success) {
          toast.success('Candidato eliminado exitosamente');
          navigate('/');
        } else {
          toast.error(response.message);
        }
      } catch (error: any) {
        toast.error(error.message || 'Error al eliminar el candidato');
      }
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando datos del candidato...</p>
      </Container>
    );
  }

  if (error || !candidate) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || 'No se encontró el candidato'}</Alert>
        <div className="text-center mt-3">
          <Link to="/" className="btn btn-primary">Volver al Dashboard</Link>
        </div>
      </Container>
    );
  }

  // Construir la URL completa para el archivo PDF
  const getFullResumeUrl = (relativeUrl: string | undefined) => {
    if (!relativeUrl) return '';
    // Usar la variable de entorno o el valor por defecto
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3010/api';
    // Extraer la base URL sin la parte /api
    const baseUrl = apiUrl.replace('/api', '');
    return `${baseUrl}${relativeUrl}`;
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center text-primary">Detalles del Candidato</h1>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">{`${candidate.firstName} ${candidate.lastName}`}</h3>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item>
                  <strong>Email:</strong> {candidate.email}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Teléfono:</strong> {candidate.phone || 'No especificado'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Dirección:</strong> {candidate.address || 'No especificada'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Educación:</strong> {candidate.education || 'No especificada'}
                </ListGroup.Item>
              </ListGroup>

              <Card className="mb-4">
                <Card.Header>
                  <strong>Experiencia Laboral</strong>
                </Card.Header>
                <Card.Body>
                  {candidate.workExperience ? (
                    <p style={{ whiteSpace: 'pre-line' }}>{candidate.workExperience}</p>
                  ) : (
                    <p className="text-muted">No se ha especificado experiencia laboral</p>
                  )}
                </Card.Body>
              </Card>

              {candidate.resumeUrl && (
                <div className="mb-4">
                  <h5>Currículum</h5>
                  <a 
                    href={getFullResumeUrl(candidate.resumeUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-info"
                  >
                    <i className="bi bi-file-earmark-text me-2"></i>
                    Ver CV
                  </a>
                </div>
              )}

              <div className="d-flex justify-content-between mt-4">
                <Link to="/" className="btn btn-secondary">
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver
                </Link>
                <div>
                  <Link to={`/candidates/edit/${candidate.id}`} className="btn btn-warning me-2">
                    <i className="bi bi-pencil me-2"></i>
                    Editar
                  </Link>
                  <Button variant="danger" onClick={handleDelete}>
                    <i className="bi bi-trash me-2"></i>
                    Eliminar
                  </Button>
                </div>
              </div>
            </Card.Body>
            <Card.Footer className="text-muted">
              <small>
                Añadido el {new Date(candidate.createdAt || '').toLocaleDateString()}
                {candidate.updatedAt && candidate.updatedAt !== candidate.createdAt 
                  ? ` • Última actualización: ${new Date(candidate.updatedAt).toLocaleDateString()}`
                  : ''
                }
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CandidateDetails; 