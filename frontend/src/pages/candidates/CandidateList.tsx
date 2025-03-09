import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IconButton, 
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon
} from '@mui/icons-material';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './Candidates.css';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 10;

  const fetchCandidates = async () => {
    try {
      const response = await api.get(`/candidates?page=${page}&limit=${ITEMS_PER_PAGE}`);
      setCandidates(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
      toast.error('Error loading candidates');
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [page]); // This dependency is already correct

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/candidates/${deleteId}`);
      toast.success('Candidato eliminado exitosamente');
      fetchCandidates();
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete candidate:', error);
      toast.error('Error al eliminar candidato');
    }
  };

  return (
    <div className="candidates-container">
      <div className="candidates-header">
        <h1>Candidatos</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/dashboard/candidates/new')}
          sx={{
            backgroundColor: '#4338CA',
            '&:hover': {
              backgroundColor: '#3730A3'
            }
          }}
        >
          Nuevo Candidato
        </Button>
      </div>

      <TableContainer component={Paper} className="candidates-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((candidate: any) => (
              <TableRow key={candidate.id} hover>
                <TableCell>{candidate.firstName}</TableCell>
                <TableCell>{candidate.lastName}</TableCell>
                <TableCell>{candidate.email}</TableCell>
                <TableCell>
                  <span className={`status-badge ${candidate.status.toLowerCase()}`}>
                    {candidate.status}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <div className="action-buttons">
                    <IconButton 
                      onClick={() => navigate(`/dashboard/candidates/${candidate.id}`)}
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => navigate(`/dashboard/candidates/${candidate.id}/edit`)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => setDeleteId(candidate.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="pagination-container">
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </div>

      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Está seguro que desea eliminar este candidato?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CandidateList;