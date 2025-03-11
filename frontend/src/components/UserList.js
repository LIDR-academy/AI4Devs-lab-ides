import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3010/api/users') // Asegúrate de que la URL sea correcta
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este perfil?')) {
      fetch(`http://localhost:3010/api/users/${id}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
            setUsers(users.filter(user => user.id !== id));
          } else {
            alert('Error al eliminar el perfil');
          }
        })
        .catch(error => console.error('Error deleting user:', error));
    }
  };

  return (
    <div>
      <h1>Listado de Usuarios</h1>
      <Link to="/add-user" className="add-user-button" title="Añadir nuevo usuario">
        <button>+</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Educación</th>
            <th>Experiencia</th>
            <th>CV</th>
            <th>Acciones</th> {/* Nueva columna */}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.surname}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.address}</td>
              <td>{user.education}</td>
              <td>{user.experience}</td>
              <td>{user.cv ? <a href={`http://localhost:3010/uploads/${user.cv}`} target="_blank" rel="noopener noreferrer">Ver CV</a> : 'No disponible'}</td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => navigate(`/user/${user.id}`)} title="Ver detalles">
                    👁️
                  </button>
                  <button onClick={() => handleDelete(user.id)} title="Eliminar perfil">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
