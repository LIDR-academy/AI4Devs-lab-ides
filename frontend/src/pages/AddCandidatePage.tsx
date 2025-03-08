import React from 'react';
import CandidateForm from '../components/CandidateForm';
import { useNavigate } from 'react-router-dom';

const AddCandidatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Navigate back to the dashboard after successful submission
    setTimeout(() => {
      navigate('/', { state: { refresh: true } });
    }, 2000);
  };

  return (
    <div className="add-candidate-page">
      <div className="page-header">
        <h1>Add New Candidate</h1>
        <button className="back-button" onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </div>
      <div className="page-content">
        <CandidateForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default AddCandidatePage; 