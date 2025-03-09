const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010/api';

// Función genérica para realizar peticiones HTTP
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Error en la petición');
    }

    return data;
  } catch (error) {
    console.error('Error en la petición:', error);
    throw error;
  }
};

// Servicios para usuarios
export const userService = {
  // Obtener todos los usuarios
  getAll: () => fetchAPI('/users'),

  // Obtener un usuario por ID
  getById: (id: number) => fetchAPI(`/users/${id}`),

  // Crear un nuevo usuario
  create: (userData: { email: string; name?: string }) =>
    fetchAPI('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Actualizar un usuario
  update: (id: number, userData: { email?: string; name?: string }) =>
    fetchAPI(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  // Eliminar un usuario
  delete: (id: number) =>
    fetchAPI(`/users/${id}`, {
      method: 'DELETE',
    }),
};

const api = {
  userService,
};

export default api; 