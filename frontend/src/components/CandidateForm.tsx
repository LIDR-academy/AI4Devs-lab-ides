import React, { useState } from 'react';
import EducationField, { Education } from './form/EducationField';
import WorkExperienceField, { WorkExperience } from './form/WorkExperienceField';
import FileUploadField from './form/FileUploadField';
import '../styles/components/CandidateForm.css';

// Interfaces
interface Candidate {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  education: Education[];
  workExperience: WorkExperience[];
  cv: File | null;
  skills: string[];
  notes: string;
}

interface CandidateFormProps {
  initialData?: Partial<Candidate>;
  onSubmit: (candidate: Candidate) => void;
  isLoading?: boolean;
}

// Componente principal
const CandidateForm: React.FC<CandidateFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading = false,
}) => {
  // Estado del formulario
  const [formData, setFormData] = useState<Candidate>({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    education: initialData.education || [],
    workExperience: initialData.workExperience || [],
    cv: initialData.cv || null,
    skills: initialData.skills || [],
    notes: initialData.notes || '',
  });
  
  // Estado de errores
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Manejador de cambios para campos simples
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar error si existe
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Manejador para el campo de habilidades
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsString = e.target.value;
    const skillsArray = skillsString.split(',').map(skill => skill.trim()).filter(Boolean);
    
    setFormData(prev => ({
      ...prev,
      skills: skillsArray,
    }));
  };
  
  // Manejador para el campo de educación
  const handleEducationChange = (education: Education[]) => {
    setFormData(prev => ({
      ...prev,
      education,
    }));
  };
  
  // Manejador para el campo de experiencia laboral
  const handleWorkExperienceChange = (workExperience: WorkExperience[]) => {
    setFormData(prev => ({
      ...prev,
      workExperience,
    }));
  };
  
  // Manejador para el campo de CV
  const handleCvChange = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      cv: file,
    }));
  };
  
  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validar nombre
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio';
    }
    
    // Validar apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio';
    }
    
    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }
    
    // Validar teléfono (opcional pero con formato si se proporciona)
    if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = 'El formato del teléfono no es válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Manejador de envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form className="candidate-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2 className="form-title">Información del Candidato</h2>
        <p className="form-subtitle">Completa la información del candidato para el proceso de selección</p>
      </div>
      
      <div className="form-section">
        <h3 className="section-title">Datos Personales</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">
              Nombre <span className="required">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className={`form-input ${errors.firstName ? 'has-error' : ''}`}
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Ingresa el nombre"
              disabled={isLoading}
            />
            {errors.firstName && <div className="form-error">{errors.firstName}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              Apellido <span className="required">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className={`form-input ${errors.lastName ? 'has-error' : ''}`}
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Ingresa el apellido"
              disabled={isLoading}
            />
            {errors.lastName && <div className="form-error">{errors.lastName}</div>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'has-error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              disabled={isLoading}
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`form-input ${errors.phone ? 'has-error' : ''}`}
              value={formData.phone}
              onChange={handleChange}
              placeholder="+34 123 456 789"
              disabled={isLoading}
            />
            {errors.phone && <div className="form-error">{errors.phone}</div>}
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <FileUploadField
          value={formData.cv}
          onChange={handleCvChange}
          required={true}
          acceptedFileTypes=".pdf,.doc,.docx"
          maxSizeMB={5}
          label="Curriculum Vitae (CV)"
          id="cv"
          name="cv"
          error={errors.cv}
        />
      </div>
      
      <div className="form-section">
        <EducationField
          value={formData.education}
          onChange={handleEducationChange}
          required={true}
        />
      </div>
      
      <div className="form-section">
        <WorkExperienceField
          value={formData.workExperience}
          onChange={handleWorkExperienceChange}
          required={false}
        />
      </div>
      
      <div className="form-section">
        <h3 className="section-title">Información Adicional</h3>
        
        <div className="form-group">
          <label htmlFor="skills" className="form-label">
            Habilidades
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            className="form-input"
            value={formData.skills.join(', ')}
            onChange={handleSkillsChange}
            placeholder="Ingresa habilidades separadas por comas"
            disabled={isLoading}
          />
          <div className="form-hint">
            Ingresa las habilidades separadas por comas (ej: JavaScript, React, Node.js)
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes" className="form-label">
            Notas
          </label>
          <textarea
            id="notes"
            name="notes"
            className="form-textarea"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Añade notas adicionales sobre el candidato"
            rows={4}
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="spinner" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="none" strokeWidth="4" />
              </svg>
              Guardando...
            </>
          ) : (
            'Guardar Candidato'
          )}
        </button>
      </div>
    </form>
  );
};

export default CandidateForm; 