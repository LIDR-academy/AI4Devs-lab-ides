import React, { useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { login } from '../services/authService';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await login(email, password);
      
      if (response.success) {
        // Guardar el token de acceso en localStorage
        localStorage.setItem('accessToken', response.data?.accessToken || '');
        // Guardar información del usuario
        localStorage.setItem('user', JSON.stringify(response.data?.user || {}));
        
        // Redirigir al dashboard
        navigate('/dashboard');
      } else {
        setError(response.error || 'Error de autenticación');
      }
    } catch (err) {
      console.error('Error de login:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          LTI - Sistema de Candidatos
        </Typography>
        <LoginForm 
          onLogin={handleLogin}
          loading={loading}
          error={error}
        />
      </Box>
    </Container>
  );
};

export default Login; 