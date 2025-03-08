import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Typography,
  Container,
  Paper,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import WorkIcon from '@mui/icons-material/Work';
import Layout from '../components/common/Layout';
import Navbar from '../components/common/Navbar';

const Dashboard: React.FC = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Dashboard de Reclutador
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" paragraph>
            Bienvenido al sistema de seguimiento de talento LTI. Selecciona una opción para comenzar.
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <PersonAddIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography gutterBottom variant="h5" component="div">
                    Añadir Candidato
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Añade un nuevo candidato al sistema con toda su información profesional.
                  </Typography>
                  <Button 
                    component={Link} 
                    to="/candidates/add" 
                    variant="contained" 
                    startIcon={<PersonAddIcon />}
                    sx={{ mt: 'auto' }}
                  >
                    Añadir Candidato
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography gutterBottom variant="h5" component="div">
                    Ver Candidatos
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Visualiza, busca y gestiona los candidatos registrados en el sistema.
                  </Typography>
                  <Button 
                    component={Link} 
                    to="/candidates" 
                    variant="contained" 
                    startIcon={<SearchIcon />}
                    sx={{ mt: 'auto' }}
                  >
                    Ver Candidatos
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  opacity: 0.6, // Deshabilitado
                  '&:hover': {
                    boxShadow: 1
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <WorkIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography gutterBottom variant="h5" component="div" color="text.disabled">
                    Gestionar Ofertas
                  </Typography>
                  <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>
                    Administra ofertas de trabajo y asigna candidatos.
                  </Typography>
                  <Button 
                    disabled
                    variant="outlined" 
                    startIcon={<WorkIcon />}
                    sx={{ mt: 'auto' }}
                  >
                    Próximamente
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  opacity: 0.6, // Deshabilitado
                  '&:hover': {
                    boxShadow: 1
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <AssessmentIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography gutterBottom variant="h5" component="div" color="text.disabled">
                    Informes
                  </Typography>
                  <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>
                    Genera informes y estadísticas sobre candidatos y procesos.
                  </Typography>
                  <Button 
                    disabled
                    variant="outlined" 
                    startIcon={<AssessmentIcon />}
                    sx={{ mt: 'auto' }}
                  >
                    Próximamente
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard; 