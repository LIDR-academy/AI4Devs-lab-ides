import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from 'react-select';
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
  Alert 
} from 'react-bootstrap';

interface FormularioCandidatoProps {
  candidatoId?: string;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

type Option = {
  value: string;
  label: string;
};

const FormularioCandidato: React.FC<FormularioCandidatoProps> = ({
  candidatoId,
  onSubmitSuccess,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Para autocompletado
  const [educacionOptions, setEducacionOptions] = useState<Option[]>([]);
  const [experienciaOptions, setExperienciaOptions] = useState<Option[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
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
            // No es posible cargar el CV ya existente en el input file
          }
        } catch (error) {
          console.error('Error al cargar candidato', error);
          setErrorMessage('Error al cargar los datos del candidato');
        }
      }
    };

    fetchCandidato();
  }, [candidatoId, setValue]);

  // Función para cargar sugerencias de autocompletado de educación
  const fetchEducacionSuggestions = async (inputValue: string) => {
    try {
      const suggestions = await candidatoService.getAutocompleteSuggestions('educacion', inputValue);
      return suggestions.map(item => ({ value: item, label: item }));
    } catch (error) {
      console.error('Error al obtener sugerencias de educación', error);
      return [];
    }
  };

  // Función para cargar sugerencias de autocompletado de experiencia
  const fetchExperienciaSuggestions = async (inputValue: string) => {
    try {
      const suggestions = await candidatoService.getAutocompleteSuggestions('experiencia_laboral', inputValue);
      return suggestions.map(item => ({ value: item, label: item }));
    } catch (error) {
      console.error('Error al obtener sugerencias de experiencia', error);
      return [];
    }
  };

  // Manejar cambio en input de educación para autocompletado
  const handleEducacionInputChange = async (inputValue: string) => {
    if (inputValue.length > 2) {
      const options = await fetchEducacionSuggestions(inputValue);
      setEducacionOptions(options);
    } else {
      setEducacionOptions([]);
    }
  };

  // Manejar cambio en input de experiencia para autocompletado
  const handleExperienciaInputChange = async (inputValue: string) => {
    if (inputValue.length > 2) {
      const options = await fetchExperienciaSuggestions(inputValue);
      setExperienciaOptions(options);
    } else {
      setExperienciaOptions([]);
    }
  };

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
              {/* Educación con autocompletado */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Educación</Form.Label>
                  <Controller
                    name="educacion"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={educacionOptions}
                        onInputChange={handleEducacionInputChange}
                        onChange={(option) => field.onChange(option ? option.value : '')}
                        value={field.value ? { value: field.value, label: field.value } : null}
                        placeholder="Seleccione o escriba su nivel educativo"
                        isClearable
                        isSearchable
                        className="basic-single"
                        classNamePrefix="select"
                      />
                    )}
                  />
                  {errors.educacion && (
                    <div className="text-danger mt-1 small">
                      {errors.educacion.message}
                    </div>
                  )}
                </Form.Group>
              </Col>
              
              {/* Experiencia Laboral con autocompletado */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Experiencia Laboral</Form.Label>
                  <Controller
                    name="experiencia_laboral"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={experienciaOptions}
                        onInputChange={handleExperienciaInputChange}
                        onChange={(option) => field.onChange(option ? option.value : '')}
                        value={field.value ? { value: field.value, label: field.value } : null}
                        placeholder="Seleccione o escriba su experiencia laboral"
                        isClearable
                        isSearchable
                        className="basic-single"
                        classNamePrefix="select"
                      />
                    )}
                  />
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