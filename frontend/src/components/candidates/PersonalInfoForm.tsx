import React, { ChangeEvent } from 'react';
import { CandidateFormData } from '../../types/candidate';

interface PersonalInfoFormProps {
  formData: CandidateFormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  formData,
  handleInputChange,
  handleFileChange,
}) => {
  return (
    <div className="form-section">
      <h3 className="section-title">Información Personal</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">Nombre *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            placeholder="Nombre del candidato"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Apellido *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            placeholder="Apellido del candidato"
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="email@ejemplo.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Teléfono</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleInputChange}
            placeholder="+34 123 456 789"
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group full-width">
          <label htmlFor="address">Dirección</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address || ''}
            onChange={handleInputChange}
            placeholder="Calle, número, piso..."
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">Ciudad</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city || ''}
            onChange={handleInputChange}
            placeholder="Ciudad"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="state">Provincia/Estado</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state || ''}
            onChange={handleInputChange}
            placeholder="Provincia o estado"
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="country">País</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country || ''}
            onChange={handleInputChange}
            placeholder="País"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="postalCode">Código Postal</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode || ''}
            onChange={handleInputChange}
            placeholder="Código postal"
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group full-width">
          <label htmlFor="summary">Resumen Profesional</label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary || ''}
            onChange={handleInputChange}
            rows={4}
            placeholder="Breve descripción del perfil profesional del candidato..."
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group full-width">
          <label htmlFor="cv">Curriculum Vitae (PDF, DOC, DOCX)</label>
          <input
            type="file"
            id="cv"
            name="cv"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="file-input"
          />
          <p className="file-help-text">Tamaño máximo: 5MB</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm; 