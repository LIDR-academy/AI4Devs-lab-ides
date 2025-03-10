import React from 'react';
import { Link } from 'react-router-dom';
import CandidatesList from '../components/candidates/CandidatesList';
import '../styles/common.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard de Reclutamiento</h2>
        <Link to="/candidates/new" className="btn btn-primary nav-link">
          + Añadir Candidato
        </Link>
      </div>
      
      <div className="dashboard-content">
        <CandidatesList />
      </div>
    </div>
  );
};

export default Dashboard;