import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Paper, 
  TextField, 
  Typography,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CandidateFormData } from '../../types/candidate';
import { candidateService } from '../../services/api';
import EducationForm from './EducationForm';
import ExperienceForm from './ExperienceForm';
import Notification from '../Notification';

// Expresión regular para validar teléfonos
const phoneRegex = /^(\+?\d{1,3}[-\s]?)?\(?(\d{3})\)?[-\s]?(\d{3})[-\s]?(\d{3,4})$/;

// Esquema de validación con Zod
const candidateSchema = z.object({
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  email: z.string().email('Correo electrónico inválido'),
  phone: z.string()
    .min(1, 'El teléfono es obligatorio')
    .regex(
      phoneRegex, 
      'Formato de teléfono inválido. Ejemplos válidos: 666777888, +34 666 777 888'
    ),
  address: z.string().min(1, 'La dirección es obligatoria'),
  education: z.array(
    z.object({
      institution: z.string().min(1, 'La institución es obligatoria'),
      degree: z.string().min(1, 'El título es obligatorio'),
      fieldOfStudy: z.string().min(1, 'El campo de estudio es obligatorio'),
      startDate: z.string().min(1, 'La fecha de inicio es obligatoria'),
      endDate: z.string().optional(),
      description: z.string().optional(),
    }).refine(data => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.startDate) <= new Date(data.endDate);
    }, {
      message: 'La fecha de finalización debe ser posterior a la fecha de inicio',
      path: ['endDate']
    })
  ).min(1, 'Debe agregar al menos una educación'),
  experience: z.array(
    z.object({
      company: z.string().min(1, 'La empresa es obligatoria'),
      position: z.string().min(1, 'El puesto es obligatorio'),
      startDate: z.string().min(1, 'La fecha de inicio es obligatoria'),
      endDate: z.string().optional(),
      description: z.string().optional(),
    }).refine(data => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.startDate) <= new Date(data.endDate);
    }, {
      message: 'La fecha de finalización debe ser posterior a la fecha de inicio',
      path: ['endDate']
    })
  ).min(1, 'Debe agregar al menos una experiencia'),
  cv: z.any().optional(),
});

type CandidateSchemaType = z.infer<typeof candidateSchema>;

const CandidateForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });
  
  const navigate = useNavigate();
  
  const methods = useForm<CandidateSchemaType>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
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
          startDate: '',
          description: '',
        },
      ],
      experience: [
        {
          company: '',
          position: '',
          startDate: '',
          description: '',
        },
      ],
    },
    mode: 'onChange', // Habilitar validación en tiempo real
  });
  
  const { register, handleSubmit, formState: { errors }, control, setError, clearErrors } = methods;
  
  // Observar cambios en los campos de email y teléfono para validación en tiempo real
  const email = useWatch({
    control,
    name: 'email'
  });
  
  const phone = useWatch({
    control,
    name: 'phone'
  });
  
  // Validar email en tiempo real
  useEffect(() => {
    if (!email) return;
    
    try {
      z.string().email('Correo electrónico inválido').parse(email);
      clearErrors('email');
    } catch (error) {
      setError('email', {
        type: 'manual',
        message: 'Correo electrónico inválido'
      });
    }
  }, [email, setError, clearErrors]);
  
  // Validar teléfono en tiempo real
  useEffect(() => {
    if (!phone) return;
    
    if (!phoneRegex.test(phone)) {
      setError('phone', {
        type: 'manual',
        message: 'Formato de teléfono inválido. Ejemplos válidos: 666777888, +34 666 777 888'
      });
    } else {
      clearErrors('phone');
    }
  }, [phone, setError, clearErrors]);
  
  const onSubmit = async (data: CandidateSchemaType) => {
    try {
      setLoading(true);
      
      // Convertir los datos del formulario al formato esperado por el backend
      const formData: CandidateFormData = {
        ...data,
        cv: data.cv && data.cv.length > 0 ? data.cv[0] : undefined,
      };
      
      console.log('Enviando datos del formulario:', {
        ...formData,
        cv: formData.cv ? 'Archivo presente' : 'Sin archivo'
      });
      
      await candidateService.createCandidate(formData);
      
      setNotification({
        open: true,
        message: 'Candidato añadido exitosamente',
        severity: 'success',
      });
      
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: any) {
      console.error('Error al crear el candidato:', error);
      
      // Extraer el mensaje de error
      let errorMessage = 'Error al añadir el candidato. Por favor, inténtelo de nuevo.';
      
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error.message || errorMessage;
      }
      
      setNotification({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };
  
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Añadir Candidato
        </Typography>
        
        <FormProvider {...methods}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  {...register('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  {...register('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dirección"
                  {...register('address')}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ mb: 3, mt: 2 }}>
                  <EducationForm />
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ mb: 3, mt: 2 }}>
                  <ExperienceForm />
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Curriculum Vitae
                </Typography>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  {...register('cv')}
                  style={{ marginBottom: '16px' }}
                />
                {errors.cv && (
                  <Typography color="error" variant="body2">
                    {errors.cv.message?.toString()}
                  </Typography>
                )}
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Guardando...' : 'Guardar Candidato'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </FormProvider>
      </Paper>
      
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
      />
    </Container>
  );
};

export default CandidateForm; 