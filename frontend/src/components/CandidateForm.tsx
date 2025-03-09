import React, { useState, useRef } from 'react';
import { CandidateFormData, AVAILABLE_POSITIONS, Education, CandidateStatus } from '../types/Candidate';
import EducationSelector from './EducationSelector';
import './CandidateForm.css';

interface CandidateFormProps {
  onSubmit: (data: CandidateFormData) => void;
  onCancel: () => void;
  initialData?: Partial<CandidateFormData>;
  resumeFileName?: string;
  isEditing?: boolean;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ 
  onSubmit, 
  onCancel,
  initialData = {},
  resumeFileName,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<Omit<CandidateFormData, 'education'>>({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    position: initialData.position || AVAILABLE_POSITIONS[0],
    notes: initialData.notes || '',
    status: initialData.status || CandidateStatus.NEW
  });

  const [education, setEducation] = useState<Education[]>(initialData.education || []);
  const [errors, setErrors] = useState<Partial<Record<keyof CandidateFormData, string>>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Function to check if any fields are filled
  const hasFilledFields = (): boolean => {
    return !!(
      formData.name.trim() || 
      formData.email.trim() || 
      formData.phone.trim() || 
      (formData.notes && formData.notes.trim()) || 
      education.length > 0 || 
      selectedFile
    );
  };

  // Handle backdrop click to close the form
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking on the backdrop, not the form itself
    if (e.target === e.currentTarget) {
      // If form has data entered, confirm before closing
      if (hasFilledFields()) {
        if (window.confirm('Are you sure you want to close this form? Your unsaved data will be lost.')) {
          onCancel();
        }
      } else {
        // No data entered, just close it
        onCancel();
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CandidateFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      // Phone validation - should be digits, possibly with some formatting characters
      // This will allow formats like: 123-456-7890, (123) 456-7890, 123.456.7890
      const phoneRegex = /^[\d\s\-+().]{10,15}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
      } else {
        // Count digits only, ignoring formatting characters
        const digitCount = formData.phone.replace(/\D/g, '').length;
        if (digitCount < 10 || digitCount > 15) {
          newErrors.phone = 'Phone number must have 10-15 digits';
        }
      }
    }
    
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof CandidateFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEducationChange = (newEducation: Education[]) => {
    setEducation(newEducation);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Include the selected file and education in the submission
      const submissionData: CandidateFormData = {
        ...formData,
        education
      };
      
      if (selectedFile) {
        submissionData.resume = selectedFile;
      }
      
      onSubmit(submissionData);
    } else {
      // Form validation failed, not submitting
    }
  };

  return (
    <div className="candidate-form-container" data-testid="candidate-form-container" onClick={handleBackdropClick}>
      <form className="candidate-form" onSubmit={handleSubmit} ref={formRef}>
        <h2>{isEditing ? 'Edit Candidate' : 'Add New Candidate'}</h2>
        
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <div className="error-message">{errors.phone}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="position">Position *</label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className={errors.position ? 'error' : ''}
          >
            {AVAILABLE_POSITIONS.map(position => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
          {errors.position && <div className="error-message">{errors.position}</div>}
        </div>
        
        {isEditing && (
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {Object.values(CandidateStatus).map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <EducationSelector
          selectedEducation={education}
          onChange={handleEducationChange}
        />
        
        <div className="form-group">
          <label htmlFor="resume">Resume</label>
          <div className="file-upload-container">
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="file-input"
            />
            <div className="file-input-wrapper">
              <button type="button" className="file-select-button" onClick={() => fileInputRef.current?.click()}>
                Select File
              </button>
              <span className="file-name">
                {selectedFile ? selectedFile.name : resumeFileName || 'No file chosen'}
              </span>
              {(selectedFile || resumeFileName) && (
                <button type="button" className="file-remove-button" onClick={handleFileRemove}>
                  Remove
                </button>
              )}
            </div>
            <div className="file-hint">
              Accepted formats: PDF, DOC, DOCX (Max size: 10MB)
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button" 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button"
          >
            {initialData ? 'Update' : 'Add'} Candidate
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm; 