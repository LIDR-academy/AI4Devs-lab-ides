import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCandidateById, useDeleteCandidate } from '../hooks/useCandidates';
import { Candidate, Education, WorkExperience } from '../types';
import DocumentList from './DocumentList';
import DocumentListReadOnly from './DocumentListReadOnly';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { FiEdit, FiTrash2, FiArrowLeft, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const CandidateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const candidateId = id ? parseInt(id) : 0;
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCandidateById(candidateId);
  const deleteMutation = useDeleteCandidate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Estado para controlar qué secciones están expandidas
  const [expandedSections, setExpandedSections] = useState({
    personalInfo: true,
    professionalInfo: true,
    education: true,
    workExperience: true,
    documents: true
  });

  // Función para alternar la expansión de una sección
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Fecha no especificada';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha inválida';
    }
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

  // Función para renderizar de forma segura un texto
  const safeRenderText = (text: any): string => {
    if (text === null || text === undefined) return '';
    if (typeof text === 'string') return text;
    if (typeof text === 'number') return text.toString();
    if (typeof text === 'boolean') return text ? 'Sí' : 'No';
    return JSON.stringify(text);
  };

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteMutation.mutateAsync(candidateId);
      
      if (response.success) {
        // Redirigir a la lista de candidatos
        navigate('/dashboard');
      } else {
        console.error('Error al eliminar candidato:', response.error);
      }
    } catch (err) {
      console.error('Error al eliminar candidato:', err);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  const handleEditClick = () => {
    navigate(`/dashboard/candidates/edit/${candidateId}`);
  };

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  // Componente para el encabezado de sección
  const SectionHeader = ({ title, section }: { title: string, section: keyof typeof expandedSections }) => (
    <div 
      className="flex justify-between items-center py-2 px-4 bg-gray-100 rounded-md cursor-pointer mb-4"
      onClick={() => toggleSection(section)}
    >
      <h3 className="text-lg font-medium text-gray-800">{title}</h3>
      <button type="button" className="text-gray-500 hover:text-gray-700">
        {expandedSections[section] ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError || !data?.success || !data.data) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">No se pudo cargar la información del candidato.</span>
      </div>
    );
  }

  const candidate = data.data;

  // Asegurarse de que experience sea un array
  const workExperience = Array.isArray(candidate.experience) 
    ? candidate.experience 
    : (candidate.experience ? [candidate.experience] : []);

  // Asegurarse de que education sea un array si es un objeto
  const education = Array.isArray(candidate.education) 
    ? candidate.education 
    : (candidate.education && typeof candidate.education === 'object' ? [candidate.education] : []);

  // Asegurarse de que skills sea un array
  const skills = Array.isArray(candidate.skills) ? candidate.skills : [];

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
      {/* Cabecera con botones de acción */}
      <div className="flex justify-end items-center mb-6">
        <div>
          <button 
            onClick={handleEditClick}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center mr-2 inline-flex"
          >
            <FiEdit className="mr-2" /> Editar
          </button>
          <button 
            onClick={handleDeleteClick}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center inline-flex"
          >
            <FiTrash2 className="mr-2" /> Eliminar
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Eliminar candidato"
        message={`¿Estás seguro de que deseas eliminar a ${candidate.firstName} ${candidate.lastName}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteMutation.isPending}
      />

      {/* Título del candidato */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{safeRenderText(candidate.firstName)} {safeRenderText(candidate.lastName)}</h1>
          </div>
          <div className="mt-2 md:mt-0">
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusClass(candidate.status)}`}>
              {getStatus(candidate.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Información personal */}
      <div className="mb-6">
        <SectionHeader title="Información Personal" section="personalInfo" />
        
        {expandedSections.personalInfo && (
          <div className="p-4 border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contacto */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Información de contacto
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="text-gray-500 w-20">Email:</span>
                    <span className="text-gray-800 font-medium">{safeRenderText(candidate.email)}</span>
                  </div>
                  {candidate.phone && (
                    <div className="flex items-start">
                      <span className="text-gray-500 w-20">Teléfono:</span>
                      <span className="text-gray-800 font-medium">{safeRenderText(candidate.phone)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Fechas */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Fechas importantes
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="text-gray-500 w-20">Creado:</span>
                    <span className="text-gray-800 font-medium">{formatDate(candidate.createdAt)}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 w-20">Actualizado:</span>
                    <span className="text-gray-800 font-medium">{formatDate(candidate.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Información profesional */}
      <div className="mb-6">
        <SectionHeader title="Información Profesional" section="professionalInfo" />
        
        {expandedSections.professionalInfo && (
          <div className="p-4 border rounded-md">
            <div className="grid grid-cols-1 gap-4">
              {/* Experiencia laboral */}
              {workExperience.length > 0 ? (
                <div className="space-y-4">
                  {workExperience.map((exp, index) => (
                    <div key={index} className="p-4 border rounded-md bg-white">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">{safeRenderText(exp.position)}</h4>
                          <p className="text-md text-gray-700">{safeRenderText(exp.company)}</p>
                        </div>
                        <div className="mt-2 md:mt-0 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
                          {exp.startDate ? formatDate(exp.startDate) : 'Fecha no especificada'} - {exp.endDate ? formatDate(exp.endDate) : 'Presente'}
                        </div>
                      </div>
                      
                      {exp.description && (
                        <div className="mt-2 text-gray-700 border-t pt-3">
                          <p className="whitespace-pre-line">{safeRenderText(exp.description)}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4 bg-gray-50 rounded-md">
                  No hay información sobre experiencia laboral.
                </div>
              )}
              
              {/* Habilidades */}
              {skills.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    Habilidades
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {safeRenderText(skill)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Notas adicionales */}
              {candidate.notes && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Notas adicionales
                  </h4>
                  <p className="text-gray-700 whitespace-pre-line">{safeRenderText(candidate.notes)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Educación */}
      {education.length > 0 && (
        <div className="mb-6">
          <SectionHeader title="Educación" section="education" />
          
          {expandedSections.education && (
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="p-4 border rounded-md bg-white">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{safeRenderText(edu.degree)}</h4>
                      <p className="text-md text-gray-700">{safeRenderText(edu.institution)}</p>
                      {edu.fieldOfStudy && (
                        <p className="text-sm text-gray-600">Campo: {safeRenderText(edu.fieldOfStudy)}</p>
                      )}
                    </div>
                    <div className="mt-2 md:mt-0 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
                      {edu.startDate ? formatDate(edu.startDate) : 'Fecha no especificada'} - {edu.endDate ? formatDate(edu.endDate) : 'Presente'}
                    </div>
                  </div>
                  
                  {edu.description && (
                    <div className="mt-2 text-gray-700 border-t pt-3">
                      <p className="whitespace-pre-line">{safeRenderText(edu.description)}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Documentos */}
      <div className="mb-6">
        <SectionHeader title="Documentos" section="documents" />
        
        {expandedSections.documents && (
          <div className="p-4 border rounded-md">
            <div className="flex items-center mb-4">
              <h4 className="font-medium text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                Documentos del candidato
              </h4>
            </div>
            <DocumentListReadOnly candidateId={candidateId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetail; 