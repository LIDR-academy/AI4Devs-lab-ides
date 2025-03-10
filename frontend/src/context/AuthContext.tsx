import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '../types/auth';
import { authService } from '../services/auth';
import { toast } from 'react-toastify';

interface AuthContextProps {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Verificar si el usuario está autenticado
  const checkAuth = async (): Promise<boolean> => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken || !refreshToken) {
        setCurrentUser(null);
        setIsAuthenticated(false);
        return false;
      }

      // Verificar si el token ha expirado
      if (isTokenExpired(accessToken)) {
        // Intentar renovar el token
        const refreshResult = await authService.refreshToken(refreshToken);
        
        if (!refreshResult.success) {
          // Si falla, cerrar sesión
          await logout();
          return false;
        }

        // Guardar el nuevo token
        localStorage.setItem('accessToken', refreshResult.data!.accessToken);
      }

      // Obtener información del usuario desde el token
      const user = decodeToken(accessToken);
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setCurrentUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  // Iniciar sesión
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);

      if (response.success && response.data) {
        // Guardar tokens en localStorage
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        // Actualizar estado
        setCurrentUser({
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          role: response.data.role
        });
        setIsAuthenticated(true);
        
        toast.success('Inicio de sesión exitoso');
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error: any) {
      toast.error('Error al iniciar sesión');
      console.error('Error al iniciar sesión:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Registrar usuario
  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.register(email, password, name);

      if (response.success) {
        toast.success('Registro exitoso. Por favor inicia sesión.');
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error: any) {
      toast.error('Error al registrar usuario');
      console.error('Error al registrar usuario:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar sesión
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Llamar al servicio de logout
      if (isAuthenticated) {
        await authService.logout();
      }
      
      // Limpiar localStorage y estado
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setCurrentUser(null);
      setIsAuthenticated(false);
      
      toast.info('Sesión cerrada');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Decodificar token JWT
  const decodeToken = (token: string): User => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const decoded = JSON.parse(jsonPayload);
      return {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      };
    } catch (error) {
      console.error('Error decodificando token:', error);
      throw error;
    }
  };

  // Verificar si el token ha expirado
  const isTokenExpired = (token: string): boolean => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = atob(base64);
      const decoded = JSON.parse(jsonPayload);
      
      // Verificar si el token ha expirado
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch (error) {
      console.error('Error verificando expiración del token:', error);
      return true;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 