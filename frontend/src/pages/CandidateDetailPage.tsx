import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  Box, 
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import { candidateService } from '../services/api';
import { Candidate } from '../types/candidate';

const CandidateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('ID no válido');
        
        const data = await candidateService.getCandidateById(parseInt(id));
        setCandidate(data);
        setError(null);
      } catch (err: any) {
        console.error('Error al obtener detalles del candidato:', err);
        setError('Error al cargar los detalles del candidato. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !candidate) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error || 'Candidato no encontrado'}</Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }} 
            onClick={() => navigate('/candidates')}
            startIcon={<ArrowBackIcon />}
          >
            Volver a la lista
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button 
          variant="outlined" 
          component={Link} 
          to="/candidates"
          startIcon={<ArrowBackIcon />}
        >
          Volver
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to={`/candidates/${id}/edit`}
          startIcon={<EditIcon />}
        >
          Editar
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {`${candidate.firstName} ${candidate.lastName}`}
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">
              {candidate.email}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Teléfono
            </Typography>
            <Typography variant="body1">
              {candidate.phone}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Dirección
            </Typography>
            <Typography variant="body1">
              {candidate.address}
            </Typography>
          </Grid>
          
          {candidate.cvFilePath && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">
                Curriculum Vitae
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />}
                href={`http://localhost:3010${candidate.cvFilePath}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 1 }}
              >
                Descargar CV
              </Button>
            </Grid>
          )}
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Educación */}
        <Typography variant="h5" gutterBottom>
          Educación
        </Typography>
        
        <Grid container spacing={2}>
          {candidate.education && candidate.education.length > 0 ? (
            candidate.education.map((edu, index) => (
              <Grid item xs={12} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {edu.institution}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      {edu.degree} en {edu.fieldOfStudy}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip 
                        label={`Inicio: ${new Date(edu.startDate).toLocaleDateString()}`} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                      {edu.endDate && (
                        <Chip 
                          label={`Fin: ${new Date(edu.endDate).toLocaleDateString()}`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      )}
                    </Box>
                    {edu.description && (
                      <Typography variant="body2" color="text.secondary">
                        {edu.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary">
                No hay información de educación disponible.
              </Typography>
            </Grid>
          )}
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Experiencia */}
        <Typography variant="h5" gutterBottom>
          Experiencia Laboral
        </Typography>
        
        <Grid container spacing={2}>
          {candidate.experience && candidate.experience.length > 0 ? (
            candidate.experience.map((exp, index) => (
              <Grid item xs={12} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {exp.position} en {exp.company}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      {exp.location}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip 
                        label={`Inicio: ${new Date(exp.startDate).toLocaleDateString()}`} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                      {exp.endDate && (
                        <Chip 
                          label={`Fin: ${new Date(exp.endDate).toLocaleDateString()}`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      )}
                    </Box>
                    {exp.description && (
                      <Typography variant="body2" color="text.secondary">
                        {exp.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary">
                No hay información de experiencia laboral disponible.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default CandidateDetailPage;
