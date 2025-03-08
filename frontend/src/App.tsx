import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes de autenticación
import ProtectedRoute from './components/auth/ProtectedRoute';

// Páginas
import Dashboard from './pages/Dashboard';
import AddCandidate from './pages/AddCandidate';
import CandidateListPage from './pages/CandidateListPage';
import Login from './pages/Login';
import { isAuthenticated } from './services/authService';

// Tema de la aplicación
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position="top-right" autoClose={5000} />
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route 
            path="/login" 
            element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} 
          />
          
          {/* Rutas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/candidates/add" 
            element={
              <ProtectedRoute>
                <AddCandidate />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/candidates" 
            element={
              <ProtectedRoute>
                <CandidateListPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirección por defecto */}
          <Route 
            path="*" 
            element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
