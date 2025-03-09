import axios, { AxiosRequestConfig } from 'axios';
import { CandidateFormData, ApiResponse, Candidate } from '../types/candidate';

// Base URL for API requests
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Candidate API functions
export const candidateApi = {
  // Create a new candidate
  createCandidate: async (candidateData: CandidateFormData): Promise<ApiResponse<Candidate>> => {
    try {
      // Create FormData object for file upload
      const formData = new FormData();
      
      // Add all candidate data to FormData
      Object.entries(candidateData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'cv' && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      // Set config for multipart/form-data
      const config: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      
      // Make API request
      const response = await api.post<ApiResponse<Candidate>>('/candidatos', formData, config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<Candidate>;
      }
      
      return {
        success: false,
        message: 'Error de conexión con el servidor',
      };
    }
  },
  
  // Get education options (mock data for now)
  getEducationOptions: async (): Promise<string[]> => {
    // In a real app, this would fetch from an API
    return [
      'Educación Secundaria',
      'Técnico Superior',
      'Grado Universitario',
      'Máster',
      'Doctorado',
      'Certificación Profesional',
    ];
  },
  
  // Get experience options (mock data for now)
  getExperienceOptions: async (): Promise<string[]> => {
    // In a real app, this would fetch from an API
    return [
      'Sin experiencia',
      '1-2 años',
      '3-5 años',
      '5-10 años',
      'Más de 10 años',
    ];
  },
};

export default api; 