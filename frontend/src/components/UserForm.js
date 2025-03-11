import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    experience: '',
    cv: null
  });

  const [educationOptions, setEducationOptions] = useState([]);
  const [experienceOptions, setExperienceOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3010/api/education-options')
      .then(response => response.json())
      .then(data => setEducationOptions(data))
      .catch(error => console.error('Error fetching education options:', error));

    fetch('http://localhost:3010/api/experience-options')
      .then(response => response.json())
      .then(data => setExperienceOptions(data))
      .catch(error => console.error('Error fetching experience options:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, cv: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    fetch('http://localhost:3010/api/users', { // Asegúrate de que la URL sea correcta
      method: 'POST',
      body: data
    })
      .then(response => response.json())
      .then(data => {
        alert('Usuario añadido exitosamente');
        navigate('/'); // Redirigir al listado de usuarios
      })
      .catch(error => {
        console.error('Error adding user:', error);
        alert('Error al añadir el usuario');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h1>Registrar Nuevo Usuario</h1>
      <div className="form-row">
        <label>
          Nombre:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Apellido:
          <input type="text" name="surname" value={formData.surname} onChange={handleChange} required />
        </label>
      </div>
      <div className="form-row">
        <label>
          Correo Electrónico:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Teléfono:
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </label>
      </div>
      <div className="form-row">
        <label>
          Dirección:
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </label>
        <label>
          Educación:
          <input list="education-options" name="education" value={formData.education} onChange={handleChange} required />
          <datalist id="education-options">
            {educationOptions.map((option, index) => (
              <option key={index} value={option} />
            ))}
          </datalist>
        </label>
      </div>
      <div className="form-row">
        <label className="full-width">
          Experiencia Laboral:
          <textarea list="experience-options" name="experience" value={formData.experience} onChange={handleChange} required />
          <datalist id="experience-options">
            {experienceOptions.map((option, index) => (
              <option key={index} value={option} />
            ))}
          </datalist>
        </label>
      </div>
      <div className="form-row">
        <label className="full-width">
          CV:
          <input type="file" name="cv" onChange={handleFileChange} accept=".pdf,.doc,.docx" required />
        </label>
      </div>
      <button type="submit">Registrar</button>
    </form>
  );
};

export default UserForm;
