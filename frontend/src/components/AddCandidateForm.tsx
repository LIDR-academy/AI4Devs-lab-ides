import React, { useState } from 'react';
import './AddCandidateForm.css';
import { config } from '../config/config';

interface AddCandidateFormProps {
  onSubmitSuccess: () => void;
  onSubmitError: (error: string) => void;
}

const AddCandidateForm: React.FC<AddCandidateFormProps> = ({ onSubmitSuccess, onSubmitError }) => {
  const [formData, setFormData] = useState<{
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
    direccion: string;
    educacion: string;
    experiencia: string;
    cv: File | null;
  }>({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: '',
    educacion: '',
    experiencia: '',
    cv: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, cv: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      // Añadir cada campo al FormData
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('apellido', formData.apellido);
      formDataToSend.append('correo', formData.correo);
      formDataToSend.append('telefono', formData.telefono);
      formDataToSend.append('direccion', formData.direccion);
      formDataToSend.append('educacion', formData.educacion);
      formDataToSend.append('experiencia', formData.experiencia);
      
      // Añadir el archivo CV si existe
      if (formData.cv) {
        formDataToSend.append('cv', formData.cv);
      }

      console.log('Enviando datos:', Object.fromEntries(formDataToSend));  // Para debugging

      const response = await fetch(`${config.api.baseUrl}/api/candidates`, {
        method: 'POST',
        body: formDataToSend, // No establecer Content-Type, el navegador lo hará automáticamente
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear el candidato');
      }

      // Limpiar el formulario y notificar éxito
      setFormData({
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        direccion: '',
        educacion: '',
        experiencia: '',
        cv: null,
      });

      onSubmitSuccess();
    } catch (error) {
      console.error('Error:', error);
      onSubmitError(error instanceof Error ? error.message : 'Error al crear el candidato');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Añadir Nuevo Candidato</h2>
      <form onSubmit={handleSubmit} className="add-candidate-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            placeholder="Ej: Juan"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="apellido">Apellido</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            placeholder="Ej: Pérez"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="correo">Correo Electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            placeholder="Ej: juan.perez@email.com"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            placeholder="Ej: +52 (123) 456-7890"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            placeholder="Ej: Calle Principal #123, Ciudad"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="educacion">Educación</label>
          <input
            type="text"
            id="educacion"
            name="educacion"
            placeholder="Ej: Licenciatura en Informática"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="experiencia">Experiencia Laboral</label>
          <input
            type="text"
            id="experiencia"
            name="experiencia"
            placeholder="Ej: 3 años como Desarrollador Web"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cv">Curriculum Vitae (PDF o DOCX)</label>
          <input
            type="file"
            id="cv"
            name="cv"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Añadir Candidato
        </button>
      </form>
    </div>
  );
};

export default AddCandidateForm; 