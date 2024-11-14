import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './AddCandidateForm.css';
import { act } from 'react';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  cv?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: Array<{
    institution: string;
    degree: string;
    graduationYear: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  cv: File | null;
}

export const AddCandidateForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: [{
      institution: '',
      degree: '',
      graduationYear: '',
    }],
    experience: [{
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
    }],
    cv: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = useCallback(async (field: keyof FormData, value: string) => {
    await act(async () => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    });
  }, []);

  const handleEducationChange = useCallback((index: number, field: keyof FormData['education'][0], value: string) => {
    setFormData(prev => {
      const newEducation = [...prev.education];
      newEducation[index] = { ...newEducation[index], [field]: value };
      return { ...prev, education: newEducation };
    });
  }, []);

  const handleExperienceChange = useCallback((index: number, field: keyof FormData['experience'][0], value: string) => {
    setFormData(prev => {
      const newExperience = [...prev.experience];
      newExperience[index] = { ...newExperience[index], [field]: value };
      return { ...prev, experience: newExperience };
    });
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await act(async () => {
        if (file.size <= 5 * 1024 * 1024) {
          setFormData(prev => ({ ...prev, cv: file }));
          setErrors(prev => ({ ...prev, cv: undefined }));
        } else {
          setErrors(prev => ({ ...prev, cv: 'El archivo no debe superar los 5MB' }));
        }
      });
    }
  }, []);

  const validateForm = useCallback(async () => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.firstName) {
      newErrors.firstName = 'El nombre es obligatorio';
      isValid = false;
    }
    if (!formData.lastName) {
      newErrors.lastName = 'El apellido es obligatorio';
      isValid = false;
    }
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Formato de teléfono inválido';
      isValid = false;
    }

    await act(async () => {
      setErrors(newErrors);
    });

    return isValid;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          if (Array.isArray(value)) {
            formDataToSend.append(key, JSON.stringify(value));
          } else if (value instanceof File) {
            formDataToSend.append(key, value);
          } else {
            formDataToSend.append(key, String(value));
          }
        }
      });

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/candidates`,
        formDataToSend
      );
    } catch (error) {
      console.error('Error al añadir candidato:', error);
    }
  }, [formData, validateForm]);

  const addExperience = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: ''
        }
      ]
    }));
  }, []);

  const addEducation = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: '',
          degree: '',
          graduationYear: ''
        }
      ]
    }));
  }, []);

  return (
    <form className="add-candidate-form" onSubmit={handleSubmit}>
      <h2>Añadir Nuevo Candidato</h2>

      {/* Información Personal */}
      <div className="form-section">
        <h3>Información Personal</h3>
        <div className="form-group">
          <label htmlFor="firstName">Nombre *</label>
          <input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={errors.firstName ? 'error' : ''}
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Apellido *</label>
          <input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={errors.lastName ? 'error' : ''}
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo electrónico *</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Teléfono</label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="address">Dirección</label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />
        </div>
      </div>

      {/* Educación */}
      <div className="form-section">
        <h3>Educación</h3>
        {formData.education.map((edu, index) => (
          <div key={index} className="education-entry">
            <div className="form-group">
              <label htmlFor={`institution-${index}`}>Institución Educativa</label>
              <input
                id={`institution-${index}`}
                type="text"
                value={edu.institution}
                onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor={`degree-${index}`}>Título</label>
              <input
                id={`degree-${index}`}
                type="text"
                value={edu.degree}
                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor={`graduationYear-${index}`}>Año de Graduación</label>
              <input
                id={`graduationYear-${index}`}
                type="text"
                value={edu.graduationYear}
                onChange={(e) => handleEducationChange(index, 'graduationYear', e.target.value)}
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={addEducation}>+ Añadir Educación</button>
      </div>

      {/* Experiencia Laboral */}
      <div className="form-section">
        <h3>Experiencia Laboral</h3>
        {formData.experience.map((exp, index) => (
          <div key={index} className="experience-entry">
            <div className="form-group">
              <label htmlFor={`company-${index}`}>Empresa</label>
              <input
                id={`company-${index}`}
                type="text"
                value={exp.company}
                onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor={`position-${index}`}>Cargo</label>
              <input
                id={`position-${index}`}
                type="text"
                value={exp.position}
                onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor={`startDate-${index}`}>Fecha de Inicio</label>
              <input
                id={`startDate-${index}`}
                type="date"
                value={exp.startDate}
                onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor={`endDate-${index}`}>Fecha de Fin</label>
              <input
                id={`endDate-${index}`}
                type="date"
                value={exp.endDate}
                onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor={`description-${index}`}>Descripción</label>
              <textarea
                id={`description-${index}`}
                value={exp.description}
                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={addExperience}>+ Añadir Experiencia</button>
      </div>

      {/* Documentos */}
      <div className="form-section">
        <h3>Documentos</h3>
        <div className="form-group">
          <label htmlFor="cv">Subir CV</label>
          <input
            id="cv"
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
          />
          {formData.cv && <span className="file-name">{formData.cv.name}</span>}
          {errors.cv && <span className="error-message">{errors.cv}</span>}
        </div>
      </div>

      <button type="submit">
        Añadir Candidato
      </button>
    </form>
  );
};