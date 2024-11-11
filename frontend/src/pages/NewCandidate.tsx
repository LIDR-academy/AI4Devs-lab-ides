import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Paper, Breadcrumbs, Link } from '@mui/material';
import { useSnackbar } from 'notistack';
import CandidateForm from '@/components/CandidateForm/CandidateForm';
import api from '@/services/api';

export default function NewCandidate() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError('');
      await api.post('/candidates', data);
      enqueueSnackbar('Candidato creado exitosamente', { variant: 'success' });
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Error al crear el candidato';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link color="inherit" href="/">
          Inicio
        </Link>
        <Typography color="text.primary">Nuevo Candidato</Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom>
        Nuevo Candidato
      </Typography>

      <CandidateForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    </Box>
  );
} 