import axios from 'axios';
import { Candidate } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010/api';

// Configuración de Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Servicio para candidatos
export const candidateService = {
  /**
   * Obtener todos los candidatos
   */
  getAll: async () => {
    const response = await api.get('/candidates');
    return response.data;
  },

  /**
   * Obtener un candidato por ID
   */
  getById: async (id: number) => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo candidato
   */
  create: async (candidate: FormData) => {
    const response = await api.post('/candidates', candidate, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Actualizar un candidato existente
   */
  update: async (id: number, candidate: FormData) => {
    const response = await api.put(`/candidates/${id}`, candidate, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Eliminar un candidato
   */
  delete: async (id: number) => {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  }
};

export default api; 