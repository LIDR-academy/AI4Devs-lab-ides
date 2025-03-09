import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '..';

/**
 * Componente que protege rutas para usuarios autenticados
 */
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar spinner mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-steel-blue-500"></div>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Renderizar las rutas hijas si está autenticado
  return <Outlet />;
};

export default ProtectedRoute; 