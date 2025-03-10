import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Componentes
import Navbar from './components/Navbar';

// Páginas de la aplicación
import Dashboard from './pages/Dashboard';
import CandidateForm from './pages/CandidateForm';
import CandidateDetails from './pages/CandidateDetails';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';

// Contexto de autenticación
import { AuthProvider, AuthContext } from './context/AuthContext';

// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated, isLoading } = React.useContext(AuthContext);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return isAuthenticated ? <>{element}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas protegidas */}
            <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/candidates/new" element={<ProtectedRoute element={<CandidateForm />} />} />
            <Route path="/candidates/edit/:id" element={<ProtectedRoute element={<CandidateForm />} />} />
            <Route path="/candidates/:id" element={<ProtectedRoute element={<CandidateDetails />} />} />
            
            {/* Ruta de fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
