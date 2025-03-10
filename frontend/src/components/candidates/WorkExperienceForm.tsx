import React from 'react';
import { WorkExperience } from '../../types/candidate';

interface WorkExperienceFormProps {
  workExperience: (WorkExperience & { isNew?: boolean })[];
  addWorkExperience: () => void;
  updateWorkExperience: (index: number, field: keyof WorkExperience, value: string | Date | null) => void;
  removeWorkExperience: (index: number) => void;
}

const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({
  workExperience,
  addWorkExperience,
  updateWorkExperience,
  removeWorkExperience,
}) => {
  return (
    <div className="form-section">
      <div className="section-header">
        <h3 className="section-title">Experiencia Laboral</h3>
        <button 
          type="button" 
          className="button-add" 
          onClick={addWorkExperience}
        >
          + Añadir Experiencia
        </button>
      </div>
      
      {workExperience.length === 0 && (
        <p className="empty-section-message">No hay experiencia laboral añadida.</p>
      )}
      
      {workExperience.map((exp, index) => (
        <div key={index} className="item-container">
          <div className="item-header">
            <h4>Experiencia #{index + 1}</h4>
            <button 
              type="button" 
              className="button-remove" 
              onClick={() => removeWorkExperience(index)}
            >
              Eliminar
            </button>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`work-company-${index}`}>Empresa *</label>
              <input
                type="text"
                id={`work-company-${index}`}
                value={exp.company}
                onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                required
                placeholder="Nombre de la empresa"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={`work-position-${index}`}>Cargo *</label>
              <input
                type="text"
                id={`work-position-${index}`}
                value={exp.position}
                onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                required
                placeholder="Cargo o puesto"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`work-location-${index}`}>Ubicación</label>
              <input
                type="text"
                id={`work-location-${index}`}
                value={exp.location || ''}
                onChange={(e) => updateWorkExperience(index, 'location', e.target.value)}
                placeholder="Ciudad, país"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`work-start-${index}`}>Fecha de Inicio *</label>
              <input
                type="date"
                id={`work-start-${index}`}
                value={typeof exp.startDate === 'string' ? exp.startDate.substring(0, 10) : ''}
                onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={`work-end-${index}`}>Fecha de Finalización</label>
              <input
                type="date"
                id={`work-end-${index}`}
                value={exp.endDate ? (typeof exp.endDate === 'string' ? exp.endDate.substring(0, 10) : '') : ''}
                onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value || null)}
              />
              <div className="checkbox-container">
                <label>
                  <input
                    type="checkbox"
                    checked={!exp.endDate}
                    onChange={(e) => updateWorkExperience(index, 'endDate', e.target.checked ? null : new Date().toISOString().substring(0, 10))}
                  />
                  Trabajo actual
                </label>
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor={`work-description-${index}`}>Descripción</label>
              <textarea
                id={`work-description-${index}`}
                value={exp.description || ''}
                onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                rows={3}
                placeholder="Descripción de responsabilidades, logros, etc."
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkExperienceForm; 