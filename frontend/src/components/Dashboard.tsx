import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

// Define the Candidate interface
interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: string;
  workExperience?: string;
  cvFilePath?: string;
  createdAt: string;
  updatedAt: string;
}

// Form data interface
interface CandidateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  workExperience: string;
}

const Dashboard: React.FC = () => {
  // State variables
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [formData, setFormData] = useState<CandidateFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    workExperience: ''
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch candidates on component mount
  useEffect(() => {
    fetchCandidates();
  }, []);

  // Function to fetch candidates from API
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3010/api/candidates');
      setCandidates(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Failed to fetch candidates. Please try again later.');
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      education: '',
      workExperience: ''
    });
    setCvFile(null);
    setEditingCandidate(null);
  };

  // Open form for creating a new candidate
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Open form for editing an existing candidate
  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setFormData({
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone || '',
      address: candidate.address || '',
      education: candidate.education || '',
      workExperience: candidate.workExperience || ''
    });
    setShowForm(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Submitting form data:', formData);
      const formDataToSend = new FormData();
      
      // Append form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value || ''); // Ensure null/undefined values are sent as empty strings
        console.log(`Appending ${key}:`, value);
      });
      
      // Append file if selected
      if (cvFile) {
        formDataToSend.append('cvFile', cvFile);
        console.log('Appending file:', cvFile.name);
      }
      
      console.log('Sending request to create candidate...');
      const response = await axios.post(
        'http://localhost:3010/api/candidates',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log('Create response:', response.data);
      setSuccessMessage('Candidate created successfully!');
      
      // Reset form and refresh candidates
      resetForm();
      setShowForm(false);
      fetchCandidates();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error('Error submitting form:', err);
      console.error('Error response:', err.response?.data);
      
      // Display more detailed error message
      const errorMessage = err.response?.data?.details || err.response?.data?.error || 'An error occurred. Please try again.';
      setError(errorMessage);
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  // Handle candidate deletion
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await axios.delete(`http://localhost:3010/api/candidates/${id}`);
        setSuccessMessage('Candidate deleted successfully!');
        fetchCandidates();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } catch (err) {
        console.error('Error deleting candidate:', err);
        setError('Failed to delete candidate. Please try again.');
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    }
  };

  // View candidate CV
  const handleViewCV = (cvFilePath: string) => {
    window.open(`http://localhost:3010/${cvFilePath}`, '_blank');
  };

  // Loading state
  if (loading && candidates.length === 0) {
    return (
      <div className="loading-container">
        <h2>Loading candidates...</h2>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Candidate Management Dashboard</h1>
      
      {/* Success and error messages */}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}
      
      {/* Form toggle button */}
      <div className="dashboard-actions">
        <button className="add-button" onClick={handleAddNew}>
          Add New Candidate
        </button>
      </div>
      
      {/* Candidate form */}
      {showForm && (
        <div className="form-container">
          <h2>{editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="education">Education</label>
                <textarea
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="workExperience">Work Experience</label>
                <textarea
                  id="workExperience"
                  name="workExperience"
                  value={formData.workExperience}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cvFile">CV File (PDF or DOCX)</label>
                <input
                  type="file"
                  id="cvFile"
                  name="cvFile"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                />
                {editingCandidate?.cvFilePath && (
                  <p className="current-file">
                    Current file: {editingCandidate.cvFilePath.split('/').pop()}
                  </p>
                )}
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-button">
                {editingCandidate ? 'Update Candidate' : 'Add Candidate'}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Candidates list */}
      <div className="candidates-list">
        <h2>All Candidates ({candidates.length})</h2>
        
        {candidates.length === 0 ? (
          <div className="no-candidates">
            <p>No candidates found. Add your first candidate to get started!</p>
          </div>
        ) : (
          <table className="candidates-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>{candidate.firstName} {candidate.lastName}</td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phone || 'N/A'}</td>
                  <td className="actions-cell">
                    <button
                      className="view-button"
                      onClick={() => {
                        if (candidate.cvFilePath) {
                          handleViewCV(candidate.cvFilePath);
                        } else {
                          alert('No CV file available for this candidate.');
                        }
                      }}
                      disabled={!candidate.cvFilePath}
                    >
                      View CV
                    </button>
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(candidate)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(candidate.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
