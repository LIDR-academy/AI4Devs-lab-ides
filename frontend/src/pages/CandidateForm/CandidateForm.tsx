import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Grid,
  IconButton
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Education, WorkExperience, Candidate } from '../../types';
import { candidateService } from '../../api/candidateService';
import { useNotification } from '../../contexts/NotificationContext';
import axios from 'axios';

interface CandidateFormData {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: Education[];
  workExperience: WorkExperience[];
}

const initialFormData: CandidateFormData = {
  name: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  education: [],
  workExperience: []
};

const mapCandidateToFormData = (candidate: Candidate): CandidateFormData => ({
  name: candidate.name,
  lastName: candidate.lastName,
  email: candidate.email,
  phone: candidate.phone || '',
  address: candidate.address || '',
  education: candidate.education || [],
  workExperience: candidate.workExperience || []
});

export const CandidateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CandidateFormData>(initialFormData);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (id) {
      const fetchCandidate = async () => {
        try {
          setLoading(true);
          const data = await candidateService.getById(parseInt(id));
          setFormData(mapCandidateToFormData(data));
        } catch (error) {
          console.error('Error fetching candidate:', error);
          // TODO: Mostrar mensaje de error
        } finally {
          setLoading(false);
        }
      };

      fetchCandidate();
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        startDate: '',
        endDate: ''
      }]
    }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, {
        company: '',
        position: '',
        startDate: '',
        description: ''
      }]
    }));
  };

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeWorkExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('candidate', JSON.stringify(formData));
      if (file) {
        formDataToSend.append('cv', file);
      }

      if (id) {
        await candidateService.update(parseInt(id), formDataToSend);
        showSuccess('Candidato actualizado exitosamente');
      } else {
        await candidateService.create(formDataToSend);
        showSuccess('Candidato creado exitosamente');
      }

      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error);
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        if (errorData?.details && Array.isArray(errorData.details)) {
          // Si hay múltiples errores de validación, mostrarlos todos
          showError(errorData.details.join('\n'));
        } else {
          showError(errorData?.error || 'Error al procesar la solicitud');
        }
      } else {
        showError('Error inesperado al procesar la solicitud');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          Nuevo Candidato
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Nombre"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Apellido"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Dirección"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
            >
              Subir CV
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </Button>
            {file && <Typography sx={{ ml: 2 }}>{file.name}</Typography>}
          </Grid>
        </Grid>
      </Paper>

      {/* Educación */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Educación</Typography>
          <Button startIcon={<AddIcon />} onClick={addEducation}>
            Añadir Educación
          </Button>
        </Box>
        {formData.education.map((edu, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Institución"
                value={edu.institution}
                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Título"
                value={edu.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Inicio"
                InputLabelProps={{ shrink: true }}
                value={edu.startDate}
                onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Fin"
                InputLabelProps={{ shrink: true }}
                value={edu.endDate}
                onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <IconButton color="error" onClick={() => removeEducation(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Paper>

      {/* Experiencia Laboral */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Experiencia Laboral</Typography>
          <Button startIcon={<AddIcon />} onClick={addWorkExperience}>
            Añadir Experiencia
          </Button>
        </Box>
        {formData.workExperience.map((exp, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Empresa"
                value={exp.company}
                onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Puesto"
                value={exp.position}
                onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Inicio"
                InputLabelProps={{ shrink: true }}
                value={exp.startDate}
                onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Descripción"
                value={exp.description}
                onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <IconButton color="error" onClick={() => removeWorkExperience(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Cancelar
        </Button>
        <Button variant="contained" type="submit">
          Guardar
        </Button>
      </Box>
    </Box>
  );
}; 