import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidatoSchema } from '../../utils/validations';
import { candidatoService } from '../../services/api';
import { CandidatoFormData } from '../../types/candidato';
import { 
  Form, 
  Button, 
  Container, 
  Row, 
  Col, 
  Card,
  Alert,
  FormControl
} from 'react-bootstrap';

interface FormularioCandidatoProps {
  candidatoId?: string;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

const FormularioCandidato: React.FC<FormularioCandidatoProps> = ({
  candidatoId,
  onSubmitSuccess,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Para autocompletado
  const [educacionSugerencias, setEducacionSugerencias] = useState<string[]>([]);
  const [experienciaSugerencias, setExperienciaSugerencias] = useState<string[]>([]);
  const [mostrarListaEducacion, setMostrarListaEducacion] = useState(false);
  const [mostrarListaExperiencia, setMostrarListaExperiencia] = useState(false);
  const [inputEducacion, setInputEducacion] = useState('');
  const [inputExperiencia, setInputExperiencia] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    reset
  } = useForm<CandidatoFormData>({
    resolver: zodResolver(candidatoSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '',
      educacion: '',
      experiencia_laboral: '',
      cv: undefined
    }
  });

  const educacionValue = watch('educacion');
  const experienciaValue = watch('experiencia_laboral');

  // Cargar datos del candidato en caso de edición
  useEffect(() => {
    const fetchCandidato = async () => {
      if (candidatoId) {
        try {
          const response = await candidatoService.getCandidatoById(candidatoId);
          
          if (response.data) {
            const candidato = response.data;
            // Rellenar el formulario con los datos del candidato
            setValue('nombre', candidato.nombre);
            setValue('apellido', candidato.apellido);
            setValue('email', candidato.email);
            setValue('telefono', candidato.telefono);
            setValue('direccion', candidato.direccion || '');
            setValue('educacion', candidato.educacion || '');
            setValue('experiencia_laboral', candidato.experiencia_laboral || '');
            
            // Actualizar los valores de los inputs
            setInputEducacion(candidato.educacion || '');
            setInputExperiencia(candidato.experiencia_laboral || '');
          }
        } catch (error) {
          console.error('Error al cargar candidato', error);
          setErrorMessage('Error al cargar los datos del candidato');
        }
      }
    };

    fetchCandidato();
  }, [candidatoId, setValue]);

  // Actualizar sugerencias de educación cuando cambia el input
  useEffect(() => {
    const buscarSugerenciasEducacion = async () => {
      if (inputEducacion.length >= 2) {
        try {
          const sugerencias = await candidatoService.getAutocompleteSuggestions('educacion', inputEducacion);
          setEducacionSugerencias(sugerencias);
        } catch (error) {
          console.error('Error al buscar sugerencias de educación:', error);
        }
      } else if (inputEducacion.length === 0) {
        try {
          // Cargar sugerencias iniciales
          const sugerenciasIniciales = await candidatoService.getAutocompleteSuggestions('educacion', '');
          setEducacionSugerencias(sugerenciasIniciales.slice(0, 5));
        } catch (error) {
          console.error('Error al cargar sugerencias iniciales de educación:', error);
        }
      }
    };

    buscarSugerenciasEducacion();
  }, [inputEducacion]);

  // Actualizar sugerencias de experiencia cuando cambia el input
  useEffect(() => {
    const buscarSugerenciasExperiencia = async () => {
      if (inputExperiencia.length >= 2) {
        try {
          const sugerencias = await candidatoService.getAutocompleteSuggestions('experiencia_laboral', inputExperiencia);
          setExperienciaSugerencias(sugerencias);
        } catch (error) {
          console.error('Error al buscar sugerencias de experiencia:', error);
        }
      } else if (inputExperiencia.length === 0) {
        try {
          // Cargar sugerencias iniciales
          const sugerenciasIniciales = await candidatoService.getAutocompleteSuggestions('experiencia_laboral', '');
          setExperienciaSugerencias(sugerenciasIniciales.slice(0, 5));
        } catch (error) {
          console.error('Error al cargar sugerencias iniciales de experiencia:', error);
        }
      }
    };

    buscarSugerenciasExperiencia();
  }, [inputExperiencia]);

  // Manejar selección de sugerencia de educación
  const seleccionarEducacion = (sugerencia: string) => {
    setValue('educacion', sugerencia);
    setInputEducacion(sugerencia);
    setMostrarListaEducacion(false);
  };

  // Manejar selección de sugerencia de experiencia
  const seleccionarExperiencia = (sugerencia: string) => {
    setValue('experiencia_laboral', sugerencia);
    setInputExperiencia(sugerencia);
    setMostrarListaExperiencia(false);
  };

  // Limpiar campo de educación
  const limpiarEducacion = () => {
    setValue('educacion', '');
    setInputEducacion('');
  };

  // Limpiar campo de experiencia
  const limpiarExperiencia = () => {
    setValue('experiencia_laboral', '');
    setInputExperiencia('');
  };

  // Cargar sugerencias iniciales al montar el componente
  useEffect(() => {
    const cargarSugerenciasIniciales = async () => {
      try {
        const sugerenciasEducacion = await candidatoService.getAutocompleteSuggestions('educacion', '');
        setEducacionSugerencias(sugerenciasEducacion.slice(0, 5));
        
        const sugerenciasExperiencia = await candidatoService.getAutocompleteSuggestions('experiencia_laboral', '');
        setExperienciaSugerencias(sugerenciasExperiencia.slice(0, 5));
      } catch (error) {
        console.error('Error al cargar sugerencias iniciales:', error);
      }
    };
    
    cargarSugerenciasIniciales();
  }, []);

  // Enviar formulario
  const onSubmit = async (data: CandidatoFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Crear un objeto FormData para enviar archivos
      const formData = new FormData();
      formData.append('nombre', data.nombre);
      formData.append('apellido', data.apellido);
      formData.append('email', data.email);
      formData.append('telefono', data.telefono);
      formData.append('direccion', data.direccion || '');
      formData.append('educacion', data.educacion || '');
      formData.append('experiencia_laboral', data.experiencia_laboral || '');
      
      // Añadir el archivo CV si existe
      if (data.cv && data.cv.length > 0) {
        formData.append('cv', data.cv[0]);
      }
      
      let response;
      if (candidatoId) {
        // Actualizar candidato existente
        response = await candidatoService.updateCandidato(candidatoId, formData);
      } else {
        // Crear nuevo candidato
        response = await candidatoService.createCandidato(formData);
      }
      
      if (response.error) {
        setErrorMessage(response.mensaje || 'Error al procesar la solicitud');
      } else {
        setSuccessMessage(response.mensaje || 'Operación realizada con éxito');
        reset();
        setInputEducacion('');
        setInputExperiencia('');
        setTimeout(() => {
          onSubmitSuccess();
        }, 2000);
      }
    } catch (error) {
      console.error('Error al enviar formulario', error);
      setErrorMessage('Error al procesar la solicitud. Intente de nuevo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="my-4">
      <Card className="shadow">
        <Card.Body>
          <Card.Title className="mb-4">
            {candidatoId ? 'Editar Candidato' : 'Añadir Nuevo Candidato'}
          </Card.Title>
          
          {errorMessage && (
            <Alert variant="danger">{errorMessage}</Alert>
          )}
          
          {successMessage && (
            <Alert variant="success">{successMessage}</Alert>
          )}
          
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="mb-3">
              {/* Nombre */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre del candidato"
                    isInvalid={!!errors.nombre}
                    {...register('nombre')}
                  />
                  {errors.nombre && (
                    <Form.Control.Feedback type="invalid">
                      {errors.nombre.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              
              {/* Apellido */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Apellido del candidato"
                    isInvalid={!!errors.apellido}
                    {...register('apellido')}
                  />
                  {errors.apellido && (
                    <Form.Control.Feedback type="invalid">
                      {errors.apellido.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              {/* Email */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico *</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="ejemplo@correo.com"
                    isInvalid={!!errors.email}
                    {...register('email')}
                  />
                  {errors.email && (
                    <Form.Control.Feedback type="invalid">
                      {errors.email.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              
              {/* Teléfono */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="+1234567890"
                    isInvalid={!!errors.telefono}
                    {...register('telefono')}
                  />
                  {errors.telefono && (
                    <Form.Control.Feedback type="invalid">
                      {errors.telefono.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>
            
            {/* Dirección */}
            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                placeholder="Dirección del candidato"
                isInvalid={!!errors.direccion}
                {...register('direccion')}
              />
              {errors.direccion && (
                <Form.Control.Feedback type="invalid">
                  {errors.direccion.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            
            <Row className="mb-3">
              {/* Educación con autocompletado personalizado */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Educación</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="text"
                      placeholder="Seleccione o escriba su nivel educativo"
                      value={inputEducacion}
                      isInvalid={!!errors.educacion}
                      onChange={(e) => {
                        const value = e.target.value;
                        setInputEducacion(value);
                        setValue('educacion', value);
                        setMostrarListaEducacion(true);
                      }}
                      onFocus={() => setMostrarListaEducacion(true)}
                      onBlur={() => {
                        // Retrasar para permitir la selección de opciones
                        setTimeout(() => setMostrarListaEducacion(false), 200);
                      }}
                    />
                    {inputEducacion && (
                      <Button 
                        variant="link" 
                        className="position-absolute end-0 top-50 translate-middle-y p-2"
                        onClick={limpiarEducacion}
                        style={{ zIndex: 5 }}
                      >
                        ×
                      </Button>
                    )}
                    {mostrarListaEducacion && educacionSugerencias.length > 0 && (
                      <div className="position-absolute w-100 mt-1 border rounded bg-white shadow-sm" style={{ zIndex: 1000 }}>
                        {educacionSugerencias.map((sugerencia, index) => (
                          <div 
                            key={index} 
                            className="px-3 py-2 cursor-pointer hover-bg-light"
                            onClick={() => seleccionarEducacion(sugerencia)}
                            style={{ cursor: 'pointer' }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                          >
                            {sugerencia}
                          </div>
                        ))}
                      </div>
                    )}
                    <input type="hidden" {...register('educacion')} />
                  </div>
                  {errors.educacion && (
                    <div className="text-danger mt-1 small">
                      {errors.educacion.message}
                    </div>
                  )}
                </Form.Group>
              </Col>
              
              {/* Experiencia Laboral con autocompletado personalizado */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Experiencia Laboral</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="text"
                      placeholder="Seleccione o escriba su experiencia laboral"
                      value={inputExperiencia}
                      isInvalid={!!errors.experiencia_laboral}
                      onChange={(e) => {
                        const value = e.target.value;
                        setInputExperiencia(value);
                        setValue('experiencia_laboral', value);
                        setMostrarListaExperiencia(true);
                      }}
                      onFocus={() => setMostrarListaExperiencia(true)}
                      onBlur={() => {
                        // Retrasar para permitir la selección de opciones
                        setTimeout(() => setMostrarListaExperiencia(false), 200);
                      }}
                    />
                    {inputExperiencia && (
                      <Button 
                        variant="link" 
                        className="position-absolute end-0 top-50 translate-middle-y p-2"
                        onClick={limpiarExperiencia}
                        style={{ zIndex: 5 }}
                      >
                        ×
                      </Button>
                    )}
                    {mostrarListaExperiencia && experienciaSugerencias.length > 0 && (
                      <div className="position-absolute w-100 mt-1 border rounded bg-white shadow-sm" style={{ zIndex: 1000 }}>
                        {experienciaSugerencias.map((sugerencia, index) => (
                          <div 
                            key={index} 
                            className="px-3 py-2 cursor-pointer hover-bg-light"
                            onClick={() => seleccionarExperiencia(sugerencia)}
                            style={{ cursor: 'pointer' }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                          >
                            {sugerencia}
                          </div>
                        ))}
                      </div>
                    )}
                    <input type="hidden" {...register('experiencia_laboral')} />
                  </div>
                  {errors.experiencia_laboral && (
                    <div className="text-danger mt-1 small">
                      {errors.experiencia_laboral.message}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            
            {/* CV Carga de archivo */}
            <Form.Group className="mb-4">
              <Form.Label>
                {candidatoId ? 'CV (opcional para actualización)' : 'CV *'}
              </Form.Label>
              <Form.Control
                type="file"
                isInvalid={!!errors.cv}
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                {...register('cv')}
              />
              <Form.Text className="text-muted">
                Formatos aceptados: PDF, DOC, DOCX. Tamaño máximo: 5MB
              </Form.Text>
              {errors.cv && (
                <Form.Control.Feedback type="invalid">
                  {errors.cv.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            
            {/* Botones de acción */}
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="light"
                type="button"
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : candidatoId ? 'Actualizar' : 'Guardar'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormularioCandidato; 