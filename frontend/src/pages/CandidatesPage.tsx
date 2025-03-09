import React, { useState, useEffect } from 'react';
import CandidateForm from '../components/CandidateForm';
import { Candidate, CandidateFormData, CandidateStatus, Education } from '../types/Candidate';
import { candidateService } from '../services/candidateService';
import './CandidatesPage.css';

const CandidatesPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [refresh, setRefresh] = useState<number>(0);
  
  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const data = await candidateService.getCandidates();
        setCandidates(data || []);
      } catch (error) {
        // Handle API errors
        setError('Failed to load candidates. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, [refresh]);
  
  const handleAddCandidate = async (formData: CandidateFormData) => {
    setIsLoading(true);
    try {
      const newCandidate = await candidateService.createCandidate(formData);
      
      if (newCandidate) {
        // Refresh the candidates list
        setRefresh(prev => prev + 1);
        setShowForm(false);
      } else {
        setError('Failed to add candidate. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while adding the candidate.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCandidate = async (formData: CandidateFormData) => {
    if (!editingCandidate || typeof editingCandidate.id !== 'number') return;
    
    // Map endYear from null to undefined for the frontend type
    const processedFormData: CandidateFormData = {
      ...formData,
      education: formData.education.map(edu => ({
        ...edu,
        startYear: Number(edu.startYear),
        // Make sure we use undefined instead of null for the frontend type
        endYear: edu.endYear ? Number(edu.endYear) : undefined,
        isCurrentlyStudying: Boolean(edu.isCurrentlyStudying)
      }))
    };
    
    setIsLoading(true);
    try {
      const updatedCandidate = await candidateService.updateCandidate(
        editingCandidate.id, 
        {
          ...processedFormData,
          status: editingCandidate.status
        }
      );
      
      if (updatedCandidate) {
        // Refresh the candidates list
        setRefresh(prev => prev + 1);
        setEditingCandidate(null);
        setShowForm(false);
      } else {
        setError('Failed to update candidate. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while updating the candidate.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingCandidate(null);
  };
  
  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowDetails(true);
  };
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking on the backdrop, not the content itself
    if (e.target === e.currentTarget) {
      console.log('Details backdrop clicked');
      setShowDetails(false);
    }
  };
  
  const getStatusColor = (status: CandidateStatus): string => {
    switch (status) {
      case CandidateStatus.NEW:
        return '#4caf50'; // Green
      case CandidateStatus.SCREENING:
        return '#2196f3'; // Blue
      case CandidateStatus.INTERVIEW:
        return '#ff9800'; // Orange
      case CandidateStatus.TECHNICAL_TEST:
        return '#9c27b0'; // Purple
      case CandidateStatus.OFFER:
        return '#e91e63'; // Pink
      case CandidateStatus.HIRED:
        return '#3f51b5'; // Indigo
      case CandidateStatus.REJECTED:
        return '#f44336'; // Red
      default:
        return '#9e9e9e'; // Grey
    }
  };
  
  const handleCloseDetailsModal = () => {
    setSelectedCandidate(null);
  };
  
  return (
    <div className="candidates-page">
      <div className="header">
        <h1>Candidate Management</h1>
        <button 
          className="add-button"
          onClick={() => {
            setEditingCandidate(null); // Ensure we're not in edit mode
            setShowForm(true);
          }}
          disabled={isLoading}
        >
          Add Candidate
        </button>
      </div>
      
      {error && <div className="error-banner">{error}</div>}
      
      {isLoading && !showForm ? (
        <div className="loading">Loading candidates...</div>
      ) : (
        <div className="candidates-list">
          {candidates.length === 0 ? (
            <div className="no-candidates">
              <p>No candidates found. Add your first candidate to get started.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Education</th>
                  <th>Resume</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(candidate => (
                  <tr key={candidate.id}>
                    <td>{candidate.name}</td>
                    <td>{candidate.position}</td>
                    <td>
                      <a href={`mailto:${candidate.email}`}>
                        {candidate.email}
                      </a>
                    </td>
                    <td>
                      <a href={`tel:${candidate.phone}`}>
                        {candidate.phone}
                      </a>
                    </td>
                    <td>
                      {candidate.education && candidate.education.length > 0 ? (
                        <span className="education-count">
                          {candidate.education.length} {candidate.education.length === 1 ? 'item' : 'items'}
                        </span>
                      ) : (
                        <span className="no-education">None</span>
                      )}
                    </td>
                    <td>
                      {candidate.resumeFilename ? (
                        <a 
                          href={candidateService.getResumeDownloadUrl(candidate.id!)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="resume-link"
                        >
                          Download Resume
                        </a>
                      ) : (
                        <span className="no-resume">No resume</span>
                      )}
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(candidate.status) }}
                      >
                        {candidate.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="view-button"
                          onClick={() => handleViewCandidate(candidate)}
                        >
                          View
                        </button>
                        <button 
                          className="edit-button"
                          onClick={() => {
                            setEditingCandidate(candidate);
                            setShowForm(true);
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      
      {showForm && (
        <CandidateForm 
          onSubmit={editingCandidate ? handleEditCandidate : handleAddCandidate}
          onCancel={handleCancelEdit}
          initialData={editingCandidate || {}}
          resumeFileName={editingCandidate?.resumeFilename}
          isEditing={!!editingCandidate}
        />
      )}
      
      {showDetails && selectedCandidate && (
        <div className="candidate-details-modal" onClick={handleBackdropClick}>
          <div className="candidate-details">
            <div className="details-header">
              <h2>{selectedCandidate.name}</h2>
              <button 
                className="close-button"
                onClick={handleCloseDetailsModal}
              >
                &times;
              </button>
            </div>
            
            <div className="details-content">
              <div className="detail-section">
                <h3>Personal Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Position:</span>
                  <span className="detail-value">{selectedCandidate.position}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">
                    <a href={`mailto:${selectedCandidate.email}`}>{selectedCandidate.email}</a>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">
                    <a href={`tel:${selectedCandidate.phone}`}>{selectedCandidate.phone}</a>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className="detail-value">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(selectedCandidate.status) }}
                    >
                      {selectedCandidate.status.replace('_', ' ')}
                    </span>
                  </span>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Education</h3>
                {selectedCandidate.education && selectedCandidate.education.length > 0 ? (
                  <div className="education-list">
                    {selectedCandidate.education.map((edu: Education, index: number) => (
                      <div key={index} className="education-item">
                        <h4>{edu.degree}</h4>
                        <div className="detail-row">
                          <span className="detail-label">Institution:</span>
                          <span className="detail-value">{edu.institution}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Field of Study:</span>
                          <span className="detail-value">{edu.fieldOfStudy}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Period:</span>
                          <span className="detail-value">
                            {edu.startYear} - {edu.isCurrentlyStudying ? 'Present' : edu.endYear}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No education information available</p>
                )}
              </div>
              
              <div className="detail-section">
                <h3>Resume</h3>
                {selectedCandidate.resumeFilename ? (
                  <a 
                    href={candidateService.getResumeDownloadUrl(selectedCandidate.id!)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-button"
                  >
                    Download Resume
                  </a>
                ) : (
                  <p className="no-data">No resume uploaded</p>
                )}
              </div>
              
              <div className="detail-section">
                <h3>Notes</h3>
                {selectedCandidate.notes ? (
                  <p className="notes-content">{selectedCandidate.notes}</p>
                ) : (
                  <p className="no-data">No notes available</p>
                )}
              </div>
            </div>
            
            <div className="details-footer">
              <button 
                className="close-button"
                onClick={handleCloseDetailsModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesPage; 