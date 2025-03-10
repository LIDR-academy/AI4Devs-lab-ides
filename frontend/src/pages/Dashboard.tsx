import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper, 
  AppBar, 
  Toolbar, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon, 
  PersonAdd as PersonAddIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import CandidateForm from '../components/CandidateForm';

const Dashboard: React.FC = () => {
  // Estado para controlar si se muestra el formulario de añadir candidato
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  
  // Estado para controlar si el drawer está abierto
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Función para alternar la visibilidad del formulario
  const toggleAddCandidate = () => {
    setShowAddCandidate(!showAddCandidate);
  };
  
  // Función para alternar la visibilidad del drawer
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Barra de navegación */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LTI - Sistema de Seguimiento de Talento
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Drawer lateral */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer}
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={toggleAddCandidate}>
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Añadir Candidato" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Ver Candidatos" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      
      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          mt: 8
        }}
      >
        {!showAddCandidate ? (
          <Container>
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Dashboard del Reclutador
              </Typography>
              <Typography variant="body1" paragraph>
                Bienvenido al Sistema de Seguimiento de Talento. Desde aquí puedes gestionar los candidatos y procesos de selección.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAddIcon />}
                  onClick={toggleAddCandidate}
                  size="large"
                >
                  Añadir Nuevo Candidato
                </Button>
              </Box>
            </Paper>
          </Container>
        ) : (
          <Container>
            <Box sx={{ mb: 4 }}>
              <Button
                variant="outlined"
                onClick={toggleAddCandidate}
              >
                Volver al Dashboard
              </Button>
            </Box>
            <CandidateForm />
          </Container>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard; 