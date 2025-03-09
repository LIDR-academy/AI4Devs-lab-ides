import axios, { AxiosResponse, AxiosError } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010/api';

// Crear instancia de axios con configuración base
const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

// Servicios para usuarios
export const userService = {
  // Obtener todos los usuarios
  getAll: async () => {
    const response = await instance.get('/users');
    return response.data;
  },

  // Obtener un usuario por ID
  getById: async (id: number) => {
    const response = await instance.get(`/users/${id}`);
    return response.data;
  },

  // Crear un nuevo usuario
  create: async (userData: { email: string; name?: string }) => {
    const response = await instance.post('/users', userData);
    return response.data;
  },

  // Actualizar un usuario
  update: async (id: number, userData: { email?: string; name?: string }) => {
    const response = await instance.put(`/users/${id}`, userData);
    return response.data;
  },

  // Eliminar un usuario
  delete: async (id: number) => {
    const response = await instance.delete(`/users/${id}`);
    return response.data;
  },
};

// API genérica con métodos HTTP
const api = {
  get: (url: string, config = {}) => instance.get(url, config),
  post: (url: string, data = {}, config = {}) => instance.post(url, data, config),
  put: (url: string, data = {}, config = {}) => instance.put(url, data, config),
  delete: (url: string, config = {}) => instance.delete(url, config),
  userService,
};

export default api; 