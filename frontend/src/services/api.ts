import axios from 'axios';
import { Candidato, ApiResponse } from '../types/candidato';

const API_URL = 'http://localhost:3010/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const candidatoService = {
  // Obtener todos los candidatos
  getCandidatos: async (): Promise<ApiResponse<Candidato[]>> => {
    try {
      const response = await api.get('/candidatos');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<Candidato[]>;
      }
      throw error;
    }
  },

  // Obtener un candidato por ID
  getCandidatoById: async (id: string): Promise<ApiResponse<Candidato>> => {
    try {
      const response = await api.get(`/candidatos/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<Candidato>;
      }
      throw error;
    }
  },

  // Crear un nuevo candidato
  createCandidato: async (candidato: FormData): Promise<ApiResponse<Candidato>> => {
    try {
      const response = await api.post('/candidatos', candidato, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<Candidato>;
      }
      throw error;
    }
  },

  // Actualizar un candidato existente
  updateCandidato: async (id: string, candidato: FormData): Promise<ApiResponse<Candidato>> => {
    try {
      const response = await api.put(`/candidatos/${id}`, candidato, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<Candidato>;
      }
      throw error;
    }
  },

  // Eliminar un candidato
  deleteCandidato: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await api.delete(`/candidatos/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<null>;
      }
      throw error;
    }
  },

  // Obtener datos para autocompletado
  getAutocompleteSuggestions: async (field: string, query: string): Promise<string[]> => {
    // Esta función simula obtener sugerencias para autocompletado.
    // En un caso real, obtendríamos estos datos del backend.
    
    // Datos de ejemplo para educación
    const educacionSuggestions = [
      'Licenciatura en Informática',
      'Ingeniería de Software',
      'Maestría en Ciencias de la Computación',
      'Doctorado en Inteligencia Artificial',
      'Técnico en Desarrollo Web',
      'Licenciatura en Administración de Empresas',
      'Ingeniería Industrial'
    ];
    
    // Datos de ejemplo para experiencia laboral
    const experienciaSuggestions = [
      'Desarrollador Frontend',
      'Desarrollador Backend',
      'Ingeniero DevOps',
      'Científico de Datos',
      'Especialista en UX/UI',
      'Project Manager',
      'QA Engineer',
      'Full Stack Developer'
    ];
    
    // Determinar qué sugerencias devolver según el campo
    let suggestions: string[] = [];
    
    if (field === 'educacion') {
      suggestions = educacionSuggestions;
    } else if (field === 'experiencia_laboral') {
      suggestions = experienciaSuggestions;
    }
    
    // Filtrar sugerencias basadas en la consulta
    return suggestions.filter(item => 
      item.toLowerCase().includes(query.toLowerCase())
    );
  }
};

export default api; 