import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import { useAuth } from '..';
import Alert from '../../../components/ui/Alert';
import Spinner from '../../../components/ui/Spinner';
import { useNavigate, useLocation } from 'react-router-dom';

// Esquema de validación con Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es obligatorio')
    .email('Ingrese un correo electrónico válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(error);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Verificar si hay un mensaje de redirección en sessionStorage
  useEffect(() => {
    const redirectMessage = sessionStorage.getItem('auth_redirect_message');
    const fromLogout = sessionStorage.getItem('from_logout');
    
    // Solo mostrar el mensaje si no viene de un logout
    if (redirectMessage && !fromLogout) {
      setSessionExpiredMessage(redirectMessage);
    }
    
    // Limpiar los mensajes después de procesarlos
    sessionStorage.removeItem('auth_redirect_message');
    sessionStorage.removeItem('from_logout');
  }, []);

  const onSubmit = async (data: LoginFormValues) => {
    setLoginError(null);
    setSessionExpiredMessage(null);
    const success = await login(data);
    if (success) {
      // Verificar si hay una ruta guardada para redirigir
      const redirectPath = sessionStorage.getItem('auth_redirect_path');
      
      // Verificar si hay una ruta en el estado de la ubicación
      const fromLocation = location.state?.from?.pathname;
      
      // Determinar la ruta de redirección
      const targetPath = redirectPath || fromLocation || '/dashboard';
      
      // Limpiar la ruta guardada
      sessionStorage.removeItem('auth_redirect_path');
      
      // Redirigir al usuario
      navigate(targetPath, { replace: true });
    } else {
      setLoginError('Credenciales inválidas. Por favor, inténtelo de nuevo.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {loginError && (
          <Alert
            type="error"
            message={loginError}
            onClose={() => setLoginError(null)}
          />
        )}

        {sessionExpiredMessage && (
          <Alert
            type="warning"
            message={sessionExpiredMessage}
            onClose={() => setSessionExpiredMessage(null)}
          />
        )}

        <div>
          <label htmlFor="email" className="form-label">
            Correo electrónico
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`input-field pl-10 ${
                errors.email ? 'ring-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="nombre@ejemplo.com"
              {...register('email')}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={`input-field pl-10 pr-10 ${
                errors.password ? 'ring-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="••••••••"
              {...register('password')}
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="btn-primary w-full flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm; 