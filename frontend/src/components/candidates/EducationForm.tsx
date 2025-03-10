import React from 'react';
import { Education } from '../../types/candidate';

interface EducationFormProps {
  education: (Education & { isNew?: boolean })[];
  addEducation: () => void;
  updateEducation: (index: number, field: keyof Education, value: string | Date | null) => void;
  removeEducation: (index: number) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({
  education,
  addEducation,
  updateEducation,
  removeEducation,
}) => {
  return (
    <div className="form-section">
      <div className="section-header">
        <h3 className="section-title">Educación</h3>
        <button 
          type="button" 
          className="button-add" 
          onClick={addEducation}
        >
          + Añadir Educación
        </button>
      </div>
      
      {education.length === 0 && (
        <p className="empty-section-message">No hay información educativa añadida.</p>
      )}
      
      {education.map((edu, index) => (
        <div key={index} className="item-container">
          <div className="item-header">
            <h4>Educación #{index + 1}</h4>
            <button 
              type="button" 
              className="button-remove" 
              onClick={() => removeEducation(index)}
            >
              Eliminar
            </button>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`education-institution-${index}`}>Institución *</label>
              <input
                type="text"
                id={`education-institution-${index}`}
                value={edu.institution}
                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                required
                placeholder="Universidad, instituto, etc."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={`education-degree-${index}`}>Título *</label>
              <input
                type="text"
                id={`education-degree-${index}`}
                value={edu.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                required
                placeholder="Grado, máster, certificación, etc."
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`education-field-${index}`}>Campo de Estudio</label>
              <input
                type="text"
                id={`education-field-${index}`}
                value={edu.fieldOfStudy || ''}
                onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                placeholder="Informática, Administración, etc."
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`education-start-${index}`}>Fecha de Inicio *</label>
              <input
                type="date"
                id={`education-start-${index}`}
                value={typeof edu.startDate === 'string' ? edu.startDate.substring(0, 10) : ''}
                onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={`education-end-${index}`}>Fecha de Finalización</label>
              <input
                type="date"
                id={`education-end-${index}`}
                value={edu.endDate ? (typeof edu.endDate === 'string' ? edu.endDate.substring(0, 10) : '') : ''}
                onChange={(e) => updateEducation(index, 'endDate', e.target.value || null)}
              />
              <div className="checkbox-container">
                <label>
                  <input
                    type="checkbox"
                    checked={!edu.endDate}
                    onChange={(e) => updateEducation(index, 'endDate', e.target.checked ? null : new Date().toISOString().substring(0, 10))}
                  />
                  Actualmente estudiando
                </label>
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor={`education-description-${index}`}>Descripción</label>
              <textarea
                id={`education-description-${index}`}
                value={edu.description || ''}
                onChange={(e) => updateEducation(index, 'description', e.target.value)}
                rows={3}
                placeholder="Descripción de los estudios, logros, etc."
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationForm; 