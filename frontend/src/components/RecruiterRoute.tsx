import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RecruiterRoute: React.FC = () => {
  const { isRecruiter, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Allow both recruiters and admins to access these routes
  return (isRecruiter || isAdmin) ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default RecruiterRoute; 