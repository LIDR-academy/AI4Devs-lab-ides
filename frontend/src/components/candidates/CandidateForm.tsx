import React from 'react';
import { useCandidateForm } from '../../hooks/useCandidateForm';
import PersonalInfoForm from './PersonalInfoForm';
import EducationForm from './EducationForm';
import WorkExperienceForm from './WorkExperienceForm';
import SkillsForm from './SkillsForm';
import './CandidateForm.css';

interface CandidateFormProps {
  onClose?: () => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ onClose }) => {
  const {
    formData,
    isLoading,
    error,
    success,
    handleInputChange,
    handleFileChange,
    addEducation,
    updateEducation,
    removeEducation,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    addSkill,
    updateSkill,
    removeSkill,
    handleSubmit,
    resetForm,
  } = useCandidateForm();

  return (
    <div className="candidate-form-container">
      <h2 className="form-title">Añadir Nuevo Candidato</h2>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => resetForm()} className="close-button">×</button>
        </div>
      )}
      
      {success && (
        <div className="success-message">
          <p>¡Candidato creado exitosamente!</p>
          <div className="success-actions">
            <button onClick={() => resetForm()} className="button secondary">Añadir otro candidato</button>
            {onClose && <button onClick={onClose} className="button primary">Cerrar</button>}
          </div>
        </div>
      )}
      
      {!success && (
        <form onSubmit={handleSubmit} className="candidate-form">
          <div className="form-sections">
            <PersonalInfoForm 
              formData={formData} 
              handleInputChange={handleInputChange} 
              handleFileChange={handleFileChange} 
            />
            
            <EducationForm 
              education={formData.education} 
              addEducation={addEducation} 
              updateEducation={updateEducation} 
              removeEducation={removeEducation} 
            />
            
            <WorkExperienceForm 
              workExperience={formData.workExperience} 
              addWorkExperience={addWorkExperience} 
              updateWorkExperience={updateWorkExperience} 
              removeWorkExperience={removeWorkExperience} 
            />
            
            <SkillsForm 
              skills={formData.skills} 
              addSkill={addSkill} 
              updateSkill={updateSkill} 
              removeSkill={removeSkill} 
            />
          </div>
          
          <div className="form-actions">
            {onClose && (
              <button 
                type="button" 
                onClick={onClose} 
                className="button secondary"
                disabled={isLoading}
              >
                Cancelar
              </button>
            )}
            <button 
              type="submit" 
              className="button primary"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar Candidato'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CandidateForm; 