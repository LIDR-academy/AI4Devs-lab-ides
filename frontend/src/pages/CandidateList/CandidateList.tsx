import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button,
  Paper 
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Candidate } from '../../types';
import { candidateService } from '../../api/candidateService';

export const CandidateList = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  const handleEdit = (id: number) => {
    navigate(`/candidates/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await candidateService.delete(id);
      setCandidates(prev => prev.filter(candidate => candidate.id !== id));
      // TODO: Mostrar mensaje de éxito
    } catch (error) {
      console.error('Error deleting candidate:', error);
      // TODO: Mostrar mensaje de error
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Nombre', width: 130 },
    { field: 'lastName', headerName: 'Apellido', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Teléfono', width: 130 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Button
            onClick={() => handleEdit(params.row.id)}
            startIcon={<EditIcon />}
          >
            Editar
          </Button>
          <Button
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(params.row.id)}
          >
            Eliminar
          </Button>
        </Box>
      )
    }
  ];

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await candidateService.getAll();
        setCandidates(data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        // TODO: Mostrar mensaje de error
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">
          Candidatos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/candidates/new')}
        >
          Nuevo Candidato
        </Button>
      </Box>
      
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={candidates}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 }
            }
          }}
        />
      </Paper>
    </Box>
  );
}; 