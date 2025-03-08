import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { candidateApi } from '../services/api';
import { Candidate } from '../types/candidate';

const HomePage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const data = await candidateApi.getAllCandidates();
      setCandidates(data);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Refresh candidates when navigating back from add candidate page
  useEffect(() => {
    if (location.state && (location.state as any).refresh) {
      fetchCandidates();
      // Clear the state to prevent unnecessary refreshes
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="home-page">
      <div className="dashboard-header">
        <h1>ATS Recruitment System</h1>
        <p className="subtitle">Streamline your recruitment process</p>
      </div>
      
      <div className="dashboard-actions">
        <Link to="/add-candidate" className="action-button">
          <span className="icon">+</span> Add New Candidate
        </Link>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Candidates</h3>
            <p className="stat-value">
              {loading ? (
                <span className="loading-dot-animation">Loading</span>
              ) : (
                candidates.length
              )}
            </p>
            <p className="stat-description">Total candidates in the system</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-content">
            <h3>Active Jobs</h3>
            <p className="stat-value">0</p>
            <p className="stat-description">Open positions</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Interviews</h3>
            <p className="stat-value">0</p>
            <p className="stat-description">Scheduled this week</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="welcome-message">
          <h2>Welcome to the ATS System</h2>
          <p>
            This Applicant Tracking System helps you manage your recruitment process efficiently.
            Track candidates, schedule interviews, and make better hiring decisions.
          </p>
          <p>
            <strong>Getting Started:</strong> Click on "Add New Candidate" to add a new candidate to the system.
          </p>
          <div className="feature-list">
            <div className="feature">
              <div className="feature-icon">📝</div>
              <div className="feature-text">
                <h3>Candidate Management</h3>
                <p>Add, edit, and track candidates throughout the hiring process</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">📄</div>
              <div className="feature-text">
                <h3>Resume Storage</h3>
                <p>Upload and store candidate resumes securely</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">📅</div>
              <div className="feature-text">
                <h3>Interview Scheduling</h3>
                <p>Schedule and manage interviews with candidates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 