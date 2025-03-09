import React, { useState, useEffect } from 'react';
import { FiFileText, FiDownload, FiAlertCircle, FiTrash2 } from 'react-icons/fi';
import { candidateService } from '../services/candidateService';
import ConfirmationModal from '../../../components/ConfirmationModal';
import api from '../../../features/auth/services/authService';

interface Document {
  id: number;
  name: string;
  type: string;
  fileType: string;
  isEncrypted: boolean;
  createdAt: string;
  fileUrl?: string;
}

interface DocumentListProps {
  candidateId: number;
  refreshTrigger?: number; // Para forzar la recarga de la lista
}

const DocumentList: React.FC<DocumentListProps> = ({ candidateId, refreshTrigger = 0 }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [downloadingDocId, setDownloadingDocId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await candidateService.getCandidateDocuments(candidateId);
        
        if (response.success) {
          setDocuments(response.data);
        } else {
          setError(response.error || 'Error al cargar los documentos');
        }
      } catch (err) {
        console.error('Error al obtener documentos:', err);
        setError('Error al cargar los documentos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [candidateId, refreshTrigger]);

  const handleDeleteClick = (document: Document) => {
    setDocumentToDelete(document);
    setShowConfirmModal(true);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!documentToDelete) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const response = await candidateService.deleteDocument(documentToDelete.id);
      
      if (response.success) {
        // Eliminar el documento de la lista local
        setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentToDelete.id));
        setShowConfirmModal(false);
        setDocumentToDelete(null);
      } else {
        setDeleteError(response.error || 'Error al eliminar el documento');
      }
    } catch (err) {
      console.error('Error al eliminar documento:', err);
      setDeleteError('Error al eliminar el documento');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setDocumentToDelete(null);
    setDeleteError(null);
  };

  const handleDownload = async (docId: number, docName: string, docType: string, isEncrypted: boolean) => {
    try {
      setDownloadingDocId(docId);
      
      // Realizar la petición con axios para obtener el archivo como blob
      const response = await api.get(`/api/documents/${docId}?download=true&decrypt=true`, {
        responseType: 'blob'
      });
      
      // Crear un objeto URL para el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Crear un elemento <a> temporal
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${docName}.${docType}`);
      
      // Añadir el elemento al DOM, hacer clic y luego eliminarlo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Liberar el objeto URL
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al descargar documento:', err);
      alert('Error al descargar el documento. Por favor, inténtelo de nuevo.');
    } finally {
      setDownloadingDocId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-steel-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <div className="flex">
          <div className="py-1">
            <FiAlertCircle className="h-6 w-6 text-red-500 mr-4" />
          </div>
          <div>
            <p className="font-bold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        No hay documentos asociados a este candidato.
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Documentos subidos</h3>
      {deleteError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{deleteError}</span>
        </div>
      )}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {documents.map((doc) => (
            <li key={doc.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiFileText className="flex-shrink-0 h-5 w-5 text-steel-blue-500" />
                    <p className="ml-2 text-sm font-medium text-gray-900 truncate">
                      {doc.name}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {doc.type}
                    </p>
                    {doc.isEncrypted && (
                      <p className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Encriptado
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Tipo: {doc.fileType.toUpperCase()}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Subido el {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex ml-4">
                      <button
                        onClick={() => handleDownload(doc.id, doc.name, doc.fileType, doc.isEncrypted)}
                        disabled={downloadingDocId === doc.id}
                        className={`text-steel-blue-600 hover:text-steel-blue-900 flex items-center mr-4 ${downloadingDocId === doc.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <FiDownload className="mr-1" />
                        {downloadingDocId === doc.id ? 'Descargando...' : 'Descargar'}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(doc)}
                        className="text-red-600 hover:text-red-900 flex items-center"
                      >
                        <FiTrash2 className="mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Eliminar documento"
        message={`¿Estás seguro de que deseas eliminar el documento "${documentToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DocumentList; 