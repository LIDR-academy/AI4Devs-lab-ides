import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Candidate } from '../../types/candidate.types';
import './CandidateSummary.css';

const CandidateSummary: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const candidate = location.state?.candidate as Candidate;

  if (!candidate) {
    return (
      <div className="candidate-summary-container">
        <p>No se encontró información del candidato.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Volver al Dashboard
        </button>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getResumeUrl = (resumeUrl: string) => {
    // Remove /api from the end of the base URL if it exists
    const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/api$/, '');
    return `${baseUrl}${resumeUrl}`;
  };

  return (
    <div className="candidate-summary-container">
      <h2>Resumen del Candidato</h2>
      
      <div className="summary-section">
        <h3>Información Personal</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Nombre:</label>
            <span>{candidate.firstName} {candidate.lastName}</span>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <span>{candidate.email}</span>
          </div>
          <div className="info-item">
            <label>Teléfono:</label>
            <span>{candidate.phone}</span>
          </div>
          <div className="info-item">
            <label>Dirección:</label>
            <span>{candidate.address}</span>
          </div>
        </div>
      </div>

      {candidate.education && candidate.education.length > 0 && (
        <div className="summary-section">
          <h3>Educación</h3>
          {candidate.education.map((edu, index) => (
            <div key={edu.id || index} className="card">
              <h4>{edu.institution}</h4>
              <p><strong>Título:</strong> {edu.degree}</p>
              <p><strong>Campo de Estudio:</strong> {edu.fieldOfStudy}</p>
              <p>
                <strong>Período:</strong> {formatDate(edu.startDate.toString())} - 
                {edu.current ? ' Actual' : edu.endDate ? formatDate(edu.endDate.toString()) : ''}
              </p>
            </div>
          ))}
        </div>
      )}

      {candidate.experience && candidate.experience.length > 0 && (
        <div className="summary-section">
          <h3>Experiencia Laboral</h3>
          {candidate.experience.map((exp, index) => (
            <div key={exp.id || index} className="card">
              <h4>{exp.company}</h4>
              <p><strong>Cargo:</strong> {exp.position}</p>
              <p><strong>Descripción:</strong> {exp.description}</p>
              <p>
                <strong>Período:</strong> {formatDate(exp.startDate.toString())} - 
                {exp.current ? ' Actual' : exp.endDate ? formatDate(exp.endDate.toString()) : ''}
              </p>
            </div>
          ))}
        </div>
      )}

      {candidate.resumeUrl && (
        <div className="summary-section">
          <h3>Curriculum Vitae</h3>
          <a 
            href={getResumeUrl(candidate.resumeUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Ver CV
          </a>
        </div>
      )}

      {candidate.notes && (
        <div className="summary-section">
          <h3>Notas Adicionales</h3>
          <p>{candidate.notes}</p>
        </div>
      )}

      <div className="summary-actions">
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
};

export default CandidateSummary; 