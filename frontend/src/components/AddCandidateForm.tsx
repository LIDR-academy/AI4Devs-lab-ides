import React, { useState } from 'react';
import axios from 'axios';

const AddCandidateForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    experience: '',
    resume: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, resume: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, (formData as any)[key]);
    });

    try {
      await axios.post('http://localhost:3010/candidates', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Candidate added successfully');
    } catch (error) {
      console.error('Error adding candidate', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre:</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
      </div>
      <div>
        <label>Apellido:</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
      </div>
      <div>
        <label>Correo Electrónico:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Teléfono:</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
      </div>
      <div>
        <label>Dirección:</label>
        <textarea name="address" value={formData.address} onChange={handleChange} required />
      </div>
      <div>
        <label>Educación:</label>
        <input type="text" name="education" value={formData.education} onChange={handleChange} required />
      </div>
      <div>
        <label>Experiencia Laboral:</label>
        <input type="text" name="experience" value={formData.experience} onChange={handleChange} required />
      </div>
      <div>
        <label>CV:</label>
        <input type="file" name="resume" accept=".pdf,.docx" onChange={handleFileChange} required />
      </div>
      <button type="submit">Añadir Candidato</button>
    </form>
  );
};

export default AddCandidateForm;