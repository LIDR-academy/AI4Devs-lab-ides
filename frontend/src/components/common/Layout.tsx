import React, { ReactNode } from 'react';
import { Container, Box, Paper } from '@mui/material';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
          {children}
        </Paper>
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[200],
        }}
      >
        <Container maxWidth="sm">
          <Box textAlign="center">
            <Box component="span" sx={{ color: 'text.secondary' }}>
              © {new Date().getFullYear()} LTI - Sistema de Seguimiento de Talento
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 