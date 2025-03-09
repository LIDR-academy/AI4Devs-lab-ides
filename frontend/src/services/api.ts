import axios from 'axios';
import { Candidate, CandidateFormData } from '../types/candidate';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010/api';

// Crear una instancia de axios con la configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Habilitar el envío de cookies
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la solicitud API:', error.response || error);
    return Promise.reject(error);
  }
);

export const candidateService = {
  async createCandidate(candidateData: CandidateFormData): Promise<Candidate> {
    try {
      const formData = new FormData();
      
      // Añadir los datos del candidato
      formData.append('firstName', candidateData.firstName);
      formData.append('lastName', candidateData.lastName);
      formData.append('email', candidateData.email);
      formData.append('phone', candidateData.phone);
      formData.append('address', candidateData.address);
      
      // Añadir educación y experiencia como JSON
      formData.append('education', JSON.stringify(candidateData.education));
      formData.append('experience', JSON.stringify(candidateData.experience));
      
      // Añadir el CV si existe
      if (candidateData.cv) {
        formData.append('cv', candidateData.cv);
      }
      
      console.log('Enviando datos al backend:', {
        firstName: candidateData.firstName,
        lastName: candidateData.lastName,
        email: candidateData.email,
        phone: candidateData.phone,
        address: candidateData.address,
        education: candidateData.education,
        experience: candidateData.experience,
        cv: candidateData.cv ? 'Archivo presente' : 'Sin archivo'
      });
      
      const response = await api.post<{ success: boolean; data: Candidate; message: string }>('/candidates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Respuesta del backend:', response.data);
      
      return response.data.data;
    } catch (error) {
      console.error('Error al crear candidato:', error);
      throw error;
    }
  },
  
  async getCandidates(): Promise<Candidate[]> {
    try {
      const response = await api.get<{ success: boolean; data: Candidate[]; count: number }>('/candidates');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener candidatos:', error);
      throw error;
    }
  },
  
  async getCandidate(id: number): Promise<Candidate> {
    try {
      const response = await api.get<{ success: boolean; data: Candidate }>(`/candidates/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener candidato:', error);
      throw error;
    }
  },
};

export default api; 