import React from 'react';
import { CandidateList } from '../components/candidates/CandidateList';

interface CandidatesPageProps {
  onNavigateToDashboard: () => void;
  onAddCandidateClick: () => void;
}

/**
 * Página para mostrar la lista de candidatos
 */
export const CandidatesPage: React.FC<CandidatesPageProps> = ({ 
  onNavigateToDashboard,
  onAddCandidateClick
}) => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Seguimiento de Candidatos</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gestione eficientemente sus procesos de reclutamiento
          </p>
        </div>
        
        <div className="mb-6 flex items-center">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <button 
                  onClick={onNavigateToDashboard}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:underline"
                >
                  Dashboard
                </button>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-gray-800 font-medium">
                  Candidatos
                </span>
              </li>
            </ol>
          </nav>
        </div>
        
        <CandidateList onAddCandidateClick={onAddCandidateClick} />
      </div>
    </div>
  );
}; 