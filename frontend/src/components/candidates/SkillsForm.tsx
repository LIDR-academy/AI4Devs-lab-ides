import React from 'react';
import { Skill, ProficiencyLevel } from '../../types/candidate';

interface SkillsFormProps {
  skills: (Skill & { isNew?: boolean })[];
  addSkill: () => void;
  updateSkill: (index: number, field: keyof Skill, value: string | ProficiencyLevel) => void;
  removeSkill: (index: number) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({
  skills,
  addSkill,
  updateSkill,
  removeSkill,
}) => {
  // Lista de habilidades comunes para autocompletado
  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js',
    'Node.js', 'Express', 'Python', 'Django', 'Flask',
    'Java', 'Spring', 'C#', '.NET', 'PHP',
    'Laravel', 'Ruby', 'Ruby on Rails', 'SQL', 'MySQL',
    'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
    'Git', 'GitHub', 'GitLab', 'CI/CD', 'Agile',
    'Scrum', 'Kanban', 'Jira', 'Confluence', 'Figma',
    'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'UI/UX',
    'HTML', 'CSS', 'SASS', 'LESS', 'Bootstrap',
    'Tailwind CSS', 'Material UI', 'Responsive Design', 'Mobile Development', 'React Native',
    'Flutter', 'Swift', 'Kotlin', 'Android', 'iOS',
    'Testing', 'Jest', 'Mocha', 'Cypress', 'Selenium',
    'TDD', 'BDD', 'Performance Optimization', 'Security', 'Accessibility',
    'SEO', 'Analytics', 'Marketing', 'Sales', 'Communication',
    'Leadership', 'Project Management', 'Problem Solving', 'Critical Thinking', 'Teamwork',
  ];

  return (
    <div className="form-section">
      <div className="section-header">
        <h3 className="section-title">Habilidades</h3>
        <button 
          type="button" 
          className="button-add" 
          onClick={addSkill}
        >
          + Añadir Habilidad
        </button>
      </div>
      
      {skills.length === 0 && (
        <p className="empty-section-message">No hay habilidades añadidas.</p>
      )}
      
      {skills.map((skill, index) => (
        <div key={index} className="item-container skill-item">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`skill-name-${index}`}>Habilidad *</label>
              <input
                type="text"
                id={`skill-name-${index}`}
                value={skill.name}
                onChange={(e) => updateSkill(index, 'name', e.target.value)}
                required
                placeholder="Nombre de la habilidad"
                list={`skill-suggestions-${index}`}
              />
              <datalist id={`skill-suggestions-${index}`}>
                {commonSkills.map((suggestion, i) => (
                  <option key={i} value={suggestion} />
                ))}
              </datalist>
            </div>
            
            <div className="form-group">
              <label htmlFor={`skill-level-${index}`}>Nivel</label>
              <select
                id={`skill-level-${index}`}
                value={skill.proficiencyLevel || ProficiencyLevel.INTERMEDIATE}
                onChange={(e) => updateSkill(index, 'proficiencyLevel', e.target.value as ProficiencyLevel)}
              >
                <option value={ProficiencyLevel.BEGINNER}>Principiante</option>
                <option value={ProficiencyLevel.INTERMEDIATE}>Intermedio</option>
                <option value={ProficiencyLevel.ADVANCED}>Avanzado</option>
                <option value={ProficiencyLevel.EXPERT}>Experto</option>
              </select>
            </div>
            
            <div className="form-group button-group">
              <button 
                type="button" 
                className="button-remove" 
                onClick={() => removeSkill(index)}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsForm; 