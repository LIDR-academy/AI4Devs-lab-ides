import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCandidates } from '../../features/candidates/hooks/useCandidates';
import { Candidate } from '../../features/candidates/types';
import { FiFile, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

const CandidateList: React.FC = () => {
  const navigate = useNavigate();
  // Usar el hook personalizado para obtener candidatos
  const { data, isLoading, isError, error } = useGetCandidates();

  const handleViewDocuments = (candidateId: number) => {
    navigate(`/candidates/${candidateId}/documents`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-steel-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error?.message || 'Ha ocurrido un error al cargar los candidatos'}</span>
      </div>
    );
  }

  if (!data?.success || !data.data || data.data.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">No hay candidatos disponibles.</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Nombre</th>
            <th className="py-2 px-4 border-b text-left">Email</th>
            <th className="py-2 px-4 border-b text-left">Posición</th>
            <th className="py-2 px-4 border-b text-left">Estado</th>
            <th className="py-2 px-4 border-b text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((candidate: Candidate) => (
            <tr key={candidate.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{`${candidate.firstName} ${candidate.lastName}`}</td>
              <td className="py-2 px-4 border-b">{candidate.email}</td>
              <td className="py-2 px-4 border-b">{candidate.position}</td>
              <td className="py-2 px-4 border-b">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(candidate.status)}`}>
                  {getStatusText(candidate.status)}
                </span>
              </td>
              <td className="py-2 px-4 border-b">
                <div className="flex space-x-2">
                  <button 
                    className="text-steel-blue-500 hover:text-steel-blue-700 flex items-center"
                    title="Ver detalles"
                  >
                    <FiEye className="h-5 w-5" />
                  </button>
                  <button 
                    className="text-green-500 hover:text-green-700 flex items-center"
                    title="Editar candidato"
                  >
                    <FiEdit className="h-5 w-5" />
                  </button>
                  <button 
                    className="text-indigo-500 hover:text-indigo-700 flex items-center"
                    title="Ver documentos"
                    onClick={() => handleViewDocuments(candidate.id)}
                  >
                    <FiFile className="h-5 w-5" />
                  </button>
                  <button 
                    className="text-red-500 hover:text-red-700 flex items-center"
                    title="Eliminar candidato"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Función para obtener el color según el estado
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'new':
      return 'bg-steel-blue-100 text-steel-blue-800';
    case 'contacted':
      return 'bg-purple-100 text-purple-800';
    case 'interview':
      return 'bg-yellow-100 text-yellow-800';
    case 'offer':
      return 'bg-orange-100 text-orange-800';
    case 'hired':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Función para obtener el texto según el estado
const getStatusText = (status: string): string => {
  switch (status) {
    case 'new':
      return 'Nuevo';
    case 'contacted':
      return 'Contactado';
    case 'interview':
      return 'Entrevista';
    case 'offer':
      return 'Oferta';
    case 'hired':
      return 'Contratado';
    case 'rejected':
      return 'Rechazado';
    default:
      return status;
  }
};

export default CandidateList; 