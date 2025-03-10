import axios from 'axios';
import { Candidate } from '../types/candidate';

// Usar la URL completa del backend
const API_URL = 'http://localhost:3010/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Añadir configuración para permitir credenciales
  withCredentials: false
});

export const candidateService = {
  // Obtener todos los candidatos
  getAllCandidates: async (): Promise<Candidate[]> => {
    try {
      const response = await api.get('/candidates');
      return response.data.data || [];
    } catch (error) {
      console.error('Error al obtener candidatos:', error);
      throw error;
    }
  },

  // Obtener un candidato por ID
  getCandidateById: async (id: number): Promise<Candidate> => {
    try {
      const response = await api.get(`/candidates/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error al obtener candidato con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo candidato
  createCandidate: async (candidateData: FormData): Promise<Candidate> => {
    try {
      // Usar la instancia de api configurada, pero con headers específicos para FormData
      const response = await api.post('/candidates', candidateData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error al crear candidato:', error);
      throw error;
    }
  },

  // Actualizar un candidato existente
  updateCandidate: async (id: number, candidateData: FormData): Promise<Candidate> => {
    try {
      // Usar la instancia de api configurada, pero con headers específicos para FormData
      const response = await api.put(`/candidates/${id}`, candidateData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error al actualizar candidato con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un candidato
  deleteCandidate: async (id: number): Promise<void> => {
    try {
      await api.delete(`/candidates/${id}`);
    } catch (error) {
      console.error(`Error al eliminar candidato con ID ${id}:`, error);
      throw error;
    }
  },
};

export default api;
