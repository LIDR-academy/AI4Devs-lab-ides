import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Candidate } from '../../types/candidate.types';
import { useAlert } from '../../hooks/useAlert';
import { Alert } from '../common/Alert';
import './CandidatesList.css';

const CandidatesList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; candidateId?: number }>({ show: false });
  const { showAlert, alertMessage, alertType, displayAlert, hideAlert } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates`);
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message);
      }
      
      setCandidates(data.data);
    } catch (error) {
      displayAlert('Error al cargar los candidatos', 'error');
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (candidate: Candidate) => {
    navigate(`/candidates/${candidate.id}/summary`, { state: { candidate } });
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        displayAlert('Candidato eliminado exitosamente', 'success');
        fetchCandidates(); // Recargar la lista
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      displayAlert('Error al eliminar el candidato', 'error');
      console.error('Error deleting candidate:', error);
    } finally {
      setDeleteModal({ show: false });
    }
  };

  const handleRefresh = () => {
    fetchCandidates();
  };

  if (loading) {
    return <div className="loading">Cargando candidatos...</div>;
  }

  return (
    <div className="candidates-list">
      {showAlert && (
        <Alert
          type={alertType}
          message={alertMessage}
          onClose={hideAlert}
        />
      )}

      <div className="list-header">
        <h2>Lista de Candidatos</h2>
        <button onClick={handleRefresh} className="refresh-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
          </svg>
          Refrescar
        </button>
      </div>

      {candidates.length === 0 ? (
        <div className="no-candidates">
          <p>No hay candidatos registrados.</p>
          <p>Haga clic en "Añadir Candidato" para crear uno nuevo.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="candidates-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Educación</th>
                <th>Experiencia</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>{candidate.firstName} {candidate.lastName}</td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phone}</td>
                  <td>
                    {candidate.education && candidate.education[0] ? (
                      <span title={`${candidate.education[0].degree} en ${candidate.education[0].institution}`}>
                        {candidate.education[0].degree}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {candidate.experience && candidate.experience[0] ? (
                      <span title={`${candidate.experience[0].position} en ${candidate.experience[0].company}`}>
                        {candidate.experience[0].position}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() => handleViewDetails(candidate)}
                        className="btn btn-primary btn-sm"
                        title="Ver detalles"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => setDeleteModal({ show: true, candidateId: candidate.id })}
                        className="btn btn-danger btn-sm"
                        title="Eliminar candidato"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteModal.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirmar Eliminación</h3>
            </div>
            <div className="modal-body">
              <p>¿Está seguro de que desea eliminar este candidato? Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setDeleteModal({ show: false })}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteModal.candidateId && handleDelete(deleteModal.candidateId)}
                className="btn btn-danger"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesList; 