import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CandidateListPage from './pages/CandidateListPage';
import CandidateDetailPage from './pages/CandidateDetailPage';
import CandidateForm from './components/candidates/CandidateForm';
import './App.css';

// Crear tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navigation />
          <main style={{ padding: '20px 0' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/candidates" element={<CandidateListPage />} />
              <Route path="/candidates/new" element={<CandidateForm />} />
              <Route path="/candidates/:id" element={<CandidateDetailPage />} />
              <Route path="/candidates/:id/edit" element={<CandidateForm />} />
              {/* Rutas adicionales se agregarán aquí */}
              <Route path="*" element={<div>Página no encontrada</div>} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
