// First, update imports to include FormControlLabel and Checkbox
import { TextField, Button, IconButton, FormControlLabel, Checkbox } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './Candidates.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// Move interfaces to the top
import { saveAs } from 'file-saver';

interface Education {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string | null;
  isOngoing: boolean;
}

interface Experience {
  id: number;
  company: string;
  position: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string | null;
  isCurrentJob: boolean;
}

// At the top of the component
const CandidateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

  const [educations, setEducations] = useState<Education[]>([{ 
    id: 1, 
    institution: '', 
    degree: '', 
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    isOngoing: false
  }]);

  const [experiences, setExperiences] = useState<Experience[]>([{ 
    id: 1, 
    company: '', 
    position: '', 
    location: '', 
    description: '',
    startDate: '',
    endDate: '',
    isCurrentJob: false
  }]);

  const [documents, setDocuments] = useState<Array<any>>([]);

  const handleDownloadDocument = async (documentId: number, fileName: string) => {
    try {
      const response = await api.get(`/documents/${documentId}/download`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/octet-stream'
        }
      });
  
      // Create a blob from the response data
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/octet-stream' 
      });
  
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      // Append to document, click, and cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  const fetchCandidate = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const response = await api.get(`/candidates/${id}`);
      const candidate = response.data.data;
      
      setFormData({
        firstName: candidate.firstName || '',
        lastName: candidate.lastName || '',
        email: candidate.email || '',
        phoneNumber: candidate.phoneNumber || '',
        address: candidate.address || '',
      });

      if (candidate.education?.length > 0) {
        setEducations(candidate.education.map((edu: any, index: number) => ({
          id: index + 1,
          institution: edu.institution,
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy,
          startDate: new Date(edu.startDate).toISOString().split('T')[0],
          endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : '',
          isOngoing: !edu.endDate
        })));
      }

      if (candidate.experience?.length > 0) {
        setExperiences(candidate.experience.map((exp: any, index: number) => ({
          id: index + 1,
          company: exp.company,
          position: exp.position,
          location: exp.location,
          description: exp.description,
          startDate: new Date(exp.startDate).toISOString().split('T')[0],
          endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
          isCurrentJob: !exp.endDate
        })));
      }
    } catch (error) {
      console.error('Failed to fetch candidate:', error);
      toast.error('Failed to load candidate details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidate();
  }, [id, location.pathname]); // Now location is properly defined

  // Add loading state handling in the return
  if (id && isLoading) {
    return <div className="candidate-form-container">Loading...</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEducationChange = (id: number, field: keyof Education, value: string | boolean) => {
    setEducations(prev => prev.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const handleExperienceChange = (id: number, field: keyof Experience, value: string | boolean) => {
    setExperiences(prev => prev.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addEducation = () => {
    setEducations([...educations, { 
      id: educations.length + 1,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: null,
      isOngoing: false
    }]);
  };

  const addExperience = () => {
    setExperiences([...experiences, { 
      id: experiences.length + 1,
      company: '',
      position: '',
      location: '',
      description: '',
      startDate: '',
      endDate: null,
      isCurrentJob: false
    }]);
  };

  const removeEducation = (id: number) => {
    if (educations.length > 1) {
      setEducations(educations.filter(edu => edu.id !== id));
    }
  };

  const removeExperience = (id: number) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter(exp => exp.id !== id));
    }
  };

  // Add this helper function at the top of the component
  const formatDateToISO = (date: string) => {
    if (!date) return null;
    return new Date(date).toISOString();
  };
  
  // Update the handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        education: educations.map(({ id, endDate, startDate, isOngoing, ...rest }) => ({
          ...rest,
          startDate: formatDateToISO(startDate),
          endDate: isOngoing ? null : formatDateToISO(endDate || '')
        })),
        experience: experiences.map(({ id, endDate, startDate, isCurrentJob, ...rest }) => ({
          ...rest,
          startDate: formatDateToISO(startDate),
          endDate: isCurrentJob ? null : formatDateToISO(endDate || '')
        })),
        status: 'ACTIVE'
      };
  
      if (id) {
        await api.put(`/candidates/${id}`, payload);
        toast.success('Candidate updated successfully');
      } else {
        await api.post('/candidates', payload);
        toast.success('Candidate created successfully');
      }
      navigate('/dashboard/candidates');
    } catch (error: any) {
      console.error('Error saving candidate:', error);
      // Display the specific error message from the backend if available
      const errorMessage = error.response?.data?.message || `Error ${id ? 'updating' : 'creating'} candidate`;
      toast.error(errorMessage);
    }
  };

  return (
    <div className="candidate-form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2 className="form-section-title">Personal Information</h2>
          <div className="form-row">
            <div className="form-field">
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                variant="outlined"
                required
                fullWidth
              />
            </div>
            <div className="form-field">
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                variant="outlined"
                required
                fullWidth
              />
            </div>
            <div className="form-field">
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                variant="outlined"
                required
                fullWidth
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                variant="outlined"
                required
                fullWidth
              />
            </div>
            <div className="form-field">
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                variant="outlined"
                required
                fullWidth
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">Education</h2>
          {educations.map((edu) => (
            <div key={edu.id} className="form-row">
              <div className="form-field">
                <TextField
                  label="Institution"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                  variant="outlined"
                  required
                  fullWidth
                />
              </div>
              <div className="form-field">
                <TextField
                  label="Degree"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                  variant="outlined"
                  required
                  fullWidth
                />
              </div>
              <div className="form-field">
                <TextField
                  label="Field of Study"
                  value={edu.fieldOfStudy}
                  onChange={(e) => handleEducationChange(edu.id, 'fieldOfStudy', e.target.value)}
                  variant="outlined"
                  required
                  fullWidth
                />
              </div>
              <div className="form-field">
                <TextField
                  label="Start Date"
                  type="date"
                  value={edu.startDate}
                  onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                  variant="outlined"
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className="form-field">
                <TextField
                  label="End Date"
                  type="date"
                  value={edu.endDate || ''}
                  onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                  variant="outlined"
                  required={!edu.isOngoing}
                  disabled={edu.isOngoing}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className="form-field">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={edu.isOngoing}
                      onChange={(e) => handleEducationChange(edu.id, 'isOngoing', e.target.checked)}
                    />
                  }
                  label="Currently Studying"
                />
              </div>
              {educations.length > 1 && (
                <IconButton 
                  onClick={() => removeEducation(edu.id)}
                  className="remove-button"
                  size="small"
                >
                  <CloseIcon />
                </IconButton>
              )}
            </div>
          ))}
          <button type="button" className="add-section-button" onClick={addEducation}>
            <AddIcon /> Add Education
          </button>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">Experience</h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="form-row">
              <div className="form-field">
                <TextField
                  label="Company"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                  variant="outlined"
                  required
                  fullWidth
                />
              </div>
              <div className="form-field">
                <TextField
                  label="Position"
                  value={exp.position}
                  onChange={(e) => handleExperienceChange(exp.id, 'position', e.target.value)}
                  variant="outlined"
                  required
                  fullWidth
                />
              </div>
              <div className="form-field">
                <TextField
                  label="Location"
                  value={exp.location}
                  onChange={(e) => handleExperienceChange(exp.id, 'location', e.target.value)}
                  variant="outlined"
                  required
                  fullWidth
                />
              </div>
              <div className="form-field">
                <TextField
                  label="Start Date"
                  type="date"
                  value={exp.startDate}
                  onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                  variant="outlined"
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className="form-field">
                <TextField
                  label="End Date"
                  type="date"
                  value={exp.endDate || ''}
                  onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                  variant="outlined"
                  required={!exp.isCurrentJob}
                  disabled={exp.isCurrentJob}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className="form-field">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exp.isCurrentJob}
                      onChange={(e) => handleExperienceChange(exp.id, 'isCurrentJob', e.target.checked)}
                    />
                  }
                  label="Current Job"
                />
              </div>
              {experiences.length > 1 && (
                <IconButton 
                  onClick={() => removeExperience(exp.id)}
                  className="remove-button"
                  size="small"
                >
                  <CloseIcon />
                </IconButton>
              )}
            </div>
          ))}
          <button type="button" className="add-section-button" onClick={addExperience}>
            <AddIcon /> Add Experience
          </button>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">Documents</h2>
          {documents.map((doc) => (
            <div key={doc.id} className="document-item">
              <span>{doc.fileName}</span>
              <Button
                onClick={() => handleDownloadDocument(doc.id, doc.fileName)}
                variant="outlined"
                size="small"
              >
                Download
              </Button>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <Button 
            className="cancel-button"
            onClick={() => navigate('/dashboard/candidates')}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="save-button"
          >
            Save Candidate
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm;
