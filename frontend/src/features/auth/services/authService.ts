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

// Variable para controlar si ya estamos redirigiendo al login
let isRedirectingToLogin = false;

// Lista de rutas públicas que no requieren autenticación
const publicRoutes = ['/', '/login'];

// Función para verificar si una ruta requiere autenticación
const isProtectedRoute = (path: string): boolean => {
  // Normalizar la ruta
  const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;
  
  // Verificar si la ruta está en la lista de rutas públicas
  return !publicRoutes.some(route => {
    const normalizedRoute = route.endsWith('/') ? route.slice(0, -1) : route;
    return normalizedPath === normalizedRoute || normalizedPath.startsWith(normalizedRoute + '/');
  });
};

// Función para establecer el token
export const setAuthToken = (token: string | null) => {
  authToken = token;
  console.log('Token establecido:', token ? token.substring(0, 20) + '...' : 'Token eliminado');
};

// Función para redirigir al login
export const redirectToLogin = () => {
  // Verificar si la ruta actual requiere autenticación
  const currentPath = window.location.pathname;
  
  if (!isProtectedRoute(currentPath)) {
    console.log('Ruta actual no requiere autenticación, no redirigiendo:', currentPath);
    return;
  }
  
  if (!isRedirectingToLogin) {
    isRedirectingToLogin = true;
    console.log('Redirigiendo al login debido a sesión caducada');
    
    // Limpiar el token
    setAuthToken(null);
    
    // Mostrar mensaje al usuario
    const message = 'Tu sesión ha caducado. Por favor, inicia sesión de nuevo.';
    
    // Guardar el mensaje en sessionStorage para mostrarlo después de la redirección
    sessionStorage.setItem('auth_redirect_message', message);
    
    // Guardar la ruta actual para redirigir después del login
    sessionStorage.setItem('auth_redirect_path', currentPath);
    
    // Redirigir al login
    window.location.href = '/login';
  }
};

// Interceptor para añadir el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    // Añadir el token a todas las peticiones si existe
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
      
      // Resetear la bandera de redirección
      isRedirectingToLogin = false;
      
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
      
      // Establecer una bandera para indicar que venimos de un logout
      sessionStorage.setItem('from_logout', 'true');
      
      // Limpiar cualquier mensaje de redirección para evitar que aparezca después del logout
      sessionStorage.removeItem('auth_redirect_message');
      
      return response.data;
    } catch (error) {
      console.error('Error en logout:', error);
      // Limpiar el token incluso si hay error
      setAuthToken(null);
      
      // Establecer una bandera para indicar que venimos de un logout
      sessionStorage.setItem('from_logout', 'true');
      
      // Limpiar cualquier mensaje de redirección para evitar que aparezca después del logout
      sessionStorage.removeItem('auth_redirect_message');
      
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
    
    // Verificar si la ruta requiere autenticación
    const url = originalRequest.url || '';
    const isProtected = isProtectedRoute(url);
    
    // Si recibimos un 401 (Unauthorized) y no es un reintento y la ruta requiere autenticación
    if (axios.isAxiosError(error) && 
        error.response?.status === 401 && 
        !originalRequest._retry &&
        isProtected &&
        originalRequest.url !== '/api/auth/login' &&
        originalRequest.url !== '/api/auth/refresh-token') {
      
      originalRequest._retry = true;
      
      try {
        // Intentar refrescar el token
        const refreshResponse = await authService.refreshToken();
        
        if (refreshResponse.success && refreshResponse.data?.token) {
          // Si el token se refrescó correctamente, reintentar la solicitud original
          return api(originalRequest);
        } else if (isProtected) {
          // Si no se pudo refrescar el token y la ruta requiere autenticación, redirigir al login
          redirectToLogin();
        }
      } catch (refreshError) {
        console.error('Error al refrescar el token:', refreshError);
        // Si hubo un error al refrescar el token y la ruta requiere autenticación, redirigir al login
        if (isProtected) {
          redirectToLogin();
        }
      }
    }
    
    // Si recibimos un 403 (Forbidden) y la ruta requiere autenticación, también redirigir al login
    if (axios.isAxiosError(error) && 
        error.response?.status === 403 && 
        isProtected) {
      redirectToLogin();
    }
    
    return Promise.reject(error);
  }
);

export default api; 