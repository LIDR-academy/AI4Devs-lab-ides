import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Paper, 
  Typography 
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">
            Dashboard de Reclutador
          </Typography>
          
          <Button
            component={Link}
            to="/candidates/add"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Añadir Candidato
          </Button>
        </Box>
        
        <Typography variant="body1" paragraph>
          Bienvenido al Sistema de Seguimiento de Talento. Desde aquí puedes gestionar candidatos y procesos de selección.
        </Typography>
        
        <Typography variant="body1" paragraph>
          Para comenzar a añadir candidatos, haz clic en el botón "Añadir Candidato" en la esquina superior derecha.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Dashboard; 