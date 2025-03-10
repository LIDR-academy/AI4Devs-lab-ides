import axios from 'axios';
import { AuthResponse, LoginRequest, RegisterRequest, RefreshTokenRequest, RequestResetRequest, ResetPasswordRequest } from '../types/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010/api';

// Cliente Axios para autenticación
const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir token de autenticación
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicio de autenticación
export const authService = {
  /**
   * Registrar un nuevo usuario
   */
  register: async (email: string, password: string, name?: string): Promise<AuthResponse> => {
    try {
      const response = await authApi.post<AuthResponse>('/register', { email, password, name });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Error de conexión'
      };
    }
  },

  /**
   * Iniciar sesión
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await authApi.post<AuthResponse>('/login', { email, password });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Error de conexión'
      };
    }
  },

  /**
   * Renovar token de acceso
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    try {
      const response = await authApi.post<AuthResponse>('/refresh-token', { refreshToken });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Error al renovar el token'
      };
    }
  },

  /**
   * Cerrar sesión
   */
  logout: async (): Promise<AuthResponse> => {
    try {
      const response = await authApi.post<AuthResponse>('/logout');
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Error al cerrar sesión'
      };
    }
  },

  /**
   * Solicitar restablecimiento de contraseña
   */
  requestPasswordReset: async (email: string): Promise<AuthResponse> => {
    try {
      const response = await authApi.post<AuthResponse>('/request-reset', { email });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Error al solicitar el restablecimiento de contraseña'
      };
    }
  },

  /**
   * Restablecer contraseña
   */
  resetPassword: async (token: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await authApi.post<AuthResponse>('/reset-password', { token, password });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Error al restablecer la contraseña'
      };
    }
  },

  /**
   * Verificar correo electrónico
   */
  verifyEmail: async (token: string): Promise<AuthResponse> => {
    try {
      const response = await authApi.get<AuthResponse>(`/verify-email/${token}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Error al verificar el correo electrónico'
      };
    }
  }
}; 