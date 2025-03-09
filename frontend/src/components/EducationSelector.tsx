import React, { useState, useRef } from 'react';
import { Education } from '../types/Candidate';
import './EducationSelector.css';

interface EducationSelectorProps {
  selectedEducation: Education[];
  onChange: (education: Education[]) => void;
}

const EducationSelector: React.FC<EducationSelectorProps> = ({ 
  selectedEducation, 
  onChange 
}) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [customEducation, setCustomEducation] = useState<Education>({
    degree: '',
    institution: '',
    fieldOfStudy: '',
    startYear: new Date().getFullYear(),
    endYear: undefined,
    isCurrentlyStudying: false
  });
  
  const formRef = useRef<HTMLDivElement>(null);
  
  // Function to handle backdrop click (close the form)
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop itself, not the form
    if (e.target === e.currentTarget) {
      console.log('Backdrop clicked');
      
      // Check if there's data in the form
      const hasData = !!(
        customEducation.degree || 
        customEducation.institution || 
        customEducation.fieldOfStudy
      );
      
      if (hasData) {
        if (window.confirm('You have unsaved education data. Are you sure you want to close this form?')) {
          setShowForm(false);
        }
      } else {
        setShowForm(false);
      }
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const isChecked = (e.target as HTMLInputElement).checked;
      setCustomEducation(prev => ({
        ...prev,
        [name]: isChecked,
        endYear: isChecked ? undefined : prev.endYear
      }));
    } else if (name === 'startYear' || name === 'endYear') {
      setCustomEducation(prev => ({
        ...prev,
        [name]: value ? parseInt(value, 10) : undefined
      }));
    } else {
      setCustomEducation(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCustomSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    console.log('Submitting education form', customEducation);
    
    // Validate required fields
    if (!customEducation.degree || !customEducation.institution || 
        !customEducation.fieldOfStudy || !customEducation.startYear) {
      console.error('Missing required fields in education form', customEducation);
      // Show validation errors to the user
      alert('Please fill in all required fields for education');
      return; // Don't submit if required fields are missing
    }
    
    console.log('Adding education:', customEducation);
    
    // Ensure all fields are properly formatted
    const validatedEducation: Education = {
      ...customEducation,
      degree: String(customEducation.degree),
      institution: String(customEducation.institution),
      fieldOfStudy: String(customEducation.fieldOfStudy),
      startYear: Number(customEducation.startYear),
      // Make sure endYear is correctly typed as number | undefined
      endYear: customEducation.endYear ? Number(customEducation.endYear) : undefined,
      isCurrentlyStudying: Boolean(customEducation.isCurrentlyStudying)
    };
    
    console.log('Validated education:', validatedEducation);
    
    // Add to the selected education list
    const newEducationList = [...selectedEducation, validatedEducation];
    console.log('New education list:', newEducationList);
    onChange(newEducationList);
    
    // Reset the form
    setCustomEducation({
      degree: '',
      institution: '',
      fieldOfStudy: '',
      startYear: new Date().getFullYear(),
      endYear: undefined,
      isCurrentlyStudying: false
    });
    
    // Hide the form after successful submission
    setShowForm(false);
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = [...selectedEducation];
    newEducation.splice(index, 1);
    onChange(newEducation);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="education-selector">
      <div className="education-header">
        <h3>Education</h3>
        <div className="education-actions">
          <button 
            type="button" 
            className="add-custom-button" 
            onClick={() => setShowForm(true)}
          >
            Add Education
          </button>
        </div>
      </div>

      {selectedEducation.length > 0 && (
        <div className="education-list">
          {selectedEducation.map((edu, index) => (
            <div key={index} className="education-item">
              <div className="education-item-header">
                <h4>{edu.degree}</h4>
                <button 
                  type="button" 
                  className="remove-button"
                  onClick={() => handleRemoveEducation(index)}
                >
                  Remove
                </button>
              </div>
              <div className="education-item-details">
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
            </div>
          ))}
        </div>
      )}

      {/* Modal with Backdrop */}
      {showForm && (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
          <div className="custom-education-form" ref={formRef}>
            <button 
              type="button" 
              className="close-button"
              onClick={() => {
                const hasData = !!(
                  customEducation.degree || 
                  customEducation.institution || 
                  customEducation.fieldOfStudy
                );
                
                if (hasData) {
                  if (window.confirm('You have unsaved education data. Are you sure you want to close this form?')) {
                    setShowForm(false);
                  }
                } else {
                  setShowForm(false);
                }
              }}
            >
              X
            </button>
            <h4>Add Education</h4>
            <form>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="degree">Degree *</label>
                  <input
                    type="text"
                    id="degree"
                    name="degree"
                    value={customEducation.degree}
                    onChange={handleCustomChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="institution">Institution *</label>
                  <input
                    type="text"
                    id="institution"
                    name="institution"
                    value={customEducation.institution}
                    onChange={handleCustomChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fieldOfStudy">Field of Study *</label>
                  <input
                    type="text"
                    id="fieldOfStudy"
                    name="fieldOfStudy"
                    value={customEducation.fieldOfStudy}
                    onChange={handleCustomChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="startYear">Start Year *</label>
                  <select
                    id="startYear"
                    name="startYear"
                    value={customEducation.startYear}
                    onChange={handleCustomChange}
                    required
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="isCurrentlyStudying"
                    name="isCurrentlyStudying"
                    checked={customEducation.isCurrentlyStudying}
                    onChange={handleCustomChange}
                  />
                  <label htmlFor="isCurrentlyStudying">Currently Studying</label>
                </div>
                
                {!customEducation.isCurrentlyStudying && (
                  <div className="form-group">
                    <label htmlFor="endYear">End Year</label>
                    <select
                      id="endYear"
                      name="endYear"
                      value={customEducation.endYear || ''}
                      onChange={handleCustomChange}
                    >
                      <option value="">Select Year</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="submit-button"
                  onClick={handleCustomSubmit}
                >
                  Add Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationSelector; 