import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo centralizado de errores
    const errorMessage = error.response?.data?.message || 'Ha ocurrido un error';
    console.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);

export default api; 