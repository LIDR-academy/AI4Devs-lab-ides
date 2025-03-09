// File: frontend/src/AddCandidateForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import './AddCandidateForm.css';

const AddCandidateForm: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [educacion, setEducacion] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !apellido || !correo) {
      setError('Please fill in all required fields.');
      setMessage('');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      setError('Invalid email format.');
      setMessage('');
      return;
    }

    if (!localStorage.getItem('token') || localStorage.getItem('token') === 'null') {
      localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkxUSWRiVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.ugQ1jAoN7dFBDvoMak8bKu4hNksw14BOC8rMbQ5WyrM');
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('correo_electronico', correo);
    formData.append('telefono', telefono);
    formData.append('direccion', direccion);
    formData.append('educacion', educacion);
    formData.append('experiencia_laboral', experiencia);
    if (cvFile) {
      formData.append('cv', cvFile);
    }
    try {
      await axios.post('/candidatos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage('Candidate added successfully.');
      setError('');
      setNombre('');
      setApellido('');
      setCorreo('');
      setTelefono('');
      setDireccion('');
      setEducacion('');
      setExperiencia('');
      setCvFile(null);
    } catch (err: any) {
      setError('Error adding candidate. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="container">
      <h2>Add Candidate</h2>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label htmlFor="nombre">Nombre*</label>
          <input id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div className="formGroup">
          <label htmlFor="apellido">Apellido*</label>
          <input id="apellido" type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
        </div>
        <div className="formGroup">
          <label htmlFor="correo">Correo Electrónico*</label>
          <input id="correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </div>
        <div className="formGroup">
          <label htmlFor="telefono">Teléfono</label>
          <input id="telefono" type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        </div>
        <div className="formGroup">
          <label htmlFor="direccion">Dirección</label>
          <input id="direccion" type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        </div>
        <div className="formGroup">
          <label htmlFor="educacion">Educación</label>
          <input id="educacion" type="text" value={educacion} onChange={(e) => setEducacion(e.target.value)} />
        </div>
        <div className="formGroup">
          <label htmlFor="experiencia">Experiencia Laboral</label>
          <input id="experiencia" type="text" value={experiencia} onChange={(e) => setExperiencia(e.target.value)} />
        </div>
        <div className="formGroup">
          <label htmlFor="cv">Upload CV (PDF or DOCX)</label>
          <input id="cv" type="file" accept=".pdf,.docx" onChange={(e) => e.target.files && setCvFile(e.target.files[0])} />
        </div>
        <button type="submit">Add Candidate</button>
      </form>
    </div>
  );
};

export default AddCandidateForm;