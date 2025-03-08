import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LTI ATS
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <Button
              component={RouterLink}
              to="/dashboard"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Dashboard
            </Button>
            <Button
              component={RouterLink}
              to="/candidates"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Candidatos
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Button color="inherit">Salir</Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 