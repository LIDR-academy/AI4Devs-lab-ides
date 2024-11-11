import { useState, useEffect } from 'react';
import { 
  Box, 
  Button,
  Paper,
  Typography,
  CircularProgress 
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useCandidates } from '@/hooks/useCandidates';

export default function CandidateList() {
  const { candidates, loading, error, refetch } = useCandidates();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'Nombre', width: 130 },
    { field: 'lastName', headerName: 'Apellidos', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Teléfono', width: 130 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 200,
      renderCell: (params: any) => (
        <Box>
          <Button
            component={Link}
            to={`/candidates/${params.row.id}`}
            size="small"
            sx={{ mr: 1 }}
          >
            Ver
          </Button>
          <Button
            component={Link}
            to={`/candidates/${params.row.id}/edit`}
            size="small"
            color="primary"
          >
            Editar
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Candidatos</Typography>
        <Button
          component={Link}
          to="/candidates/new"
          variant="contained"
          color="primary"
        >
          Nuevo Candidato
        </Button>
      </Box>

      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={candidates}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
          }}
        />
      </Box>
    </Paper>
  );
} 