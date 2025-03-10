import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';

// Esquema de validación para el formulario
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es obligatorio'),
  password: Yup.string()
    .required('La contraseña es obligatoria')
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Manejar envío del formulario
  const handleSubmit = async (values: { email: string; password: string }, { setSubmitting }: any) => {
    try {
      setError(null);
      const success = await login(values.email, values.password);
      
      if (success) {
        navigate('/');
      }
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-5">
              <h2 className="text-center text-primary mb-4">Iniciar Sesión</h2>
              
              {error && (
                <Alert variant="danger">{error}</Alert>
              )}
              
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <FormikForm>
                    <Form.Group controlId="email" className="mb-3">
                      <Form.Label>Correo Electrónico</Form.Label>
                      <Field
                        name="email"
                        type="email"
                        as={Form.Control}
                        placeholder="Ingrese su correo electrónico"
                      />
                      <ErrorMessage name="email" component="div" className="text-danger mt-1" />
                    </Form.Group>

                    <Form.Group controlId="password" className="mb-4">
                      <Form.Label>Contraseña</Form.Label>
                      <Field
                        name="password"
                        type="password"
                        as={Form.Control}
                        placeholder="Ingrese su contraseña"
                      />
                      <ErrorMessage name="password" component="div" className="text-danger mt-1" />
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                        size="lg"
                        className="mb-3"
                      >
                        {isSubmitting ? (
                          <>
                            <Spinner size="sm" animation="border" className="me-2" />
                            Iniciando Sesión...
                          </>
                        ) : (
                          'Iniciar Sesión'
                        )}
                      </Button>
                    </div>
                  </FormikForm>
                )}
              </Formik>

              <div className="text-center mt-4">
                <p className="mb-2">
                  ¿No tiene una cuenta? <Link to="/register">Registrarse</Link>
                </p>
                <p>
                  <Link to="/forgot-password">¿Olvidó su contraseña?</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login; 