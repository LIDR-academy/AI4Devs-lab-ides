import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  
  // Verificar si el usuario está autenticado
  if (!isAuthenticated()) {
    // Redireccionar a la página de login si no está autenticado
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Si está autenticado, mostrar el contenido protegido
  return <>{children}</>;
};

export default ProtectedRoute; 