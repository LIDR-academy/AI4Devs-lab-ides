import React, { useState, useEffect } from 'react';
import { candidateService } from '../../services/candidateService';
import { Candidate } from '../../types/Candidate';

interface RecentCandidatesProps {
  onViewAllClick: () => void;
  onAddCandidateClick: () => void;
}

/**
 * Componente para mostrar los candidatos recientes en el dashboard
 */
export const RecentCandidates: React.FC<RecentCandidatesProps> = ({ 
  onViewAllClick, 
  onAddCandidateClick 
}) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar candidatos recientes al montar el componente
  useEffect(() => {
    const fetchRecentCandidates = async () => {
      try {
        setLoading(true);
        const response = await candidateService.getRecentCandidates(3);
        
        if (response.success) {
          // Verificar si data es un array, si no lo es, usar un array vacío
          const candidatesData = Array.isArray(response.data) ? response.data : [];
          setCandidates(candidatesData);
        } else {
          setError(response.message || 'Error al cargar los candidatos recientes');
        }
      } catch (error) {
        setError('Error al conectar con el servidor');
        console.error('Error fetching recent candidates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentCandidates();
  }, []);

  // Renderizar estado de carga
  if (loading) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Candidatos recientes</h2>
            <div className="space-x-4">
              <button
                onClick={onViewAllClick}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
              >
                Ver todos los candidatos
              </button>
              <button
                onClick={onAddCandidateClick}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                + Añadir candidato
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar mensaje de error
  if (error) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Candidatos recientes</h2>
            <div className="space-x-4">
              <button
                onClick={onViewAllClick}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
              >
                Ver todos los candidatos
              </button>
              <button
                onClick={onAddCandidateClick}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                + Añadir candidato
              </button>
            </div>
          </div>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar mensaje si no hay candidatos
  if (candidates.length === 0) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Candidatos recientes</h2>
            <div className="space-x-4">
              <button
                onClick={onViewAllClick}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
              >
                Ver todos los candidatos
              </button>
              <button
                onClick={onAddCandidateClick}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                + Añadir candidato
              </button>
            </div>
          </div>
          <p className="text-center text-gray-500 py-8">
            No hay candidatos en el sistema. ¡Añade tu primer candidato!
          </p>
        </div>
      </div>
    );
  }

  // Renderizar lista de candidatos recientes
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Candidatos recientes</h2>
          <div className="space-x-4">
            <button
              onClick={onViewAllClick}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
            >
              Ver todos los candidatos
            </button>
            <button
              onClick={onAddCandidateClick}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              + Añadir candidato
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-800 font-medium text-lg">
                    {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                  </span>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {candidate.firstName} {candidate.lastName}
                      </h3>
                      <div className="text-sm text-gray-500">
                        {candidate.email} • {candidate.phone}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">Educación:</span>
                      {candidate.education && candidate.education[0] ? (
                        <div className="text-sm text-gray-700">
                          {candidate.education[0].institution} - {candidate.education[0].degree}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No disponible</div>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">Experiencia:</span>
                      {candidate.workExperience && candidate.workExperience[0] ? (
                        <div className="text-sm text-gray-700">
                          {candidate.workExperience[0].company} - {candidate.workExperience[0].position}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No disponible</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 