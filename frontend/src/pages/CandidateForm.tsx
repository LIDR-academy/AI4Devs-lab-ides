import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { candidateService } from '../services/api';
import { Candidate } from '../types';

// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('El nombre es obligatorio'),
  lastName: Yup.string().required('El apellido es obligatorio'),
  email: Yup.string().email('Email inválido').required('El email es obligatorio'),
  phone: Yup.string().nullable(),
  address: Yup.string().nullable(),
  education: Yup.string().nullable(),
  workExperience: Yup.string().nullable()
});

const CandidateForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Valores iniciales para el formulario
  const initialValues: Candidate = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    workExperience: ''
  };

  useEffect(() => {
    // Si estamos en modo edición, cargar los datos del candidato
    if (isEditMode) {
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
    }
  }, [id, isEditMode]);

  const handleSubmit = async (values: Candidate, { setSubmitting }: any) => {
    try {
      setSubmitting(true);
      
      // Crear un objeto FormData para la carga de archivos
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key !== 'resume' && values[key as keyof Candidate] !== undefined) {
          formData.append(key, values[key as keyof Candidate] as string);
        }
      });

      // Añadir el archivo de CV si se seleccionó
      const resumeInput = document.getElementById('resume') as HTMLInputElement;
      if (resumeInput && resumeInput.files && resumeInput.files.length > 0) {
        formData.append('resume', resumeInput.files[0]);
      }

      let response;
      if (isEditMode) {
        response = await candidateService.update(Number(id), formData);
      } else {
        response = await candidateService.create(formData);
      }

      if (response.success) {
        toast.success(isEditMode 
          ? 'Candidato actualizado exitosamente' 
          : 'Candidato añadido exitosamente'
        );
        navigate('/');
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al procesar la solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando datos...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <div className="text-center mt-3">
          <Link to="/" className="btn btn-primary">Volver al Dashboard</Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center text-primary">
            {isEditMode ? 'Editar Candidato' : 'Añadir Nuevo Candidato'}
          </h1>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <Formik
                initialValues={candidate || initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, setFieldValue }) => (
                  <FormikForm>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="firstName">
                          <Form.Label>Nombre *</Form.Label>
                          <Field
                            as={Form.Control}
                            type="text"
                            name="firstName"
                            placeholder="Ingrese el nombre"
                            className="form-control"
                          />
                          <ErrorMessage name="firstName" component="div" className="text-danger mt-1" />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="lastName">
                          <Form.Label>Apellido *</Form.Label>
                          <Field
                            as={Form.Control}
                            type="text"
                            name="lastName"
                            placeholder="Ingrese el apellido"
                            className="form-control"
                          />
                          <ErrorMessage name="lastName" component="div" className="text-danger mt-1" />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="email">
                          <Form.Label>Correo Electrónico *</Form.Label>
                          <Field
                            as={Form.Control}
                            type="email"
                            name="email"
                            placeholder="Ingrese el correo electrónico"
                            className="form-control"
                          />
                          <ErrorMessage name="email" component="div" className="text-danger mt-1" />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="phone">
                          <Form.Label>Teléfono</Form.Label>
                          <Field
                            as={Form.Control}
                            type="text"
                            name="phone"
                            placeholder="Ingrese el número de teléfono"
                            className="form-control"
                          />
                          <ErrorMessage name="phone" component="div" className="text-danger mt-1" />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group controlId="address" className="mb-3">
                      <Form.Label>Dirección</Form.Label>
                      <Field
                        as={Form.Control}
                        type="text"
                        name="address"
                        placeholder="Ingrese la dirección"
                        className="form-control"
                      />
                      <ErrorMessage name="address" component="div" className="text-danger mt-1" />
                    </Form.Group>

                    <Form.Group controlId="education" className="mb-3">
                      <Form.Label>Educación</Form.Label>
                      <Field
                        as={Form.Control}
                        type="text"
                        name="education"
                        placeholder="Ingrese información educativa"
                        className="form-control"
                      />
                      <ErrorMessage name="education" component="div" className="text-danger mt-1" />
                    </Form.Group>

                    <Form.Group controlId="workExperience" className="mb-3">
                      <Form.Label>Experiencia Laboral</Form.Label>
                      <Field
                        as="textarea"
                        name="workExperience"
                        placeholder="Describa la experiencia laboral"
                        className="form-control"
                        rows={4}
                      />
                      <ErrorMessage name="workExperience" component="div" className="text-danger mt-1" />
                    </Form.Group>

                    <Form.Group controlId="resume" className="mb-4">
                      <Form.Label>Currículum (PDF o DOCX)</Form.Label>
                      <Form.Control
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue('resume', e.currentTarget.files && e.currentTarget.files[0]);
                        }}
                      />
                      <Form.Text className="text-muted">
                        Tamaño máximo: 5MB. Formatos aceptados: PDF, DOCX.
                      </Form.Text>
                    </Form.Group>

                    {candidate?.resumeUrl && (
                      <Alert variant="info" className="mb-4">
                        CV actual: {candidate.resumeUrl.split('/').pop()}
                      </Alert>
                    )}

                    <div className="d-flex justify-content-between mt-4">
                      <Link to="/" className="btn btn-secondary">
                        Cancelar
                      </Link>
                      <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                            Procesando...
                          </>
                        ) : (
                          isEditMode ? 'Actualizar Candidato' : 'Añadir Candidato'
                        )}
                      </Button>
                    </div>
                  </FormikForm>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CandidateForm; 