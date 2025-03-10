import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DocumentUpload from '../components/candidates/DocumentUpload';
import DocumentList from '../components/candidates/DocumentList';
import { Button } from '../components/ui/Button';
import { FiArrowLeft, FiUser } from 'react-icons/fi';

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const CandidateDocumentsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:3010/api/candidates/${id}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Error al obtener candidato');
        }

        const data = await response.json();
        setCandidate(data.data);
      } catch (error) {
        console.error('Error al obtener candidato:', error);
        setError(error instanceof Error ? error.message : 'Error al obtener candidato');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  const handleUploadSuccess = () => {
    toast.success('Documento subido exitosamente');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-pulse" data-testid="loading-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
              <p className="text-gray-700 mb-4">{error || 'No se pudo cargar el candidato'}</p>
              <Button onClick={handleBack}>Volver al Dashboard</Button>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button onClick={handleBack} variant="outline" className="mr-4">
              <FiArrowLeft className="mr-2" /> Volver
            </Button>
            <h1 className="text-2xl font-bold">Documentos del Candidato</h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FiUser className="text-blue-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {candidate.firstName} {candidate.lastName}
              </h2>
              <p className="text-gray-600">{candidate.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <DocumentUpload 
              candidateId={parseInt(id as string)} 
              onUploadSuccess={handleUploadSuccess} 
            />
          </div>
          <div className="lg:col-span-2">
            <DocumentList 
              candidateId={parseInt(id as string)} 
              refreshTrigger={refreshTrigger} 
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CandidateDocumentsPage; 