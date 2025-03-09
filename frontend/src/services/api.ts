import axios from 'axios';
import { Candidato } from '../types/candidato';

const API_URL = 'http://localhost:3010/api';

// Crear una instancia de axios con la URL base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicio para obtener todos los candidatos
export const obtenerCandidatos = async (): Promise<Candidato[]> => {
  try {
    const response = await api.get('/candidatos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener candidatos:', error);
    throw error;
  }
};

// Servicio para obtener un candidato por ID
export const obtenerCandidatoPorId = async (id: number): Promise<Candidato> => {
  try {
    const response = await api.get(`/candidatos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener candidato con ID ${id}:`, error);
    throw error;
  }
};

// Servicio para crear un nuevo candidato
export const crearCandidato = async (candidato: Candidato): Promise<{ message: string; id_candidato: number }> => {
  try {
    const response = await api.post('/candidatos', candidato);
    return response.data;
  } catch (error) {
    console.error('Error al crear candidato:', error);
    throw error;
  }
};

// Servicio para subir el CV de un candidato
export const subirCV = async (id: number, archivo: File): Promise<{ message: string; nombre_archivo: string; ruta_archivo: string }> => {
  try {
    const formData = new FormData();
    formData.append('archivo', archivo);

    const response = await axios.post(`${API_URL}/candidatos/${id}/documentos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error al subir CV para candidato con ID ${id}:`, error);
    throw error;
  }
}; 