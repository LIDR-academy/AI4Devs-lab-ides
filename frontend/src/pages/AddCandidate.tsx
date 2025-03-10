import React from 'react';
import { Link } from 'react-router-dom';
import CandidateForm from '../components/candidates/CandidateForm';
import '../styles/common.css';

const AddCandidate = () => {
  return (
    <div className="add-candidate-page">
      <div className="page-header">
        <h2>Añadir Nuevo Candidato</h2>
        <Link to="/" className="btn btn-secondary nav-link">
          ← Volver al Dashboard
        </Link>
      </div>
      
      <div className="page-content">
        <CandidateForm />
      </div>
    </div>
  );
};

export default AddCandidate;