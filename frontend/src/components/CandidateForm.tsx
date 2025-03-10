import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  Button, 
  TextField, 
  Grid, 
  Typography, 
  Paper, 
  Box,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { createCandidate } from '../services/api';
import { Candidate } from '../types';

// Esquema de validación con Yup
const validationSchema = Yup.object({
  firstName: Yup.string().required('El nombre es obligatorio'),
  lastName: Yup.string().required('El apellido es obligatorio'),
  email: Yup.string()
    .email('Ingrese un correo electrónico válido')
    .required('El correo electrónico es obligatorio'),
  phone: Yup.string(),
  address: Yup.string(),
  education: Yup.string(),
  workExperience: Yup.string(),
});

// Valores iniciales del formulario
const initialValues: Candidate = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  education: '',
  workExperience: '',
};

const CandidateForm: React.FC = () => {
  // Estado para manejar el archivo CV
  const [cvFile, setCvFile] = useState<File | null>(null);
  
  // Estado para manejar las notificaciones
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  
  // Función para manejar el envío del formulario
  const handleSubmit = async (values: Candidate, { resetForm, setSubmitting }: any) => {
    try {
      const response = await createCandidate(values, cvFile || undefined);
      
      if (response.error) {
        // Si hay un error, mostrar notificación de error
        setNotification({
          open: true,
          message: response.error,
          severity: 'error',
        });
      } else {
        // Si todo va bien, mostrar notificación de éxito
        setNotification({
          open: true,
          message: 'Candidato añadido exitosamente',
          severity: 'success',
        });
        
        // Resetear el formulario
        resetForm();
        setCvFile(null);
      }
    } catch (error) {
      // Si hay un error inesperado, mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al crear el candidato',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Función para manejar el cambio de archivo CV
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setCvFile(event.target.files[0]);
    }
  };
  
  // Función para cerrar la notificación
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };
  
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Añadir Nuevo Candidato
      </Typography>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Nombre"
                  name="firstName"
                  variant="outlined"
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Apellido"
                  name="lastName"
                  variant="outlined"
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Correo Electrónico"
                  name="email"
                  variant="outlined"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Teléfono"
                  name="phone"
                  variant="outlined"
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Dirección"
                  name="address"
                  variant="outlined"
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Educación"
                  name="education"
                  variant="outlined"
                  multiline
                  rows={3}
                  error={touched.education && Boolean(errors.education)}
                  helperText={touched.education && errors.education}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Experiencia Laboral"
                  name="workExperience"
                  variant="outlined"
                  multiline
                  rows={3}
                  error={touched.workExperience && Boolean(errors.workExperience)}
                  helperText={touched.workExperience && errors.workExperience}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    CV (PDF o DOCX)
                  </Typography>
                  <input
                    accept=".pdf,.docx,.doc"
                    style={{ display: 'none' }}
                    id="cv-file"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="cv-file">
                    <Button variant="contained" component="span">
                      Subir CV
                    </Button>
                  </label>
                  {cvFile && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Archivo seleccionado: {cvFile.name}
                    </Typography>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                >
                  {isSubmitting ? 'Enviando...' : 'Añadir Candidato'}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
      
      {/* Notificación de éxito o error */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CandidateForm; 