import axios from 'axios';
import { Candidato } from '../types/candidato';

const API_URL = 'http://localhost:3010/api';

// Crear una instancia de axios con la URL base y configuración mejorada
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Añadir timeout para evitar esperas infinitas
  timeout: 10000,
  // Permitir credenciales para CORS
  withCredentials: true
});

// Interceptor para manejar errores de manera global
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la solicitud API:', error.message);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Verificar que el backend está funcionando
export const verificarConexion = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    console.log('Conexión con el backend establecida:', response.data);
    return true;
  } catch (error) {
    console.error('Error al conectar con el backend:', error);
    return false;
  }
};

// Servicio para obtener todos los candidatos
export const obtenerCandidatos = async (): Promise<Candidato[]> => {
  try {
    // Primero verificamos la conexión
    await verificarConexion();
    
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
      withCredentials: true
    });

    return response.data;
  } catch (error) {
    console.error(`Error al subir CV para candidato con ID ${id}:`, error);
    throw error;
  }
}; 