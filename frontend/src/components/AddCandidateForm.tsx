import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3010/api';

const AddCandidateForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    experience: '',
    cvFile: null as File | null,
  });

  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates`);
      if (response.ok) {
        const data = await response.json();
        setCandidates(data);
      } else {
        console.error('Error al obtener candidatos');
      }
    } catch (error) {
      console.error('Error de conexión con el servidor');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, cvFile: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.includes('@')) {
      alert('Por favor, introduce un correo electrónico válido.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/candidates`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Candidato añadido exitosamente.');
        fetchCandidates(); // Actualizar la lista de candidatos
      } else {
        alert('Error al añadir el candidato.');
      }
    } catch (error) {
      alert('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de candidatos</h2>
      <table className="table table-striped table-responsive">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Educación</th>
            <th>Experiencia</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate: any) => (
            <tr key={candidate.id}>
              <td>{candidate.firstName}</td>
              <td>{candidate.lastName}</td>
              <td>{candidate.email}</td>
              <td>{candidate.phone}</td>
              <td>{candidate.address}</td>
              <td>{candidate.education}</td>
              <td>{candidate.experience}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Datos de candidato</h2>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="firstName">Nombre</label>
            <input type="text" className="form-control" id="firstName" name="firstName" onChange={handleChange} required />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="lastName">Apellido</label>
            <input type="text" className="form-control" id="lastName" name="lastName" onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" className="form-control" id="email" name="email" onChange={handleChange} required />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="phone">Teléfono</label>
            <input type="tel" className="form-control" id="phone" name="phone" onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="address">Dirección</label>
          <textarea className="form-control" id="address" name="address" rows={3} onChange={handleChange}></textarea>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="education">Educación</label>
            <input type="text" className="form-control" id="education" name="education" onChange={handleChange} />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="experience">Experiencia Laboral</label>
            <input type="text" className="form-control" id="experience" name="experience" onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="cvFile">Cargar CV</label>
          <input type="file" className="form-control-file" id="cvFile" name="cvFile" accept=".pdf,.docx" onChange={handleFileChange} />
        </div>
        <button type="submit" className="btn btn-primary">Añadir Candidato</button>
      </form>
    </div>
  );
};

export default AddCandidateForm;