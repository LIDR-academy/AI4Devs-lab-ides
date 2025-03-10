import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { candidateService } from '../services/api';
import { Candidate } from '../types/candidate';

const CandidateListPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const data = await candidateService.getAllCandidates();
      setCandidates(data);
      setError(null);
    } catch (err: any) {
      console.error('Error al obtener candidatos:', err);
      setError('Error al cargar los candidatos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este candidato?')) {
      try {
        await candidateService.deleteCandidate(id);
        setSuccess('Candidato eliminado exitosamente');
        // Actualizar la lista de candidatos
        fetchCandidates();
      } catch (err: any) {
        console.error('Error al eliminar candidato:', err);
        setError('Error al eliminar el candidato');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Candidatos
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/candidates/new"
          startIcon={<AddIcon />}
        >
          Añadir Candidato
        </Button>
      </Box>

      <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
            <Button 
              variant="outlined" 
              sx={{ mt: 2 }} 
              onClick={fetchCandidates}
            >
              Reintentar
            </Button>
          </Box>
        ) : candidates.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>No hay candidatos registrados.</Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow hover key={candidate.id}>
                    <TableCell>{`${candidate.firstName} ${candidate.lastName}`}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.phone}</TableCell>
                    <TableCell>{candidate.address}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        component={Link} 
                        to={`/candidates/${candidate.id}`}
                        color="primary"
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton 
                        component={Link} 
                        to={`/candidates/${candidate.id}/edit`}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => candidate.id && handleDelete(candidate.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Notificaciones */}
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

export default CandidateListPage;
