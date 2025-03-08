import { Candidate, ApiResponse } from '../types';
import { getAccessToken } from './authService';

const API_URL = 'http://localhost:3010';

// Función para manejar errores de la API
const handleApiError = (error: any): ApiResponse<any> => {
  console.error('API Error Details:', error);
  
  // Revisar si es un error de red
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    console.error('Error de red - Posible problema de conexión con el servidor:', API_URL);
    return {
      success: false,
      error: 'No se puede conectar con el servidor. Por favor, verifica tu conexión a internet y que el servidor esté en funcionamiento.'
    };
  }
  
  return {
    success: false,
    error: error.message || 'Error en la comunicación con el servidor'
  };
};

// Función para añadir un nuevo candidato
export const addCandidate = async (candidate: Candidate, cvFile?: File): Promise<ApiResponse<Candidate>> => {
  try {
    // Obtener el token de acceso
    const token = getAccessToken();
    
    // Creamos un FormData para enviar los datos, incluyendo el archivo
    const formData = new FormData();
    
    // Agregamos los datos del candidato
    Object.entries(candidate).forEach(([key, value]) => {
      // Para arrays y objetos, convertimos a JSON string
      if (value !== null && value !== undefined) {
        if (Array.isArray(value) || typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    
    // Agregamos el archivo CV si existe
    if (cvFile) {
      formData.append('cv', cvFile);
    }

    const response = await fetch(`${API_URL}/api/candidates`, {
      method: 'POST',
      // No enviamos Content-Type aquí, fetch lo establecerá automáticamente con el boundary correcto para el formData
      headers: {
        'Authorization': `Bearer ${token}`
      },
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

// Función para obtener todas las etiquetas
export const getTags = async (): Promise<ApiResponse<{ id: number; name: string }[]>> => {
  try {
    // Obtener el token de acceso
    const token = getAccessToken();
    
    const response = await fetch(`${API_URL}/api/tags`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      // Para propósitos de desarrollo, si no existe el endpoint, simulamos la respuesta
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
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Usando datos mock para tags');
    // Si hay un error, devolvemos datos mock
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
  }
};

// Función para obtener categorías de habilidades
export const getSkillCategories = async (): Promise<ApiResponse<string[]>> => {
  try {
    // Obtener el token de acceso
    const token = getAccessToken();
    
    const response = await fetch(`${API_URL}/api/skills/categories`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      // Para propósitos de desarrollo, si no existe el endpoint, simulamos la respuesta
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
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Usando datos mock para categorías de habilidades');
    // Si hay un error, devolvemos datos mock
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
  }
};

// Función para obtener todos los candidatos
export const getCandidates = async (): Promise<ApiResponse<Candidate[]>> => {
  try {
    // Obtener el token de acceso
    const token = getAccessToken();
    
    const response = await fetch(`${API_URL}/api/candidates`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Error al obtener los candidatos'
      };
    }
    
    return data;
  } catch (error) {
    // Para desarrollo, si falla la conexión con el API, devolvemos datos simulados
    console.warn('Usando datos mock para candidatos');
    return {
      success: true,
      data: [
        {
          id: 1,
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          phone: '612345678',
          createdAt: new Date().toISOString(),
          tags: [{ id: 1, name: 'Frontend' }, { id: 2, name: 'React' }],
          skills: [],
          educations: [],
          experiences: [],
          status: 'Nuevo'
        },
        {
          id: 2,
          firstName: 'María',
          lastName: 'García',
          email: 'maria.garcia@example.com',
          phone: '623456789',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          tags: [{ id: 3, name: 'Backend' }, { id: 4, name: 'Node.js' }],
          skills: [],
          educations: [],
          experiences: [],
          status: 'Entrevistado'
        },
        {
          id: 3,
          firstName: 'Carlos',
          lastName: 'Rodríguez',
          email: 'carlos.rodriguez@example.com',
          phone: '634567890',
          createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          tags: [{ id: 5, name: 'FullStack' }, { id: 2, name: 'React' }, { id: 4, name: 'Node.js' }],
          skills: [],
          educations: [],
          experiences: [],
          status: 'En proceso'
        }
      ]
    };
  }
}; 