import React, { useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  IconButton,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  LinearProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';

const AddCandidate = () => {
  const [educationFields, setEducationFields] = useState([{ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }]);
  const [experienceFields, setExperienceFields] = useState([{ company: '', position: '', description: '', startDate: '', endDate: '' }]);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Constantes para la validación de archivos
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB en bytes
  const VALID_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const FILE_TYPE_NAMES = {
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX'
  };

  // API base URL - ajustar según la configuración del proyecto
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010/api';

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required('El nombre es obligatorio')
      .max(50, 'El nombre no puede tener más de 50 caracteres'),
    lastName: Yup.string()
      .required('El apellido es obligatorio')
      .max(50, 'El apellido no puede tener más de 50 caracteres'),
    email: Yup.string()
      .email('Correo electrónico inválido')
      .required('El correo electrónico es obligatorio'),
    phone: Yup.string()
      .matches(/^[0-9+\s()-]{8,15}$/, 'Número de teléfono inválido')
      .required('El teléfono es obligatorio'),
    address: Yup.string()
      .required('La dirección es obligatoria')
      .max(200, 'La dirección no puede tener más de 200 caracteres'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (!file) {
          setFileError('Por favor, sube el CV del candidato');
          return;
        }

        setLoading(true);
        
        // Crear FormData para enviar datos y archivo
        const formData = new FormData();
        
        // Añadir datos personales
        formData.append('firstName', values.firstName);
        formData.append('lastName', values.lastName);
        formData.append('email', values.email);
        formData.append('phone', values.phone);
        formData.append('address', values.address);
        
        // Añadir educación como JSON string
        formData.append('education', JSON.stringify(educationFields));
        
        // Añadir experiencia como JSON string
        formData.append('experience', JSON.stringify(experienceFields));
        
        // Añadir archivo CV
        formData.append('cv', file);
        
        // Configurar opciones para seguimiento de progreso de carga
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted > 95 ? 95 : percentCompleted);
          },
        };
        
        // Enviar datos al servidor
        const response = await axios.post(`${API_BASE_URL}/candidates`, formData, config);
        
        // Procesar respuesta exitosa
        setUploadProgress(100);
        
        setTimeout(() => {
          setLoading(false);
          setSnackbar({
            open: true,
            message: `Candidato añadido exitosamente con ID: ${response.data.id || 'N/A'}`,
            severity: 'success'
          });
          
          // Resetear el formulario
          formik.resetForm();
          setEducationFields([{ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }]);
          setExperienceFields([{ company: '', position: '', description: '', startDate: '', endDate: '' }]);
          setFile(null);
          setFilePreview(null);
          setUploadProgress(0);
          setFileError('');
        }, 500);
        
      } catch (error) {
        setLoading(false);
        setUploadProgress(0);
        
        // Manejar diferentes tipos de errores
        let errorMessage = 'Error al añadir el candidato';
        
        if (error.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          const statusCode = error.response.status;
          const serverMessage = error.response.data?.message || 'Error desconocido';
          
          if (statusCode === 400) {
            errorMessage = `Error de validación: ${serverMessage}`;
          } else if (statusCode === 401 || statusCode === 403) {
            errorMessage = 'No tienes permisos para realizar esta acción';
          } else if (statusCode === 413) {
            errorMessage = 'El archivo es demasiado grande para ser procesado por el servidor';
          } else if (statusCode >= 500) {
            errorMessage = `Error del servidor: ${serverMessage}`;
          } else {
            errorMessage = `Error (${statusCode}): ${serverMessage}`;
          }
        } else if (error.request) {
          // La solicitud se realizó pero no se recibió respuesta
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        } else {
          // Error al configurar la solicitud
          errorMessage = `Error de configuración: ${error.message}`;
        }
        
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
        
        console.error('Error completo:', error);
      }
    },
  });

  // Manejar campos de educación
  const handleAddEducation = () => {
    setEducationFields([...educationFields, { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }]);
  };

  const handleRemoveEducation = (index) => {
    const newFields = [...educationFields];
    newFields.splice(index, 1);
    setEducationFields(newFields);
  };

  const handleEducationChange = (index, field, value) => {
    const newFields = [...educationFields];
    newFields[index][field] = value;
    setEducationFields(newFields);
  };

  // Manejar campos de experiencia laboral
  const handleAddExperience = () => {
    setExperienceFields([...experienceFields, { company: '', position: '', description: '', startDate: '', endDate: '' }]);
  };

  const handleRemoveExperience = (index) => {
    const newFields = [...experienceFields];
    newFields.splice(index, 1);
    setExperienceFields(newFields);
  };

  const handleExperienceChange = (index, field, value) => {
    const newFields = [...experienceFields];
    newFields[index][field] = value;
    setExperienceFields(newFields);
  };

  // Manejar carga de archivo
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFileError('');
    
    if (!selectedFile) {
      return;
    }

    // Validar tipo de archivo
    if (!VALID_FILE_TYPES.includes(selectedFile.type)) {
      setFileError('Por favor, sube un archivo PDF o DOCX');
      return;
    }

    // Validar tamaño de archivo
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError(`El archivo es demasiado grande. El tamaño máximo es 5MB. Tu archivo tiene ${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    setFile(selectedFile);
    
    // Crear vista previa para PDF
    if (selectedFile.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(selectedFile);
      setFilePreview(fileUrl);
    } else {
      // Para DOCX solo mostramos un icono
      setFilePreview(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
    setFileError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Función para formatear el tamaño del archivo
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Añadir Nuevo Candidato
        </Typography>
        
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Información personal */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Información Personal
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="Nombre"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Apellido"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Correo Electrónico"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Teléfono"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Dirección"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>
            
            {/* Educación */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Educación
                </Typography>
                <Button 
                  startIcon={<AddIcon />} 
                  onClick={handleAddEducation}
                  variant="outlined"
                  size="small"
                >
                  Añadir Educación
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            {educationFields.map((field, index) => (
              <Grid item xs={12} key={`education-${index}`}>
                <Paper variant="outlined" sx={{ p: 2, position: 'relative' }}>
                  {index > 0 && (
                    <IconButton 
                      size="small" 
                      onClick={() => handleRemoveEducation(index)}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Institución"
                        value={field.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Título"
                        value={field.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Campo de Estudio"
                        value={field.fieldOfStudy}
                        onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Fecha de Inicio"
                        type="date"
                        value={field.startDate}
                        onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Fecha de Finalización"
                        type="date"
                        value={field.endDate}
                        onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
            
            {/* Experiencia Laboral */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Experiencia Laboral
                </Typography>
                <Button 
                  startIcon={<AddIcon />} 
                  onClick={handleAddExperience}
                  variant="outlined"
                  size="small"
                >
                  Añadir Experiencia
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            {experienceFields.map((field, index) => (
              <Grid item xs={12} key={`experience-${index}`}>
                <Paper variant="outlined" sx={{ p: 2, position: 'relative' }}>
                  {index > 0 && (
                    <IconButton 
                      size="small" 
                      onClick={() => handleRemoveExperience(index)}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Empresa"
                        value={field.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Cargo"
                        value={field.position}
                        onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Descripción"
                        multiline
                        rows={2}
                        value={field.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Fecha de Inicio"
                        type="date"
                        value={field.startDate}
                        onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Fecha de Finalización"
                        type="date"
                        value={field.endDate}
                        onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
            
            {/* Carga de CV */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Curriculum Vitae
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              {!file ? (
                <Box>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<UploadFileIcon />}
                    sx={{ py: 1.5, border: '1px dashed' }}
                  >
                    Subir CV (PDF o DOCX, máx. 5MB)
                    <input
                      type="file"
                      hidden
                      ref={fileInputRef}
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {fileError && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                      {fileError}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {file.type === 'application/pdf' ? (
                        <PictureAsPdfIcon color="error" sx={{ mr: 1 }} />
                      ) : (
                        <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                      )}
                      <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                        {file.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatFileSize(file.size)}
                      </Typography>
                    </Box>
                    
                    {filePreview && file.type === 'application/pdf' && (
                      <Box sx={{ mt: 2, mb: 2, height: '200px', overflow: 'hidden' }}>
                        <iframe
                          src={filePreview}
                          title="Vista previa del PDF"
                          width="100%"
                          height="100%"
                          style={{ border: 'none' }}
                        />
                      </Box>
                    )}
                    
                    {!filePreview && file.type.includes('docx') && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <DescriptionIcon sx={{ fontSize: 80, color: '#4285F4' }} />
                      </Box>
                    )}
                    
                    <Typography variant="body2" color="text.secondary">
                      Tipo: {FILE_TYPE_NAMES[file.type] || file.type}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<CloseIcon />} 
                      onClick={handleRemoveFile}
                      color="error"
                    >
                      Eliminar
                    </Button>
                  </CardActions>
                </Card>
              )}
            </Grid>
            
            {/* Botón de envío */}
            <Grid item xs={12}>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{ minWidth: 200 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Añadir Candidato'}
                </Button>
              </Box>
              
              {loading && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    {uploadProgress < 100 ? 'Subiendo datos y CV...' : 'Procesando...'}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      {/* Snackbar para mensajes */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddCandidate; 