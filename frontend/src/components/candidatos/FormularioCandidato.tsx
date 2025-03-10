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
import '../../styles/FormularioStyles.css';

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
  const { notifySuccess, notifyError } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors },
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
    <Container className="py-4">
      <Card className="form-card shadow">
        <Card.Body className="form-container">
          <Card.Title className="form-title d-flex justify-content-between align-items-center">
            <h2 className="h4 mb-0">{candidatoId ? 'Editar Candidato' : 'Añadir Nuevo Candidato'}</h2>
            {isFetchingData && (
              <div className="d-flex align-items-center">
                <Spinner animation="border" size="sm" className="me-2" />
                <span className="small text-muted">Cargando datos...</span>
              </div>
            )}
          </Card.Title>
          
          {errorMessage && (
            <Alert variant="danger" role="alert" aria-live="assertive">
              {errorMessage}
            </Alert>
          )}
          
          {successMessage && (
            <Alert variant="success" role="alert" aria-live="polite">
              {successMessage}
            </Alert>
          )}
          
          <Form 
            onSubmit={handleSubmit(onSubmit)} 
            noValidate 
            className="needs-validation"
            aria-label={candidatoId ? 'Formulario de edición de candidato' : 'Formulario de nuevo candidato'}
          >
            <div className="d-flex flex-column gap-3">
              {/* Primera fila: Nombre y apellido */}
              <div className="d-flex flex-column flex-md-row gap-3">
                {/* Nombre */}
                <div className="flex-grow-1">
                  <Form.Group controlId="formNombre">
                    <Form.Label className="form-label">
                      Nombre <span className="text-danger" aria-hidden="true">*</span>
                      <span className="sr-only">obligatorio</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nombre del candidato"
                      className={errors.nombre ? 'is-invalid' : ''}
                      aria-invalid={errors.nombre ? 'true' : 'false'}
                      aria-describedby={errors.nombre ? 'nombre-error' : undefined}
                      disabled={isFetchingData || isSubmitting}
                      {...register('nombre')}
                    />
                    {errors.nombre && (
                      <Form.Control.Feedback type="invalid" id="nombre-error">
                        {errors.nombre.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </div>
                
                {/* Apellido */}
                <div className="flex-grow-1">
                  <Form.Group controlId="formApellido">
                    <Form.Label className="form-label">
                      Apellido <span className="text-danger" aria-hidden="true">*</span>
                      <span className="sr-only">obligatorio</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Apellido del candidato"
                      className={errors.apellido ? 'is-invalid' : ''}
                      aria-invalid={errors.apellido ? 'true' : 'false'}
                      aria-describedby={errors.apellido ? 'apellido-error' : undefined}
                      disabled={isFetchingData || isSubmitting}
                      {...register('apellido')}
                    />
                    {errors.apellido && (
                      <Form.Control.Feedback type="invalid" id="apellido-error">
                        {errors.apellido.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </div>
              </div>
              
              {/* Segunda fila: Email y teléfono */}
              <div className="d-flex flex-column flex-md-row gap-3">
                {/* Email */}
                <div className="flex-grow-1">
                  <Form.Group controlId="formEmail">
                    <Form.Label className="form-label">
                      Correo Electrónico <span className="text-danger" aria-hidden="true">*</span>
                      <span className="sr-only">obligatorio</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="ejemplo@correo.com"
                      className={errors.email ? 'is-invalid' : ''}
                      aria-invalid={errors.email ? 'true' : 'false'}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      disabled={isFetchingData || isSubmitting}
                      {...register('email')}
                    />
                    {errors.email && (
                      <Form.Control.Feedback type="invalid" id="email-error">
                        {errors.email.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </div>
                
                {/* Teléfono */}
                <div className="flex-grow-1">
                  <Form.Group controlId="formTelefono">
                    <Form.Label className="form-label">
                      Teléfono <span className="text-danger" aria-hidden="true">*</span>
                      <span className="sr-only">obligatorio</span>
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="+1 234 567 8900"
                      className={errors.telefono ? 'is-invalid' : ''}
                      aria-invalid={errors.telefono ? 'true' : 'false'}
                      aria-describedby={errors.telefono ? 'telefono-error' : undefined}
                      disabled={isFetchingData || isSubmitting}
                      {...register('telefono')}
                    />
                    {errors.telefono && (
                      <Form.Control.Feedback type="invalid" id="telefono-error">
                        {errors.telefono.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </div>
              </div>
              
              {/* Dirección */}
              <Form.Group controlId="formDireccion">
                <Form.Label className="form-label">Dirección</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Dirección del candidato (opcional)"
                  className={errors.direccion ? 'is-invalid' : ''}
                  aria-invalid={errors.direccion ? 'true' : 'false'}
                  aria-describedby={errors.direccion ? 'direccion-error' : undefined}
                  disabled={isFetchingData || isSubmitting}
                  {...register('direccion')}
                />
                {errors.direccion && (
                  <Form.Control.Feedback type="invalid" id="direccion-error">
                    {errors.direccion.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              
              {/* Tercera fila: Educación y Experiencia */}
              <div className="d-flex flex-column flex-md-row gap-3">
                {/* Educación */}
                <div className="flex-grow-1">
                  <Form.Group controlId="formEducacion" className="position-relative">
                    <Form.Label className="form-label">Educación</Form.Label>
                    <div className="autocomplete-container">
                      <div className="d-flex">
                        <Form.Control
                          type="text"
                          placeholder="Nivel educativo (opcional)"
                          className={errors.educacion ? 'is-invalid' : ''}
                          aria-invalid={errors.educacion ? 'true' : 'false'}
                          aria-describedby={errors.educacion ? 'educacion-error' : undefined}
                          aria-autocomplete="list"
                          aria-controls="educacion-listbox"
                          aria-expanded={mostrarListaEducacion ? 'true' : 'false'}
                          disabled={isFetchingData || isSubmitting || loadingSugerencias}
                          value={inputEducacion}
                          onChange={(e) => {
                            setInputEducacion(e.target.value);
                            setValue('educacion', e.target.value);
                            trigger('educacion');
                            setMostrarListaEducacion(true);
                          }}
                          onFocus={() => setMostrarListaEducacion(true)}
                          onBlur={() => setTimeout(() => setMostrarListaEducacion(false), 200)}
                        />
                        {inputEducacion && (
                          <Button 
                            variant="outline-secondary"
                            onClick={limpiarEducacion}
                            disabled={isFetchingData || isSubmitting}
                            aria-label="Limpiar campo de educación"
                          >
                            <span aria-hidden="true">×</span>
                          </Button>
                        )}
                      </div>
                      {loadingSugerencias && (
                        <div className="position-absolute end-0 top-50 translate-middle-y pe-3">
                          <Spinner animation="border" size="sm" aria-hidden="true" />
                          <span className="sr-only">Cargando sugerencias</span>
                        </div>
                      )}
                      {errors.educacion && (
                        <div className="invalid-feedback d-block" id="educacion-error">
                          {errors.educacion.message}
                        </div>
                      )}
                      {mostrarListaEducacion && educacionSugerencias.length > 0 && (
                        <ul 
                          className="suggestion-list list-group shadow-sm p-0 m-0"
                          id="educacion-listbox"
                          role="listbox"
                          aria-label="Sugerencias de educación"
                        >
                          {educacionSugerencias.map((sugerencia, index) => (
                            <li 
                              key={index} 
                              className="suggestion-item list-group-item list-group-item-action"
                              role="option"
                              aria-selected={inputEducacion === sugerencia}
                              onClick={() => seleccionarEducacion(sugerencia)}
                            >
                              {sugerencia}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Form.Group>
                </div>
                
                {/* Experiencia Laboral */}
                <div className="flex-grow-1">
                  <Form.Group controlId="formExperiencia" className="position-relative">
                    <Form.Label className="form-label">Experiencia Laboral</Form.Label>
                    <div className="autocomplete-container">
                      <div className="d-flex">
                        <Form.Control
                          type="text"
                          placeholder="Experiencia laboral (opcional)"
                          className={errors.experiencia_laboral ? 'is-invalid' : ''}
                          aria-invalid={errors.experiencia_laboral ? 'true' : 'false'}
                          aria-describedby={errors.experiencia_laboral ? 'experiencia-error' : undefined}
                          aria-autocomplete="list"
                          aria-controls="experiencia-listbox"
                          aria-expanded={mostrarListaExperiencia ? 'true' : 'false'}
                          disabled={isFetchingData || isSubmitting || loadingSugerencias}
                          value={inputExperiencia}
                          onChange={(e) => {
                            setInputExperiencia(e.target.value);
                            setValue('experiencia_laboral', e.target.value);
                            trigger('experiencia_laboral');
                            setMostrarListaExperiencia(true);
                          }}
                          onFocus={() => setMostrarListaExperiencia(true)}
                          onBlur={() => setTimeout(() => setMostrarListaExperiencia(false), 200)}
                        />
                        {inputExperiencia && (
                          <Button 
                            variant="outline-secondary"
                            onClick={limpiarExperiencia}
                            disabled={isFetchingData || isSubmitting}
                            aria-label="Limpiar campo de experiencia"
                          >
                            <span aria-hidden="true">×</span>
                          </Button>
                        )}
                      </div>
                      {loadingSugerencias && (
                        <div className="position-absolute end-0 top-50 translate-middle-y pe-3">
                          <Spinner animation="border" size="sm" aria-hidden="true" />
                          <span className="sr-only">Cargando sugerencias</span>
                        </div>
                      )}
                      {errors.experiencia_laboral && (
                        <div className="invalid-feedback d-block" id="experiencia-error">
                          {errors.experiencia_laboral.message}
                        </div>
                      )}
                      {mostrarListaExperiencia && experienciaSugerencias.length > 0 && (
                        <ul 
                          className="suggestion-list list-group shadow-sm p-0 m-0"
                          id="experiencia-listbox"
                          role="listbox"
                          aria-label="Sugerencias de experiencia laboral"
                        >
                          {experienciaSugerencias.map((sugerencia, index) => (
                            <li 
                              key={index} 
                              className="suggestion-item list-group-item list-group-item-action"
                              role="option"
                              aria-selected={inputExperiencia === sugerencia}
                              onClick={() => seleccionarExperiencia(sugerencia)}
                            >
                              {sugerencia}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Form.Group>
                </div>
              </div>
              
              {/* CV */}
              <Form.Group controlId="formCV" className="my-2">
                <Form.Label className="form-label">
                  Curriculum Vitae {!candidatoId && <span className="text-danger" aria-hidden="true">*</span>}
                  {!candidatoId && <span className="sr-only">obligatorio</span>}
                </Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className={errors.cv ? 'is-invalid' : ''}
                  aria-invalid={errors.cv ? 'true' : 'false'}
                  aria-describedby="cv-help cv-error"
                  disabled={isFetchingData || isSubmitting}
                  {...register('cv')}
                />
                <Form.Text id="cv-help" className="text-muted">
                  Sube el CV del candidato en formato PDF o DOCX. {!candidatoId && 'Obligatorio para nuevos candidatos.'}
                </Form.Text>
                {errors.cv && (
                  <Form.Control.Feedback type="invalid" id="cv-error">
                    {errors.cv.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              
              {/* Botones de acción */}
              <div className="d-flex flex-column flex-md-row justify-content-end gap-2 mt-4 button-container">
                <Button 
                  variant="outline-secondary" 
                  onClick={onCancel}
                  disabled={isSubmitting}
                  aria-label="Cancelar y volver"
                  className="order-md-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={isSubmitting || isFetchingData}
                  aria-label={isSubmitting ? 'Procesando solicitud' : candidatoId ? 'Actualizar candidato' : 'Guardar candidato'}
                  className="order-md-2"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    candidatoId ? 'Actualizar Candidato' : 'Guardar Candidato'
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormularioCandidato; 