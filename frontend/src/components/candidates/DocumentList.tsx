import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../ui/Button';
import { FiDownload, FiTrash2, FiEye } from 'react-icons/fi';

interface Document {
  id: number;
  name: string;
  type: string;
  fileType: string;
  isEncrypted: boolean;
  createdAt: string;
}

interface DocumentListProps {
  candidateId: number;
  refreshTrigger?: number;
}

const DocumentList: React.FC<DocumentListProps> = ({ candidateId, refreshTrigger = 0 }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:3010/api/candidates/${candidateId}/documents`, {
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Error al obtener documentos');
        }

        const data = await response.json();
        setDocuments(data.data || []);
      } catch (error) {
        console.error('Error al obtener documentos:', error);
        setError(error instanceof Error ? error.message : 'Error al obtener documentos');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [candidateId, refreshTrigger]);

  const handleDownload = async (documentId: number, decrypt: boolean = false) => {
    try {
      const response = await fetch(
        `http://localhost:3010/api/documents/${documentId}?download=true&decrypt=${decrypt}`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error al descargar documento');
      }

      // Crear un blob a partir de la respuesta
      const blob = await response.blob();
      
      // Obtener el nombre del archivo del header Content-Disposition o usar un nombre por defecto
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'documento';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]*)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Crear un enlace temporal y hacer clic en él para descargar
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Limpiar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Documento descargado exitosamente');
    } catch (error) {
      console.error('Error al descargar documento:', error);
      toast.error(error instanceof Error ? error.message : 'Error al descargar documento');
    }
  };

  const handleDelete = async (documentId: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este documento?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3010/api/documents/${documentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error al eliminar documento');
      }

      // Actualizar la lista de documentos
      setDocuments(documents.filter(doc => doc.id !== documentId));
      toast.success('Documento eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      toast.error(error instanceof Error ? error.message : 'Error al eliminar documento');
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'CV':
        return 'CV';
      case 'Cover Letter':
        return 'Carta de Presentación';
      case 'Certificate':
        return 'Certificado';
      case 'Other':
        return 'Otro';
      default:
        return type;
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'txt':
        return '📃';
      default:
        return '📎';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando documentos...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>Error: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-2">
          Reintentar
        </Button>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-6 rounded-md text-center">
        <p>No hay documentos disponibles para este candidato.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="text-xl font-semibold p-4 border-b">Documentos del Candidato</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Formato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seguridad
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{getFileTypeIcon(doc.fileType)}</span>
                    <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getDocumentTypeLabel(doc.type)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 uppercase">{doc.fileType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {doc.isEncrypted ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Encriptado
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      No encriptado
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {doc.isEncrypted && (
                      <button
                        onClick={() => handleDownload(doc.id, true)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Ver (desencriptado)"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDownload(doc.id, false)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Descargar"
                    >
                      <FiDownload className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
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
    </div>
  );
};

export default DocumentList; 