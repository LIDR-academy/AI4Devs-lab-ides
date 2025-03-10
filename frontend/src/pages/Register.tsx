import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';

// Esquema de validación para el formulario
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es obligatorio'),
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es obligatorio'),
  password: Yup.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/, 'La contraseña debe tener al menos una letra mayúscula')
    .matches(/[a-z]/, 'La contraseña debe tener al menos una letra minúscula')
    .matches(/[0-9]/, 'La contraseña debe tener al menos un número')
    .matches(/[^A-Za-z0-9]/, 'La contraseña debe tener al menos un caracter especial')
    .required('La contraseña es obligatoria'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('Debe confirmar la contraseña')
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Manejar envío del formulario
  const handleSubmit = async (values: { name: string; email: string; password: string }, { setSubmitting }: any) => {
    try {
      setError(null);
      const success = await register(values.email, values.password, values.name);
      
      if (success) {
        setSuccess(true);
        // Redirigir al login después de un tiempo
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error: any) {
      setError(error.message || 'Error al registrar usuario');
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
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-5">
              <h2 className="text-center text-primary mb-4">Crear Cuenta</h2>
              
              {error && (
                <Alert variant="danger">{error}</Alert>
              )}
              
              {success && (
                <Alert variant="success">
                  Registro exitoso. Serás redirigido a la página de inicio de sesión en unos segundos.
                </Alert>
              )}
              
              {!success && (
                <Formik
                  initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <FormikForm>
                      <Form.Group controlId="name" className="mb-3">
                        <Form.Label>Nombre Completo</Form.Label>
                        <Field
                          name="name"
                          type="text"
                          as={Form.Control}
                          placeholder="Ingrese su nombre completo"
                        />
                        <ErrorMessage name="name" component="div" className="text-danger mt-1" />
                      </Form.Group>

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

                      <Form.Group controlId="password" className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <Field
                          name="password"
                          type="password"
                          as={Form.Control}
                          placeholder="Ingrese su contraseña"
                        />
                        <ErrorMessage name="password" component="div" className="text-danger mt-1" />
                        <Form.Text className="text-muted">
                          La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un caracter especial.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group controlId="confirmPassword" className="mb-4">
                        <Form.Label>Confirmar Contraseña</Form.Label>
                        <Field
                          name="confirmPassword"
                          type="password"
                          as={Form.Control}
                          placeholder="Confirme su contraseña"
                        />
                        <ErrorMessage name="confirmPassword" component="div" className="text-danger mt-1" />
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
                              Registrando...
                            </>
                          ) : (
                            'Registrarse'
                          )}
                        </Button>
                      </div>
                    </FormikForm>
                  )}
                </Formik>
              )}

              <div className="text-center mt-4">
                <p>
                  ¿Ya tiene una cuenta? <Link to="/login">Iniciar Sesión</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register; 