import React, { useState, useEffect } from 'react';
import { Candidate } from '../types/candidate';
import { candidateApi } from '../services/api';

interface CandidateFormProps {
  onSuccess: () => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ onSuccess }) => {
  const [candidate, setCandidate] = useState<Candidate>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: [{ institution: '', degree: '', fieldOfStudy: '', startDate: '' }],
    workExperience: [{ company: '', position: '', startDate: '' }],
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle input change for basic fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCandidate({ ...candidate, [name]: value });
  };

  // Handle education fields
  const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedEducation = [...(candidate.education || [])];
    updatedEducation[index] = { ...updatedEducation[index], [name]: value };
    setCandidate({ ...candidate, education: updatedEducation });
  };

  // Add education field
  const addEducation = () => {
    setCandidate({
      ...candidate,
      education: [
        ...(candidate.education || []),
        { institution: '', degree: '', fieldOfStudy: '', startDate: '' },
      ],
    });
  };

  // Remove education field
  const removeEducation = (index: number) => {
    const updatedEducation = [...(candidate.education || [])];
    updatedEducation.splice(index, 1);
    setCandidate({ ...candidate, education: updatedEducation });
  };

  // Handle work experience fields
  const handleWorkExperienceChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedWorkExperience = [...(candidate.workExperience || [])];
    updatedWorkExperience[index] = { ...updatedWorkExperience[index], [name]: value };
    setCandidate({ ...candidate, workExperience: updatedWorkExperience });
  };

  // Add work experience field
  const addWorkExperience = () => {
    setCandidate({
      ...candidate,
      workExperience: [
        ...(candidate.workExperience || []),
        { company: '', position: '', startDate: '' },
      ],
    });
  };

  // Remove work experience field
  const removeWorkExperience = (index: number) => {
    const updatedWorkExperience = [...(candidate.workExperience || [])];
    updatedWorkExperience.splice(index, 1);
    setCandidate({ ...candidate, workExperience: updatedWorkExperience });
  };

  // Handle resume file upload
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  // Validate form
  const validateForm = () => {
    if (!candidate.firstName || !candidate.lastName || !candidate.email) {
      setNotification({ type: 'error', message: 'First name, last name, and email are required' });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(candidate.email)) {
      setNotification({ type: 'error', message: 'Invalid email format' });
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setNotification(null);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const newCandidate = await candidateApi.createCandidate(candidate) as Candidate;

      // Upload resume if provided
      if (resumeFile && newCandidate.id) {
        await candidateApi.uploadResume(newCandidate.id, resumeFile);
      }

      setSuccess(true);
      setNotification({ 
        type: 'success', 
        message: `Candidate ${candidate.firstName} ${candidate.lastName} added successfully!` 
      });
      
      setCandidate({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        education: [{ institution: '', degree: '', fieldOfStudy: '', startDate: '' }],
        workExperience: [{ company: '', position: '', startDate: '' }],
      });
      setResumeFile(null);
      onSuccess();
    } catch (err) {
      setError('Failed to add candidate. Please try again.');
      setNotification({ 
        type: 'error', 
        message: 'Failed to add candidate. Please try again.' 
      });
      console.error('Error adding candidate:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="candidate-form">
      <h2>Add New Candidate</h2>
      
      {notification && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notification.type === 'success' ? '✓' : '✗'}
            </span>
            <span className="notification-message">{notification.message}</span>
          </div>
          <button 
            className="notification-close" 
            onClick={() => setNotification(null)}
          >
            ×
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={candidate.firstName}
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
              value={candidate.lastName}
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
              value={candidate.email}
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
              value={candidate.phone}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={candidate.address}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Education</h3>
          {candidate.education?.map((edu, index) => (
            <div key={index} className="education-item">
              <div className="form-group">
                <label htmlFor={`institution-${index}`}>Institution</label>
                <input
                  type="text"
                  id={`institution-${index}`}
                  name="institution"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, e)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`degree-${index}`}>Degree</label>
                <input
                  type="text"
                  id={`degree-${index}`}
                  name="degree"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, e)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`fieldOfStudy-${index}`}>Field of Study</label>
                <input
                  type="text"
                  id={`fieldOfStudy-${index}`}
                  name="fieldOfStudy"
                  value={edu.fieldOfStudy}
                  onChange={(e) => handleEducationChange(index, e)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`startDate-${index}`}>Start Date</label>
                <input
                  type="date"
                  id={`startDate-${index}`}
                  name="startDate"
                  value={edu.startDate}
                  onChange={(e) => handleEducationChange(index, e)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`endDate-${index}`}>End Date</label>
                <input
                  type="date"
                  id={`endDate-${index}`}
                  name="endDate"
                  value={edu.endDate}
                  onChange={(e) => handleEducationChange(index, e)}
                />
              </div>
              
              {index > 0 && (
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeEducation(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button type="button" className="add-button" onClick={addEducation}>
            Add Education
          </button>
        </div>
        
        <div className="form-section">
          <h3>Work Experience</h3>
          {candidate.workExperience?.map((exp, index) => (
            <div key={index} className="work-experience-item">
              <div className="form-group">
                <label htmlFor={`company-${index}`}>Company</label>
                <input
                  type="text"
                  id={`company-${index}`}
                  name="company"
                  value={exp.company}
                  onChange={(e) => handleWorkExperienceChange(index, e)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`position-${index}`}>Position</label>
                <input
                  type="text"
                  id={`position-${index}`}
                  name="position"
                  value={exp.position}
                  onChange={(e) => handleWorkExperienceChange(index, e)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`startDate-exp-${index}`}>Start Date</label>
                <input
                  type="date"
                  id={`startDate-exp-${index}`}
                  name="startDate"
                  value={exp.startDate}
                  onChange={(e) => handleWorkExperienceChange(index, e)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`endDate-exp-${index}`}>End Date</label>
                <input
                  type="date"
                  id={`endDate-exp-${index}`}
                  name="endDate"
                  value={exp.endDate}
                  onChange={(e) => handleWorkExperienceChange(index, e)}
                />
              </div>
              
              {index > 0 && (
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeWorkExperience(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button type="button" className="add-button" onClick={addWorkExperience}>
            Add Work Experience
          </button>
        </div>
        
        <div className="form-section">
          <h3>Resume</h3>
          <div className="form-group">
            <label htmlFor="resume">Upload Resume (PDF, DOC, DOCX)</label>
            <div className="file-upload-container">
              <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                className="file-input"
              />
              <label htmlFor="resume" className="file-upload-label">
                {resumeFile ? resumeFile.name : 'Choose a file'}
              </label>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <span className="loading-spinner">
                <span className="spinner"></span>
                Adding...
              </span>
            ) : (
              'Add Candidate'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm; 