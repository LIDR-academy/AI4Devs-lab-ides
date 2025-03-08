import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Menu, 
  MenuItem, 
  Avatar 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../../services/authService';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          LTI - Sistema de Candidatos
        </Typography>
        
        <Box display="flex" alignItems="center">
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => navigate('/candidates')}>
            Ver Candidatos
          </Button>
          <Button color="inherit" onClick={() => navigate('/candidates/add')}>
            Añadir Candidato
          </Button>
          
          {user && (
            <>
              <Typography variant="body1" sx={{ mx: 2 }}>
                {user.role === 'ADMIN' ? '👑 ' : ''}{user.firstName || user.email}
              </Typography>
              <IconButton
                size="large"
                aria-label="cuenta del usuario"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {getInitials()}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Mi Perfil</MenuItem>
                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 