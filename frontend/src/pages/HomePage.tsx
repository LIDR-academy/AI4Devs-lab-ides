import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Box, 
  Button,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { Link } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import AssessmentIcon from '@mui/icons-material/Assessment';

const HomePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Bienvenido al Sistema LTI
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Sistema de Seguimiento de Talento - Gestione candidatos, vacantes y procesos de selección de manera eficiente.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <PeopleIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" component="div" gutterBottom align="center">
                Candidatos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gestione la información de los candidatos, incluyendo sus datos personales, educación, experiencia laboral y documentos.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                component={Link} 
                to="/candidates"
                fullWidth
              >
                Ver Candidatos
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <WorkIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" component="div" gutterBottom align="center">
                Vacantes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administre las vacantes disponibles, requisitos, ubicación, salario y otros detalles importantes para el proceso de selección.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                component={Link} 
                to="/jobs"
                fullWidth
              >
                Ver Vacantes
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" component="div" gutterBottom align="center">
                Reportes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Visualice estadísticas y reportes sobre los procesos de selección, candidatos y vacantes para tomar decisiones informadas.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                component={Link} 
                to="/reports"
                fullWidth
              >
                Ver Reportes
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
