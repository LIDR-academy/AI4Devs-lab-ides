import React, { useState, useEffect, useRef } from 'react';
import { 
  Alert,
  Box, 
  Button, 
  CircularProgress,
  Divider, 
  Grid, 
  TextField, 
  Typography 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { Candidate, SkillLevel } from '../../types';
import { addCandidate } from '../../services/api';

// Importar componentes de campos
import SkillFormField from './SkillFormField';
import EducationFormField from './EducationFormField';
import ExperienceFormField from './ExperienceFormField';
import TagsFormField from './TagsFormField';

// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('El nombre es obligatorio'),
  lastName: Yup.string().required('El apellido es obligatorio'),
  email: Yup.string().email('Email no válido').required('El email es obligatorio'),
  phone: Yup.string().required('El teléfono es obligatorio'),
  skills: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('El nombre de la habilidad es obligatorio'),
      level: Yup.string().required('El nivel es obligatorio')
    })
  ),
  educations: Yup.array().of(
    Yup.object().shape({
      institution: Yup.string().required('La institución es obligatoria'),
      degree: Yup.string().required('El título es obligatorio'),
      startDate: Yup.string().required('La fecha de inicio es obligatoria')
    })
  ),
  experiences: Yup.array().of(
    Yup.object().shape({
      company: Yup.string().required('La empresa es obligatoria'),
      position: Yup.string().required('El puesto es obligatorio'),
      startDate: Yup.string().required('La fecha de inicio es obligatoria')
    })
  )
});

// Valores iniciales para el formulario
const initialValues: Candidate = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  currentPosition: '',
  currentCompany: '',
  yearsOfExperience: undefined,
  skills: [{ name: '', level: SkillLevel.INTERMEDIATE }],
  educations: [],
  experiences: [],
  cv: null,
  notes: '',
  tags: []
};

// Función para encontrar el primer error en los objetos de errores de Formik
const findFirstError = (errors: FormikErrors<Candidate>, touched: any): string | null => {
  if (!errors || Object.keys(errors).length === 0) return null;
  
  // Lista de campos en el orden que aparecen en el formulario
  const fieldOrder = [
    'firstName', 'lastName', 'email', 'phone', 
    'address', 'city', 'state', 'postalCode', 'country',
    'currentPosition', 'currentCompany', 'yearsOfExperience',
    'skills', 'educations', 'experiences', 'notes', 'tags'
  ];
  
  // Buscar el primer campo con error que también haya sido tocado
  for (const field of fieldOrder) {
    if (errors[field as keyof Candidate] && touched[field]) {
      return field;
    }
  }
  
  return null;
};

