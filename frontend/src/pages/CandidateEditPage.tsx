import React from 'react';
import { useAuth } from '../features/auth';
import { FiLogOut, FiUser, FiUserPlus, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import CandidateEdit from '../features/candidates/components/CandidateEdit';

const CandidateEditPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleAddCandidate = () => {
    navigate('/candidates/add');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-steel-blue-800">Sistema ATS</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-700">
              <FiUser className="mr-2 h-5 w-5 text-steel-blue-500" />
              <span>{user?.name || user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-steel-blue-600 hover:bg-steel-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-steel-blue-500"
            >
              <FiLogOut className="mr-2 -ml-0.5 h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <button
            onClick={handleBackToDashboard}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-steel-blue-500"
          >
            <FiArrowLeft className="mr-2 -ml-0.5 h-4 w-4" />
            Volver al dashboard
          </button>
        </div>
        <CandidateEdit />
      </main>
    </div>
  );
};

export default CandidateEditPage; 