import { ApiResponse } from '../types';

const API_URL = 'http://localhost:3010';

interface LoginResponse {
  user: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
  };
  accessToken: string;
}

// Función para manejar errores de la API
const handleApiError = (error: any): ApiResponse<any> => {
  console.error('API Error Details:', error);
  return {
    success: false,
    error: error.message || 'Error en la comunicación con el servidor'
  };
};

// Función para iniciar sesión
export const login = async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
  try {
    console.log(`Intentando iniciar sesión con email: ${email}`);
    console.log(`API URL: ${API_URL}/api/auth/login`);
    
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // Para manejar cookies
    });

    console.log('Respuesta recibida:', response.status, response.statusText);
    
    // Intentamos obtener el cuerpo de la respuesta
    let data;
    try {
      data = await response.json();
      console.log('Datos de respuesta:', data);
    } catch (parseError) {
      console.error('Error al parsear la respuesta JSON:', parseError);
      return {
        success: false,
        error: 'Error al procesar la respuesta del servidor'
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Error al iniciar sesión'
      };
    }

    // Guardar el token y datos de usuario aquí para asegurar que se guardan
    if (data.success && data.data?.accessToken) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.data.user || {}));
      console.log('Token y datos de usuario guardados en localStorage');
    }

    return data;
  } catch (error) {
    console.error('Error detallado:', error);
    return handleApiError(error);
  }
};

// Función para cerrar sesión
export const logout = async (): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Para manejar cookies
    });

    const data = await response.json();

    // Limpiar localStorage al cerrar sesión
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Error al cerrar sesión'
      };
    }

    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Función para obtener el token de acceso actual
export const getAccessToken = (): string => {
  return localStorage.getItem('accessToken') || '';
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

// Función para obtener el usuario actual
export const getCurrentUser = (): any => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  }
  return null;
}; 