import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  Paper,
  Box,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import EducationForm from './EducationForm';
import ExperienceForm from './ExperienceForm';
import { candidateService } from '../../services/api';
import { CandidateFormValues } from '../../types/candidate';

// Esquema de validación para el formulario
const CandidateSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Demasiado corto')
    .max(50, 'Demasiado largo')
    .required('Nombre es requerido'),
  lastName: Yup.string()
    .min(2, 'Demasiado corto')
    .max(50, 'Demasiado largo')
    .required('Apellido es requerido'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email es requerido'),
  phone: Yup.string()
    .matches(/^[0-9+\s()-]{7,15}$/, 'Número de teléfono inválido')
    .nullable()
    .optional(),
  address: Yup.string()
    .nullable()
    .optional(),
  education: Yup.array().of(
    Yup.object().shape({
      institution: Yup.string().required('Institución es requerida'),
      degree: Yup.string().required('Título es requerido'),
      fieldOfStudy: Yup.string().nullable().optional(),
      startDate: Yup.date().required('Fecha de inicio es requerida'),
      endDate: Yup.date().nullable().optional(),
      description: Yup.string()
    })
  ),
  experience: Yup.array().of(
    Yup.object().shape({
      company: Yup.string().required('Empresa es requerida'),
      position: Yup.string().required('Cargo es requerido'),
      location: Yup.string().required('Ubicación es requerida'),
      startDate: Yup.date().required('Fecha de inicio es requerida'),
      endDate: Yup.date().nullable(),
      description: Yup.string()
    })
  ),
  cvFile: Yup.mixed().nullable()
});

// Valores iniciales para el formulario
const initialValues: CandidateFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  education: [
    {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      description: ''
    }
  ],
  experience: [
    {
      company: '',
      position: '',
      location: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      description: ''
    }
  ],
  cvFile: null
};

const CandidateForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<CandidateFormValues>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Cargar datos del candidato si estamos en modo edición
  useEffect(() => {
    const fetchCandidate = async () => {
      if (id) {
        setIsEditMode(true);
        setLoadingData(true);
        try {
          const candidate = await candidateService.getCandidateById(parseInt(id));
          
          // Formatear las fechas para el formulario
          const formattedEducation = candidate.education?.map(edu => ({
            ...edu,
            startDate: new Date(edu.startDate).toISOString().split('T')[0],
            endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ''
          })) || [];

          const formattedExperience = candidate.experience?.map(exp => ({
            ...exp,
            startDate: new Date(exp.startDate).toISOString().split('T')[0],
            endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''
          })) || [];

          setInitialFormValues({
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            phone: candidate.phone,
            address: candidate.address,
            education: formattedEducation.length > 0 ? formattedEducation : initialValues.education,
            experience: formattedExperience.length > 0 ? formattedExperience : initialValues.experience,
            cvFile: null // No podemos cargar el archivo, solo la referencia
          });
        } catch (err: any) {
          console.error('Error al cargar candidato:', err);
          setError('Error al cargar los datos del candidato');
        } finally {
          setLoadingData(false);
        }
      }
    };

    fetchCandidate();
  }, [id]);

  const handleSubmit = async (values: CandidateFormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      
      // Añadir datos básicos
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('email', values.email);
      formData.append('phone', values.phone || '');
      formData.append('address', values.address || '');
      
      // Añadir educación y experiencia como JSON
      formData.append('education', JSON.stringify(values.education || []));
      formData.append('experience', JSON.stringify(values.experience || []));
      
      // Añadir archivo CV si existe
      if (values.cvFile) {
        formData.append('cvFile', values.cvFile);
      }
      
      // Depurar el contenido del FormData
      console.log('Valores del formulario:', values);
      console.log('FormData a enviar:');
      
      // Usar Array.from en lugar de for...of para evitar problemas de compatibilidad
      Array.from(formData.entries()).forEach(pair => {
        console.log(pair[0] + ': ' + pair[1]);
      });
      
      let response;
      if (isEditMode && id) {
        // Actualizar candidato existente
        response = await candidateService.updateCandidate(parseInt(id), formData);
        setSuccess('Candidato actualizado exitosamente');
      } else {
        // Crear nuevo candidato
        response = await candidateService.createCandidate(formData);
        setSuccess('Candidato creado exitosamente');
      }
      
      console.log('Respuesta del servidor:', response);
      
      // Redirigir después de un breve retraso
      setTimeout(() => {
        navigate('/candidates');
      }, 2000);
    } catch (err: any) {
      console.error('Error al guardar candidato:', err);
      
      // Manejar diferentes tipos de errores
      if (err.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        const errorMessage = err.response.data?.message || 'Error al guardar los datos del candidato';
        const errorDetails = err.response.data?.errors;
        
        if (errorDetails && Array.isArray(errorDetails)) {
          // Si hay detalles de errores específicos, mostrarlos
          setError(`${errorMessage}: ${errorDetails.map(e => e.message).join(', ')}`);
        } else {
          setError(errorMessage);
        }
      } else if (err.request) {
        // La solicitud se hizo pero no se recibió respuesta
        setError('No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.');
      } else {
        // Algo ocurrió al configurar la solicitud
        setError('Error al procesar la solicitud: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/candidates')}
          >
            Volver
          </Button>
          <Typography variant="h5" component="h1">
            {isEditMode ? 'Editar Candidato' : 'Añadir Nuevo Candidato'}
          </Typography>
        </Box>

        <Formik
          initialValues={initialFormValues}
          validationSchema={CandidateSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form>
              <Grid container spacing={3}>
                {/* Información Personal */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Información Personal
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="firstName"
                    label="Nombre"
                    fullWidth
                    variant="outlined"
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="lastName"
                    label="Apellido"
                    fullWidth
                    variant="outlined"
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    variant="outlined"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="phone"
                    label="Teléfono"
                    fullWidth
                    variant="outlined"
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="address"
                    label="Dirección"
                    fullWidth
                    variant="outlined"
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Curriculum Vitae
                    </Typography>
                    <input
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      id="cv-file"
                      type="file"
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        if (file) {
                          setFieldValue('cvFile', file);
                        }
                      }}
                    />
                    <label htmlFor="cv-file">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<AddIcon />}
                      >
                        Subir CV
                      </Button>
                    </label>
                    {values.cvFile && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Archivo seleccionado: {values.cvFile.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                
                {/* Educación */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Educación
                  </Typography>
                  <FieldArray name="education">
                    {(arrayHelpers) => (
                      <EducationForm 
                        values={values.education} 
                        errors={errors} 
                        touched={touched} 
                        arrayHelpers={arrayHelpers} 
                      />
                    )}
                  </FieldArray>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                
                {/* Experiencia */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Experiencia Laboral
                  </Typography>
                  <FieldArray name="experience">
                    {(arrayHelpers) => (
                      <ExperienceForm 
                        values={values.experience} 
                        errors={errors} 
                        touched={touched} 
                        arrayHelpers={arrayHelpers} 
                      />
                    )}
                  </FieldArray>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={24} /> : <SaveIcon />}
                      sx={{ minWidth: 150 }}
                    >
                      {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
      
      {/* Notificaciones */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CandidateForm;