// Función para hacer scroll al primer campo con error
const scrollToError = (errorField: string | null): void => {
  if (!errorField) return;
  
  // Buscar por ID del campo o por nombre del campo
  const selector = `#${errorField}, [name="${errorField}"], [name^="${errorField}["]`;
  const element = document.querySelector(selector);
  
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

// Función para hacer scroll al inicio del formulario
const scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const CandidateForm: React.FC = () => {
  const navigate = useNavigate();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const formikRef = useRef<any>(null);
  const formErrorsRef = useRef<FormikErrors<Candidate>>({});
  const formTouchedRef = useRef<any>({});
  
  // Efecto para hacer scroll al primer error cuando cambian los errores
  useEffect(() => {
    if (Object.keys(formErrorsRef.current).length > 0 && Object.keys(formTouchedRef.current).length > 0) {
      const firstErrorField = findFirstError(formErrorsRef.current, formTouchedRef.current);
      scrollToError(firstErrorField);
    }
  }, []); // Este efecto se ejecuta solo una vez al montar el componente, los refs se actualizan en el renderizado
  
  // Efecto para hacer scroll al principio cuando se muestra el mensaje de éxito o error
  useEffect(() => {
    if (success || error) {
      scrollToTop();
    }
  }, [success, error]); // Dependencia de ambos estados: success y error
  
  const handleSubmit = async (values: Candidate, { setSubmitting, validateForm, setTouched }: any) => {
    setError(null);
    setSuccess(null);
    
    // Validar que se ha subido un CV
    if (!cvFile) {
      setError('Es necesario adjuntar un CV');
      setSubmitting(false);
      
      // Ya no necesitamos hacer scroll aquí, porque el useEffect lo hará automáticamente
      return;
    }
    
    try {
      const response = await addCandidate(values, cvFile);
      
      if (response.success) {
        setSuccess(response.message || 'Candidato añadido con éxito');
        // El scroll al principio ahora se maneja por el useEffect
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        // Mostrar información detallada sobre los errores de validación
        if (response.validationErrors && response.validationErrors.length > 0) {
          const errorDetails = response.validationErrors
            .map((err: any) => {
              const fieldName = err.param || err.field || '';
              const message = err.msg || err.message || '';
              return fieldName ? `${fieldName}: ${message}` : message;
            })
            .join('\n');
            
          setError(`Error de validación:\n${errorDetails}`);
        } else {
          setError(response.error || 'Ha ocurrido un error al añadir el candidato');
        }
      }
    } catch (error) {
      setError('Ha ocurrido un error inesperado');
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (allowedTypes.includes(file.type)) {
        setCvFile(file);
        setError(null);
      } else {
        setCvFile(null);
        setError('El formato del CV debe ser PDF o DOCX');
      }
    }
  };
  
  return (
    <Box id="form-top">
      <Typography variant="h4" gutterBottom>
        Añadir Nuevo Candidato
      </Typography>
      <Divider sx={{ mb: 4 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.includes('\n') ? (
            <>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Se encontraron los siguientes errores:
              </Typography>
              <ul style={{ marginTop: 0, paddingLeft: '20px' }}>
                {error.split('\n').map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </>
          ) : (
            error
          )}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setTouched }) => {
          // Actualizar las referencias cuando cambian los errores y touched
          formErrorsRef.current = errors;
          formTouchedRef.current = touched;
          
          return (
            <Form>
              <Typography variant="h6" gutterBottom>
                Información Personal
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    id="firstName"
                    name="firstName"
                    label="Nombre"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    id="lastName"
                    name="lastName"
                    label="Apellido"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    id="email"
                    name="email"
                    label="Correo Electrónico"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    id="phone"
                    name="phone"
                    label="Teléfono"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>
              </Grid>
              
              <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
                Dirección
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="address"
                    name="address"
                    label="Dirección"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="city"
                    name="city"
                    label="Ciudad"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="state"
                    name="state"
                    label="Población"
                    value={values.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="postalCode"
                    name="postalCode"
                    label="Código Postal"
                    value={values.postalCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="country"
                    name="country"
                    label="País"
                    value={values.country}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
              </Grid>
              
              <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
                Información Profesional
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="currentPosition"
                    name="currentPosition"
                    label="Profesión Actual"
                    value={values.currentPosition}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="currentCompany"
                    name="currentCompany"
                    label="Empresa Actual"
                    value={values.currentCompany}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    label="Años de Experiencia"
                    type="number"
                    value={values.yearsOfExperience || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputProps={{ inputProps: { min: 0, max: 50 } }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      CV (PDF o DOCX) *
                    </Typography>
                    <input
                      required
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      id="cv-upload"
                      type="file"
                      onChange={handleFileChange}
                      style={{ width: '100%' }}
                    />
                    {cvFile && (
                      <Typography variant="caption" display="block" gutterBottom>
                        Archivo seleccionado: {cvFile.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 4 }} />
              
              {/* Componentes de campos dinámicos */}
              <SkillFormField />
              <Divider sx={{ my: 4 }} />
              
              <EducationFormField />
              <Divider sx={{ my: 4 }} />
              
              <ExperienceFormField />
              <Divider sx={{ my: 4 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="notes"
                    name="notes"
                    label="Notas"
                    multiline
                    rows={4}
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
              </Grid>
              
              <TagsFormField />
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancelar
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  onClick={() => {
                    // Al hacer clic en el botón de envío, marcamos todos los campos como tocados
                    // para activar la validación y mostrar todos los errores
                    if (Object.keys(errors).length > 0) {
                      const touchedFields = Object.keys(initialValues).reduce((acc, key) => {
                        acc[key] = true;
                        return acc;
                      }, {} as any);
                      setTouched(touchedFields);
                    }
                  }}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Candidato'}
                </Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default CandidateForm; 