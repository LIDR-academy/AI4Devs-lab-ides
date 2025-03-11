import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../features/auth';
import { FiLogOut, FiUser, FiArrowLeft, FiCheck, FiUpload, FiFileText } from 'react-icons/fi';
import DocumentUploadForm from '../features/candidates/components/DocumentUploadForm';
import DocumentList from '../features/candidates/components/DocumentList';
import { useGetCandidateById } from '../features/candidates/hooks/useCandidates';

const CandidateEditSuccessPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const candidateId = id ? parseInt(id) : undefined;
  
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [refreshDocuments, setRefreshDocuments] = useState(0);

  // Obtener los datos del candidato
  const { data: candidateData, isLoading, isError } = useGetCandidateById(candidateId || 0);
  
  let candidateName: string = 'el candidato'; // Valor por defecto
  
  // Establecer el nombre del candidato cuando los datos estén disponibles
  useEffect(() => {
    if (candidateData?.success && candidateData.data) {
      if (candidateData.data.firstName && candidateData.data.lastName) {
        candidateName = `${candidateData.data.firstName} ${candidateData.data.lastName}`;
      } else if (candidateData.data.firstName) {
        candidateName = candidateData.data.firstName;
      }
    }
  }, [candidateData]);

  const handleLogout = () => {
    logout();
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleUploadClick = () => {
    setShowUploadForm(true);
  };

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    setUploadSuccess(true);
    // Incrementar el contador para forzar la recarga de la lista de documentos
    setRefreshDocuments(prev => prev + 1);
  };

  const handleUploadCancel = () => {
    setShowUploadForm(false);
  };

  // Si está cargando, mostrar un indicador de carga
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-steel-blue-500"></div>
      </div>
    );
  }

  // Si hay un error o no hay ID de candidato, mostrar un mensaje de error
  if (isError || !candidateId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">No se pudo cargar la información del candidato.</span>
        </div>
      </div>
    );
  }

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
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-steel-blue-500"
          >
            <FiArrowLeft className="mr-2 -ml-0.5 h-4 w-4" />
            Volver al dashboard
          </button>
        </div>
        
        {!showUploadForm ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                <FiCheck className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="ml-4 text-xl font-semibold text-gray-900">
                ¡Candidato actualizado con éxito!
              </h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Los datos de <strong>{candidateName}</strong> han sido actualizados correctamente en el sistema.
              Puedes gestionar los documentos relacionados con este candidato a continuación.
            </p>
            
            {uploadSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiFileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Documento subido correctamente
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        El documento ha sido asociado al candidato y está disponible para su consulta.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            
            {/* Lista de documentos */}
            {candidateId && (
              <DocumentList 
                candidateId={candidateId} 
                refreshTrigger={refreshDocuments} 
              />
            )}
            
            <div className="flex flex-col sm:flex-row sm:space-x-4 mt-6">
              <button
                onClick={handleUploadClick}
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-steel-blue-600 hover:bg-steel-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-steel-blue-500 mb-3 sm:mb-0"
              >
                <FiUpload className="mr-2 -ml-1 h-5 w-5" />
                Subir documento
              </button>
              
              <button
                onClick={handleBack}
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-steel-blue-500"
              >
                Finalizar
              </button>
            </div>
          </div>
        ) : (
          <DocumentUploadForm 
            candidateId={candidateId} 
            onSuccess={handleUploadSuccess} 
            onCancel={handleUploadCancel} 
          />
        )}
      </main>
    </div>
  );
};

export default CandidateEditSuccessPage; 