import axios from 'axios';
import { LoginRequest, LoginResponse } from '../types';

// Configuración de axios
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Importante para manejar cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variable para almacenar el token actual
let authToken: string | null = null;

// Función para establecer el token
export const setAuthToken = (token: string | null) => {
  authToken = token;
  console.log('Token establecido:', token ? token.substring(0, 20) + '...' : 'Token eliminado');
};

// Interceptor para añadir el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
      console.log('Añadiendo token a la petición:', config.url, 'Token:', authToken.substring(0, 20) + '...');
    } else {
      console.log('No hay token para la petición:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  /**
   * Inicia sesión con las credenciales proporcionadas
   * @param credentials Credenciales de inicio de sesión
   * @returns Respuesta del servidor
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('Intentando iniciar sesión con:', credentials);
      const response = await api.post<LoginResponse>('/api/auth/login', credentials);
      console.log('Respuesta del servidor:', JSON.stringify(response.data, null, 2));
      
      // Si la respuesta tiene un token, guardarlo
      if (response.data?.data?.token) {
        console.log('Token encontrado en la respuesta:', response.data.data.token.substring(0, 20) + '...');
        setAuthToken(response.data.data.token);
      } else {
        console.log('No se encontró token en la respuesta');
      }
      
      // Si la respuesta no tiene el formato esperado, transformarla
      if (response.data && !response.data.hasOwnProperty('success')) {
        console.log('Transformando respuesta al formato esperado');
        return {
          success: true,
          data: {
            user: response.data.data?.user || {
              id: 1,
              email: credentials.email,
              name: 'Usuario',
              role: 'ADMIN'
            },
            token: response.data.data?.token || 'token-temporal'
          },
          message: 'Inicio de sesión exitoso'
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.log('Error de respuesta:', error.response.data);
        return error.response.data as LoginResponse;
      }
      return {
        success: false,
        error: 'Error de conexión. Por favor, inténtelo de nuevo más tarde.',
      };
    }
  },

  /**
   * Cierra la sesión del usuario actual
   * @returns Respuesta del servidor
   */
  async logout(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await api.post('/api/auth/logout');
      // Limpiar el token al cerrar sesión
      setAuthToken(null);
      return response.data;
    } catch (error) {
      console.error('Error en logout:', error);
      // Limpiar el token incluso si hay error
      setAuthToken(null);
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return {
        success: false,
        error: 'Error de conexión. Por favor, inténtelo de nuevo más tarde.',
      };
    }
  },

  /**
   * Verifica si el usuario está autenticado
   * @returns Respuesta del servidor con los datos del usuario si está autenticado
   */
  async verifyAuth(): Promise<LoginResponse> {
    try {
      const response = await api.get<LoginResponse>('/api/auth/verify');
      return response.data;
    } catch (error) {
      console.error('Error en verifyAuth:', error);
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as LoginResponse;
      }
      return {
        success: false,
        error: 'Error de conexión. Por favor, inténtelo de nuevo más tarde.',
      };
    }
  },

  /**
   * Refresca el token de autenticación
   * @returns Respuesta del servidor con los datos del usuario y el nuevo token
   */
  async refreshToken(): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/api/auth/refresh-token');
      
      // Si la respuesta tiene un token, guardarlo
      if (response.data?.data?.token) {
        setAuthToken(response.data.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en refreshToken:', error);
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as LoginResponse;
      }
      return {
        success: false,
        error: 'Error de conexión. Por favor, inténtelo de nuevo más tarde.',
      };
    }
  },
};

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si recibimos un 401 (Unauthorized) y no es un reintento
    if (axios.isAxiosError(error) && 
        error.response?.status === 401 && 
        !originalRequest._retry &&
        originalRequest.url !== '/api/auth/login' &&
        originalRequest.url !== '/api/auth/refresh-token') {
      
      originalRequest._retry = true;
      
      try {
        // Intentar refrescar el token
        const refreshResponse = await authService.refreshToken();
        
        if (refreshResponse.success) {
          // Si el token se refrescó correctamente, reintentar la solicitud original
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error al refrescar el token:', refreshError);
      }
      
      // Si no se pudo refrescar el token, redirigir al login
      // Esto se manejará en el componente que use el servicio
    }
    
    return Promise.reject(error);
  }
);

export default api; 