import axios from 'axios';
import { Candidate, ApiResponse } from '../types';

const API_URL = 'http://localhost:3010/api';

// Configuración de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicio para crear un candidato
export const createCandidate = async (candidate: Candidate, cvFile?: File): Promise<ApiResponse<Candidate>> => {
  try {
    // Si hay un archivo CV, usamos FormData para enviar los datos
    if (cvFile) {
      const formData = new FormData();
      
      // Añadir los datos del candidato al FormData
      Object.entries(candidate).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      // Añadir el archivo CV
      formData.append('cv', cvFile);
      
      const response = await api.post<ApiResponse<Candidate>>('/candidates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } else {
      // Si no hay archivo CV, enviamos los datos como JSON
      const response = await api.post<ApiResponse<Candidate>>('/candidates', candidate);
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<Candidate>;
    }
    return {
      message: 'Error al crear el candidato',
      error: 'Error de conexión con el servidor',
    };
  }
}; 