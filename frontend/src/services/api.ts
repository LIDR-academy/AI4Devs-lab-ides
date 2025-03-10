import axios from 'axios';
import { Candidato, ApiResponse } from '../types/candidato';

const API_URL = 'http://localhost:3010/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Asegurar que siempre tenemos un string válido
const asegurarString = (valor: any): string => {
  if (valor === null || valor === undefined) return '';
  return String(valor);
};

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
    // Esta función simula obtener sugerencias para autocompletado desde el backend.
    // En un caso real, obtendríamos estos datos mediante una petición API.
    
    // Simulamos un pequeño delay para que parezca una petición real
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Datos de ejemplo para nivel educativo
    const educacionSuggestions = [
      // Niveles educativos generales
      'Educación Básica',
      'Educación Media',
      'Educación Media Incompleta',
      'Educación Superior',
      'Educación Superior Incompleta',
      'Técnico Profesional',
      'Técnico Profesional Incompleto',
      'Licenciatura',
      'Licenciatura Incompleta',
      'Magíster',
      'Magíster Incompleto',
      'Doctorado',
      'Doctorado Incompleto',
      'Postdoctorado',
      'Sin estudios formales',
      
      // Títulos específicos (para complementar)
      'Licenciatura en Informática',
      'Ingeniería de Software',
      'Maestría en Ciencias de la Computación',
      'Doctorado en Inteligencia Artificial',
      'Técnico en Desarrollo Web',
      'Licenciatura en Administración de Empresas',
      'Ingeniería Industrial',
      'Ingeniería Civil',
      'Contador Auditor',
      'Arquitectura',
      'Medicina',
      'Enfermería',
      'Psicología',
      'Derecho',
      'Pedagogía'
    ];
    
    // Datos de ejemplo para experiencia laboral
    const experienciaSuggestions = [
      // Años de experiencia
      'Sin experiencia',
      'Menos de 1 año',
      '1-2 años',
      '2-3 años',
      '3-4 años',
      '4-5 años',
      '5-6 años',
      '6+ años',
      '10+ años',
      '15+ años',
      '20+ años',
      
      // Roles específicos (para complementar)
      'Desarrollador Frontend',
      'Desarrollador Backend',
      'Ingeniero DevOps',
      'Científico de Datos',
      'Especialista en UX/UI',
      'Project Manager',
      'QA Engineer',
      'Full Stack Developer',
      'Analista de Sistemas',
      'Arquitecto de Software',
      'Administrador de Base de Datos',
      'Gerente de Tecnología',
      'Director de Informática',
      'Gerente General',
      'CEO',
      'CTO',
      'COO',
      'CFO'
    ];
    
    // Determinar qué sugerencias devolver según el campo
    let suggestions: string[] = [];
    
    if (field === 'educacion') {
      suggestions = educacionSuggestions;
    } else if (field === 'experiencia_laboral') {
      suggestions = experienciaSuggestions;
    }
    
    // Filtrar sugerencias basadas en la consulta y asegurar que son strings
    return suggestions
      .filter(item => 
        asegurarString(item).toLowerCase().includes(asegurarString(query).toLowerCase())
      )
      .map(item => asegurarString(item));
  }
};

export default api; 