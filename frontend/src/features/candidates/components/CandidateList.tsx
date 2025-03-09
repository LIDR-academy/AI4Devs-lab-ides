import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCandidates, useDeleteCandidate } from '../hooks/useCandidates';
import { Candidate } from '../types';
import ConfirmationModal from '../../../components/ConfirmationModal';

const CandidateList: React.FC = () => {
  // Usar el hook personalizado para obtener candidatos
  const { data, isLoading, isError, error } = useGetCandidates();
  const deleteMutation = useDeleteCandidate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);
  const navigate = useNavigate();

  // Función para extraer la posición del campo summary
  const extractPosition = (summary: string | undefined): string => {
    if (!summary) return 'No especificada';
    
    console.log('Extrayendo posición de summary:', summary);
    
    // Buscar la posición en el formato "Posición: X"
    const positionMatch = summary.match(/Posición: ([^,]+)/);
    if (positionMatch && positionMatch[1]) {
      const position = positionMatch[1].trim();
      console.log('Posición extraída:', position);
      return position;
    }
    
    return 'No especificada';
  };

  // Función para obtener la posición o información relevante del candidato
  const getPosition = (candidate: Candidate): string => {
    // Si tiene posición, mostrarla
    if (candidate.position && candidate.position.trim() !== '') {
      return candidate.position;
    }
    
    // Si tiene summary, extraer la posición
    if (candidate.summary && candidate.summary.trim() !== '') {
      const positionMatch = candidate.summary.match(/Posición: ([^,\n]+)/);
      if (positionMatch && positionMatch[1]) {
        return positionMatch[1].trim();
      }
    }
    
    // Si tiene experiencia, mostrarla
    if (candidate.experience) {
      return `Experiencia: ${candidate.experience} años`;
    }
    
    // Si tiene educación como texto, mostrarla
    if (candidate.educationText && candidate.educationText.trim() !== '') {
      return `Educación: ${candidate.educationText}`;
    }
    
    // Si tiene educación como array, mostrar la primera
    if (candidate.education && candidate.education.length > 0) {
      const firstEducation = candidate.education[0];
      return `Educación: ${firstEducation.institution} - ${firstEducation.degree}`;
    }
    
    // Si no hay información disponible, mostrar un mensaje genérico
    return `Candidato ${candidate.firstName} ${candidate.lastName}`;
  };

  // Función para mostrar la posición o información del candidato
  const getPositionInfo = (candidate: Candidate): string => {
    console.log('Obteniendo información para candidato:', candidate.id, candidate.firstName, candidate.lastName);
    
    // Si tiene position y no es una cadena vacía, usarla
    if (candidate.position && candidate.position.trim() !== '') {
      return candidate.position;
    }
    
    // Si tiene summary, mostrarlo
    if (candidate.summary && candidate.summary.trim() !== '') {
      return candidate.summary;
    }
    
    // Si tiene notas, mostrarlas
    if (candidate.notes && candidate.notes.trim() !== '') {
      return `Notas: ${candidate.notes}`;
    }
    
    // Si tiene experiencia, mostrarla
    if (candidate.experience) {
      return `Experiencia: ${candidate.experience} años`;
    }
    
    // Si tiene educación como texto, mostrarla
    if (candidate.educationText && candidate.educationText.trim() !== '') {
      return `Educación: ${candidate.educationText}`;
    }
    
    // Si tiene educación como array, mostrar la primera
    if (candidate.education && candidate.education.length > 0) {
      const firstEducation = candidate.education[0];
      return `Educación: ${firstEducation.institution} - ${firstEducation.degree}`;
    }
    
    // Si no hay información disponible, mostrar un mensaje genérico
    return `Candidato ${candidate.firstName} ${candidate.lastName}`;
  };

  // Función para mostrar el estado
  const getStatus = (status: string): string => {
    if (!status) return 'Activo'; // Valor por defecto si no hay estado
    
    switch (status.toLowerCase()) {
      case 'new': return 'Nuevo';
      case 'active': return 'Activo';
      case 'contacted': return 'Contactado';
      case 'interview': return 'Entrevista';
      case 'offer': return 'Oferta';
      case 'hired': return 'Contratado';
      case 'rejected': return 'Rechazado';
      default: return status; // Mostrar el valor original si no coincide con ninguno de los casos
    }
  };

  // Función para obtener la clase CSS del estado
  const getStatusClass = (status: string): string => {
    if (!status) return 'bg-gray-100 text-gray-800'; // Clase por defecto si no hay estado
    
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'interview': return 'bg-yellow-100 text-yellow-800';
      case 'offer': return 'bg-orange-100 text-orange-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800'; // Clase por defecto para valores no reconocidos
    }
  };

  const handleDeleteClick = (candidate: Candidate) => {
    setCandidateToDelete(candidate);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!candidateToDelete) return;
    
    try {
      const response = await deleteMutation.mutateAsync(candidateToDelete.id);
      
      if (response.success) {
        // La caché se actualizará automáticamente gracias a React Query
        setShowConfirmModal(false);
        setCandidateToDelete(null);
      } else {
        console.error('Error al eliminar candidato:', response.error);
      }
    } catch (err) {
      console.error('Error al eliminar candidato:', err);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setCandidateToDelete(null);
  };

  const handleViewClick = (candidateId: number) => {
    navigate(`/dashboard/candidates/${candidateId}`);
  };

  const handleEditClick = (candidateId: number) => {
    navigate(`/dashboard/candidates/edit/${candidateId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{'Ha ocurrido un error al cargar los candidatos'}</span>
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
      {isLoading && <p>Cargando candidatos...</p>}
      {isError && <p className="text-red-500">Error: {'Error al cargar los candidatos'}</p>}
      
      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Eliminar candidato"
        message={`¿Estás seguro de que deseas eliminar a ${candidateToDelete?.firstName} ${candidateToDelete?.lastName}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteMutation.isPending}
      />
      
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Nombre</th>
            <th className="py-2 px-4 border-b text-left">Email</th>
            <th className="py-2 px-4 border-b text-left">Estado</th>
            <th className="py-2 px-4 border-b text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((candidate: Candidate) => {
            console.log('Estado del candidato:', candidate.id, candidate.status);
            return (
              <tr key={candidate.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{`${candidate.firstName} ${candidate.lastName}`}</td>
                <td className="py-2 px-4 border-b">{candidate.email}</td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(candidate.status)}`}>
                    {getStatus(candidate.status)}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  <button 
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    onClick={() => handleViewClick(candidate.id)}
                  >
                    Ver
                  </button>
                  <button 
                    className="text-green-500 hover:text-green-700 mr-2"
                    onClick={() => handleEditClick(candidate.id)}
                  >
                    Editar
                  </button>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteClick(candidate)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateList; 