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
  FormControl,
  Spinner
} from 'react-bootstrap';
import { useNotification } from '../../context/NotificationContext';

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
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Para autocompletado
  const [educacionSugerencias, setEducacionSugerencias] = useState<string[]>([]);
  const [experienciaSugerencias, setExperienciaSugerencias] = useState<string[]>([]);
  const [mostrarListaEducacion, setMostrarListaEducacion] = useState(false);
  const [mostrarListaExperiencia, setMostrarListaExperiencia] = useState(false);
  const [inputEducacion, setInputEducacion] = useState('');
  const [inputExperiencia, setInputExperiencia] = useState('');
  const [loadingSugerencias, setLoadingSugerencias] = useState(false);

  // Hook para notificaciones
  const { notifySuccess, notifyError, notifyInfo } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
    trigger
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
    },
    mode: 'onChange' // Validar al cambiar campos
  });

  const educacionValue = watch('educacion');
  const experienciaValue = watch('experiencia_laboral');

  // Cargar datos del candidato en caso de edición
  useEffect(() => {
    const fetchCandidato = async () => {
      if (candidatoId) {
        setIsFetchingData(true);
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
          notifyError('No se pudieron cargar los datos del candidato');
        } finally {
          setIsFetchingData(false);
        }
      }
    };

    fetchCandidato();
  }, [candidatoId, setValue, notifyError]);

  // Actualizar sugerencias de educación cuando cambia el input
  useEffect(() => {
    const buscarSugerenciasEducacion = async () => {
      if (inputEducacion.length >= 2) {
        setLoadingSugerencias(true);
        try {
          const sugerencias = await candidatoService.getAutocompleteSuggestions('educacion', inputEducacion);
          setEducacionSugerencias(sugerencias);
        } catch (error) {
          console.error('Error al buscar sugerencias de educación:', error);
        } finally {
          setLoadingSugerencias(false);
        }
      } else if (inputEducacion.length === 0) {
        setLoadingSugerencias(true);
        try {
          // Cargar sugerencias iniciales
          const sugerenciasIniciales = await candidatoService.getAutocompleteSuggestions('educacion', '');
          setEducacionSugerencias(sugerenciasIniciales.slice(0, 5));
        } catch (error) {
          console.error('Error al cargar sugerencias iniciales de educación:', error);
        } finally {
          setLoadingSugerencias(false);
        }
      }
    };

    buscarSugerenciasEducacion();
  }, [inputEducacion]);

  // Actualizar sugerencias de experiencia cuando cambia el input
  useEffect(() => {
    const buscarSugerenciasExperiencia = async () => {
      if (inputExperiencia.length >= 2) {
        setLoadingSugerencias(true);
        try {
          const sugerencias = await candidatoService.getAutocompleteSuggestions('experiencia_laboral', inputExperiencia);
          setExperienciaSugerencias(sugerencias);
        } catch (error) {
          console.error('Error al buscar sugerencias de experiencia:', error);
        } finally {
          setLoadingSugerencias(false);
        }
      } else if (inputExperiencia.length === 0) {
        setLoadingSugerencias(true);
        try {
          // Cargar sugerencias iniciales
          const sugerenciasIniciales = await candidatoService.getAutocompleteSuggestions('experiencia_laboral', '');
          setExperienciaSugerencias(sugerenciasIniciales.slice(0, 5));
        } catch (error) {
          console.error('Error al cargar sugerencias iniciales de experiencia:', error);
        } finally {
          setLoadingSugerencias(false);
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
    trigger('educacion'); // Validar el campo
  };

  // Manejar selección de sugerencia de experiencia
  const seleccionarExperiencia = (sugerencia: string) => {
    setValue('experiencia_laboral', sugerencia);
    setInputExperiencia(sugerencia);
    setMostrarListaExperiencia(false);
    trigger('experiencia_laboral'); // Validar el campo
  };

  // Limpiar campo de educación
  const limpiarEducacion = () => {
    setValue('educacion', '');
    setInputEducacion('');
    trigger('educacion'); // Validar el campo
  };

  // Limpiar campo de experiencia
  const limpiarExperiencia = () => {
    setValue('experiencia_laboral', '');
    setInputExperiencia('');
    trigger('experiencia_laboral'); // Validar el campo
  };

  // Cargar sugerencias iniciales al montar el componente
  useEffect(() => {
    const cargarSugerenciasIniciales = async () => {
      setLoadingSugerencias(true);
      try {
        const sugerenciasEducacion = await candidatoService.getAutocompleteSuggestions('educacion', '');
        setEducacionSugerencias(sugerenciasEducacion.slice(0, 5));
        
        const sugerenciasExperiencia = await candidatoService.getAutocompleteSuggestions('experiencia_laboral', '');
        setExperienciaSugerencias(sugerenciasExperiencia.slice(0, 5));
      } catch (error) {
        console.error('Error al cargar sugerencias iniciales:', error);
      } finally {
        setLoadingSugerencias(false);
      }
    };
    
    cargarSugerenciasIniciales();
  }, []);

  // Enviar formulario
  const onSubmit = async (data: CandidatoFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    // Verificar que el CV esté presente para nuevos candidatos
    if (!candidatoId && (!data.cv || data.cv.length === 0)) {
      setErrorMessage('Debe subir un CV para continuar');
      notifyError('El CV es obligatorio para nuevos candidatos');
      setIsSubmitting(false);
      return;
    }
    
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
        notifyError(response.mensaje || 'Error al procesar la solicitud');
      } else {
        setSuccessMessage(response.mensaje || 'Operación realizada con éxito');
        notifySuccess(response.mensaje || 'Operación realizada con éxito');
        reset();
        setInputEducacion('');
        setInputExperiencia('');
        setTimeout(() => {
          onSubmitSuccess();
        }, 1500);
      }
    } catch (error) {
      console.error('Error al enviar formulario', error);
      setErrorMessage('Error al procesar la solicitud. Intente de nuevo más tarde.');
      notifyError('Error al procesar la solicitud. Intente de nuevo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="my-4">
      <Card className="shadow">
        <Card.Body>
          <Card.Title className="mb-4 d-flex justify-content-between align-items-center">
            <span>{candidatoId ? 'Editar Candidato' : 'Añadir Nuevo Candidato'}</span>
            {isFetchingData && (
              <div className="d-flex align-items-center">
                <Spinner animation="border" size="sm" className="me-2" />
                <span className="small text-muted">Cargando datos...</span>
              </div>
            )}
          </Card.Title>
          
          {errorMessage && (
            <Alert variant="danger">{errorMessage}</Alert>
          )}
          
          {successMessage && (
            <Alert variant="success">{successMessage}</Alert>
          )}
          
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Row className="mb-3">
              {/* Nombre */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Nombre <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre del candidato"
                    isInvalid={!!errors.nombre}
                    disabled={isFetchingData || isSubmitting}
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
                  <Form.Label>
                    Apellido <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Apellido del candidato"
                    isInvalid={!!errors.apellido}
                    disabled={isFetchingData || isSubmitting}
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
                  <Form.Label>
                    Correo Electrónico <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="ejemplo@correo.com"
                    isInvalid={!!errors.email}
                    disabled={isFetchingData || isSubmitting}
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
                  <Form.Label>
                    Teléfono <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="+1 234 567 8900"
                    isInvalid={!!errors.telefono}
                    disabled={isFetchingData || isSubmitting}
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
                placeholder="Dirección del candidato (opcional)"
                isInvalid={!!errors.direccion}
                disabled={isFetchingData || isSubmitting}
                {...register('direccion')}
              />
              {errors.direccion && (
                <Form.Control.Feedback type="invalid">
                  {errors.direccion.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            
            <Row className="mb-3">
              {/* Educación */}
              <Col md={6}>
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Educación</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="text"
                      placeholder="Nivel educativo (opcional)"
                      isInvalid={!!errors.educacion}
                      disabled={isFetchingData || isSubmitting || loadingSugerencias}
                      value={inputEducacion}
                      onChange={(e) => {
                        setInputEducacion(e.target.value);
                        setValue('educacion', e.target.value);
                        trigger('educacion');
                      }}
                      onFocus={() => setMostrarListaEducacion(true)}
                    />
                    {inputEducacion && (
                      <Button 
                        variant="outline-secondary"
                        onClick={limpiarEducacion}
                        disabled={isFetchingData || isSubmitting}
                      >
                        ×
                      </Button>
                    )}
                    {loadingSugerencias && (
                      <div className="position-absolute top-0 end-0 mt-2 me-4">
                        <Spinner animation="border" size="sm" />
                      </div>
                    )}
                  </div>
                  {errors.educacion && (
                    <div className="invalid-feedback d-block">
                      {errors.educacion.message}
                    </div>
                  )}
                  {mostrarListaEducacion && educacionSugerencias.length > 0 && (
                    <div className="sugerencias-dropdown">
                      <ul className="list-group shadow-sm">
                        {educacionSugerencias.map((sugerencia, index) => (
                          <li 
                            key={index} 
                            className="list-group-item list-group-item-action"
                            onClick={() => seleccionarEducacion(sugerencia)}
                          >
                            {sugerencia}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Form.Group>
              </Col>
              
              {/* Experiencia Laboral */}
              <Col md={6}>
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Experiencia Laboral</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="text"
                      placeholder="Experiencia laboral (opcional)"
                      isInvalid={!!errors.experiencia_laboral}
                      disabled={isFetchingData || isSubmitting || loadingSugerencias}
                      value={inputExperiencia}
                      onChange={(e) => {
                        setInputExperiencia(e.target.value);
                        setValue('experiencia_laboral', e.target.value);
                        trigger('experiencia_laboral');
                      }}
                      onFocus={() => setMostrarListaExperiencia(true)}
                    />
                    {inputExperiencia && (
                      <Button 
                        variant="outline-secondary"
                        onClick={limpiarExperiencia}
                        disabled={isFetchingData || isSubmitting}
                      >
                        ×
                      </Button>
                    )}
                    {loadingSugerencias && (
                      <div className="position-absolute top-0 end-0 mt-2 me-4">
                        <Spinner animation="border" size="sm" />
                      </div>
                    )}
                  </div>
                  {errors.experiencia_laboral && (
                    <div className="invalid-feedback d-block">
                      {errors.experiencia_laboral.message}
                    </div>
                  )}
                  {mostrarListaExperiencia && experienciaSugerencias.length > 0 && (
                    <div className="sugerencias-dropdown">
                      <ul className="list-group shadow-sm">
                        {experienciaSugerencias.map((sugerencia, index) => (
                          <li 
                            key={index} 
                            className="list-group-item list-group-item-action"
                            onClick={() => seleccionarExperiencia(sugerencia)}
                          >
                            {sugerencia}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            
            {/* CV */}
            <Form.Group className="mb-4">
              <Form.Label>
                Curriculum Vitae {!candidatoId && <span className="text-danger">*</span>}
              </Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,.doc,.docx"
                isInvalid={!!errors.cv}
                disabled={isFetchingData || isSubmitting}
                {...register('cv')}
              />
              <Form.Text className="text-muted">
                Sube el CV del candidato en formato PDF o DOCX. {!candidatoId && 'Obligatorio para nuevos candidatos.'}
              </Form.Text>
              {errors.cv && (
                <Form.Control.Feedback type="invalid">
                  {errors.cv.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button 
                variant="outline-secondary" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={isSubmitting || isFetchingData}
              >
                {isSubmitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Procesando...
                  </>
                ) : (
                  candidatoId ? 'Actualizar Candidato' : 'Guardar Candidato'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      
      {/* Estilos adicionales para el autocompletado */}
      <style dangerouslySetInnerHTML={{ __html: `
        .sugerencias-dropdown {
          position: absolute;
          width: 100%;
          z-index: 1000;
          max-height: 200px;
          overflow-y: auto;
        }
        .list-group-item {
          cursor: pointer;
        }
        .list-group-item:hover {
          background-color: #f8f9fa;
        }
      `}} />
    </Container>
  );
};

export default FormularioCandidato; 