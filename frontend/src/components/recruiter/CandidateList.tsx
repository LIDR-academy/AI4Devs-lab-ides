import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getCandidates } from '../../services/api';
import { Candidate } from '../../types';

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Cargar candidatos al montar el componente
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const response = await getCandidates();
        if (response.success && response.data) {
          setCandidates(response.data);
          setFilteredCandidates(response.data);
        } else {
          setError(response.error || 'Error al cargar los candidatos');
        }
      } catch (err) {
        console.error('Error fetching candidates:', err);
        setError('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Filtrar candidatos cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCandidates(candidates);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const filtered = candidates.filter(candidate => 
        candidate.firstName.toLowerCase().includes(lowerCaseSearch) ||
        candidate.lastName.toLowerCase().includes(lowerCaseSearch) ||
        candidate.email.toLowerCase().includes(lowerCaseSearch) ||
        candidate.phone.includes(searchTerm) ||
        (candidate.tags && candidate.tags.some(tag => 
          tag.name.toLowerCase().includes(lowerCaseSearch)
        ))
      );
      setFilteredCandidates(filtered);
    }
  }, [searchTerm, candidates]);

  const handleViewDetails = (candidateId: number) => {
    navigate(`/candidates/${candidateId}`);
  };

  const handleEdit = (candidateId: number) => {
    navigate(`/candidates/edit/${candidateId}`);
  };

  const handleDelete = (candidateId: number) => {
    // Implementar lógica para eliminar candidato
    console.log(`Eliminar candidato con ID: ${candidateId}`);
    // Por ahora, solo eliminar del estado local
    const updatedCandidates = candidates.filter(c => c.id !== candidateId);
    setCandidates(updatedCandidates);
    setFilteredCandidates(filteredCandidates.filter(c => c.id !== candidateId));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Candidatos Registrados
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/candidates/add')}
        >
          Añadir Candidato
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por nombre, email, teléfono o etiquetas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {filteredCandidates.length === 0 ? (
        <Alert severity="info">
          No se encontraron candidatos que coincidan con tu búsqueda.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Teléfono</strong></TableCell>
                <TableCell><strong>Fecha Registro</strong></TableCell>
                <TableCell><strong>Etiquetas</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    {candidate.firstName} {candidate.lastName}
                  </TableCell>
                  <TableCell>{candidate.email}</TableCell>
                  <TableCell>{candidate.phone}</TableCell>
                  <TableCell>{formatDate(candidate.createdAt)}</TableCell>
                  <TableCell>
                    {candidate.tags && candidate.tags.map((tag) => (
                      <Chip 
                        key={tag.id}
                        label={tag.name}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={candidate.status || 'Nuevo'}
                      color={
                        candidate.status === 'Entrevistado' ? 'success' :
                        candidate.status === 'En proceso' ? 'info' :
                        'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => candidate.id && handleViewDetails(candidate.id)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="secondary"
                      onClick={() => candidate.id && handleEdit(candidate.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => candidate.id && handleDelete(candidate.id)}
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
    </Box>
  );
};

export default CandidateList; 