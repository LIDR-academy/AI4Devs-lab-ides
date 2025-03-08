import { Candidate, ApiResponse } from '../types';

const API_URL = 'http://localhost:3010';

// Función para manejar errores de la API
const handleApiError = (error: any): ApiResponse<any> => {
  console.error('API Error:', error);
  return {
    success: false,
    error: error.message || 'Error en la comunicación con el servidor'
  };
};

// Función para añadir un nuevo candidato
export const addCandidate = async (candidate: Candidate, cvFile?: File): Promise<ApiResponse<Candidate>> => {
  try {
    // Creamos un FormData para enviar los datos, incluyendo el archivo
    const formData = new FormData();
    
    // Agregamos los datos del candidato
    Object.entries(candidate).forEach(([key, value]) => {
      // Para arrays, asegurarnos de manejarlos correctamente
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          // Si el array está vacío, enviamos un array vacío explícito
          if (value.length === 0) {
            formData.append(key, JSON.stringify([]));
          } else {
            formData.append(key, JSON.stringify(value));
          }
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      } else if (key === 'skills' || key === 'educations' || key === 'experiences' || key === 'tags') {
        // Asegurarnos de que los arrays opcionales se envíen como arrays vacíos si son null/undefined
        formData.append(key, JSON.stringify([]));
      }
    });
    
    // Asegurarnos de que todos los arrays requeridos están presentes
    if (!formData.has('skills')) formData.append('skills', JSON.stringify([]));
    if (!formData.has('educations')) formData.append('educations', JSON.stringify([]));
    if (!formData.has('experiences')) formData.append('experiences', JSON.stringify([]));
    if (!formData.has('tags')) formData.append('tags', JSON.stringify([]));
    
    // Agregamos el archivo CV si existe
    if (cvFile) {
      formData.append('cv', cvFile);
    }

    const response = await fetch(`${API_URL}/api/candidates`, {
      method: 'POST',
      // No enviamos Content-Type aquí, fetch lo establecerá automáticamente con el boundary correcto para el formData
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      // Mejorar el manejo de errores de validación
      if (response.status === 400 && data.errors) {
        // Estructuramos mejor el mensaje de error
        const errorMessages = Array.isArray(data.errors) 
          ? data.errors.map((err: any) => `${err.msg || err.message}${err.param ? ` (${err.param})` : ''}`).join(', ')
          : 'Error de validación en los datos';
          
        return {
          success: false,
          error: errorMessages || data.message || 'Error de validación',
          validationErrors: data.errors
        };
      }
      
      return {
        success: false,
        error: data.message || 'Error al añadir el candidato'
      };
    }

    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Función para obtener las etiquetas disponibles
export const getTags = async (): Promise<ApiResponse<{ id: number; name: string }[]>> => {
  try {
    // Simulación de respuesta
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: [
        { id: 1, name: 'Frontend' },
        { id: 2, name: 'Backend' },
        { id: 3, name: 'FullStack' },
        { id: 4, name: 'DevOps' },
        { id: 5, name: 'UX/UI' },
        { id: 6, name: 'Mobile' },
        { id: 7, name: 'Data Science' },
      ]
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Función para obtener categorías de habilidades
export const getSkillCategories = async (): Promise<ApiResponse<string[]>> => {
  try {
    // Simulación de respuesta
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: [
        'Programación',
        'Bases de Datos',
        'DevOps',
        'Diseño',
        'Gestión de Proyectos',
        'Idiomas',
        'Soft Skills'
      ]
    };
  } catch (error) {
    return handleApiError(error);
  }
}; 