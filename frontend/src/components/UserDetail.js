import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3010/api/users/${id}`)
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user:', error));
  }, [id]);

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <form className="user-form">
      <h1>Detalle del Usuario</h1>
      <div className="form-row">
        <label>
          Nombre:
          <input type="text" name="name" value={user.name} readOnly />
        </label>
        <label>
          Apellido:
          <input type="text" name="surname" value={user.surname} readOnly />
        </label>
      </div>
      <div className="form-row">
        <label>
          Correo Electrónico:
          <input type="email" name="email" value={user.email} readOnly />
        </label>
        <label>
          Teléfono:
          <input type="tel" name="phone" value={user.phone} readOnly />
        </label>
      </div>
      <div className="form-row">
        <label>
          Dirección:
          <input type="text" name="address" value={user.address} readOnly />
        </label>
        <label>
          Educación:
          <input type="text" name="education" value={user.education} readOnly />
        </label>
      </div>
      <div className="form-row">
        <label className="full-width">
          Experiencia Laboral:
          <textarea name="experience" value={user.experience} readOnly />
        </label>
      </div>
      <div className="form-row">
        <label className="full-width">
          CV:
          {user.cv ? <a href={`http://localhost:3010/uploads/${user.cv}`} target="_blank" rel="noopener noreferrer">Ver CV</a> : 'No disponible'}
        </label>
      </div>
    </form>
  );
};

export default UserDetail;
