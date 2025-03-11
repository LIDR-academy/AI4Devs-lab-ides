import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, setAuthToken } from '../services/authService';
import { AuthContextType, AuthState, LoginRequest, User } from '../types';

// Valor inicial del contexto
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Verificar si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Verificando autenticación...');
        // Verificar la autenticación con el backend usando la cookie JWT
        const response = await authService.verifyAuth();
        console.log('Respuesta de verificación:', response);
        
        if (response.success && response.data) {
          console.log('Usuario autenticado:', response.data.user);
          // Si hay un token en la respuesta, establecerlo
          if (response.data.token) {
            setAuthToken(response.data.token);
          }
          
          setState({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          console.log('Verificación fallida, intentando refrescar token...');
          // Si la verificación falla, intentar refrescar el token
          const refreshResponse = await authService.refreshToken();
          console.log('Respuesta de refresh:', refreshResponse);
          
          if (refreshResponse.success && refreshResponse.data) {
            console.log('Token refrescado correctamente');
            // Si hay un token en la respuesta, establecerlo
            if (refreshResponse.data.token) {
              setAuthToken(refreshResponse.data.token);
            }
            
            setState({
              user: refreshResponse.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            console.log('Refresh fallido, limpiando estado');
            // Si el refresh falla, limpiar el estado y el token
            setAuthToken(null);
            setState({
              ...initialState,
              isLoading: false,
            });
            
            // No redirigir aquí, dejar que ProtectedRoute maneje la redirección si es necesario
          }
        }
      } catch (error) {
        console.error('Error en checkAuth:', error);
        // En caso de error, limpiar el token
        setAuthToken(null);
        setState({
          ...initialState,
          isLoading: false,
          error: 'Error al verificar la autenticación',
        });
        
        // No redirigir aquí, dejar que ProtectedRoute maneje la redirección si es necesario
      }
    };

    checkAuth();
  }, []);

  // Función para iniciar sesión
  const login = async (credentials: LoginRequest): Promise<boolean> => {
    setState({
      ...state,
      isLoading: true,
      error: null,
    });

    try {
      console.log('Iniciando sesión con:', credentials);
      const response = await authService.login(credentials);
      console.log('Respuesta de login:', response);

      if (response.success && response.data) {
        console.log('Login exitoso, usuario:', response.data.user);
        
        // Si hay un token en la respuesta, establecerlo
        if (response.data.token) {
          setAuthToken(response.data.token);
        }
        
        setState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        console.log('Login fallido:', response.error);
        // En caso de error, limpiar el token
        setAuthToken(null);
        setState({
          ...state,
          isLoading: false,
          error: response.error || 'Error al iniciar sesión',
        });
        return false;
      }
    } catch (error) {
      console.error('Error en login:', error);
      // En caso de error, limpiar el token
      setAuthToken(null);
      setState({
        ...state,
        isLoading: false,
        error: 'Error al iniciar sesión',
      });
      return false;
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    setState({
      ...state,
      isLoading: true,
    });

    try {
      await authService.logout();
      // Limpiar el token al cerrar sesión
      setAuthToken(null);
      
      // Establecer una bandera para indicar que venimos de un logout
      sessionStorage.setItem('from_logout', 'true');
      
      // Limpiar cualquier mensaje de redirección para evitar que aparezca después del logout
      sessionStorage.removeItem('auth_redirect_message');
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error en logout:', error);
      // Limpiar el token incluso si hay error
      setAuthToken(null);
      
      // Establecer una bandera para indicar que venimos de un logout
      sessionStorage.setItem('from_logout', 'true');
      
      // Limpiar cualquier mensaje de redirección para evitar que aparezca después del logout
      sessionStorage.removeItem('auth_redirect_message');
      
      setState({
        ...state,
        isLoading: false,
        error: 'Error al cerrar sesión',
      });
    }
  };

  // Función para refrescar el token
  const refreshToken = async (): Promise<boolean> => {
    try {
      console.log('Refrescando token...');
      const response = await authService.refreshToken();
      console.log('Respuesta de refresh token:', response);
      
      if (response.success && response.data) {
        console.log('Token refrescado correctamente');
        // Si hay un token en la respuesta, establecerlo
        if (response.data.token) {
          setAuthToken(response.data.token);
        }
        
        setState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      }
      
      console.log('Refresh fallido');
      // Si el refresh falla, limpiar el token
      setAuthToken(null);
      
      // Actualizar el estado para reflejar que el usuario no está autenticado
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Sesión caducada',
      });
      
      // No redirigir aquí, dejar que el interceptor de axios maneje la redirección si es necesario
      
      return false;
    } catch (error) {
      console.error('Error en refreshToken:', error);
      // En caso de error, limpiar el token
      setAuthToken(null);
      
      // Actualizar el estado para reflejar que el usuario no está autenticado
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Error al refrescar la sesión',
      });
      
      // No redirigir aquí, dejar que el interceptor de axios maneje la redirección si es necesario
      
      return false;
    }
  };

  const value = {
    ...state,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 