import { comparePassword, generateToken, verifyToken } from '../utils/authUtils';
import { LoginRequest, ServiceResponse, LoginResponse, UserWithoutPassword, TokenPayload } from '../types';
import prisma from '../utils/prismaClient';
import { AppError } from '../utils/AppError';
import { ERROR_CODES, LOG_ACTIONS } from '../utils/constants';

/**
 * Servicio de autenticación
 */
export class AuthService {
  /**
   * Inicia sesión de un usuario
   * @param loginData Datos de inicio de sesión
   * @returns Respuesta del servicio con los datos del usuario y el token
   */
  async login(loginData: LoginRequest): Promise<ServiceResponse<LoginResponse>> {
    try {
      // Buscar usuario por email
      const user = await prisma.user.findUnique({
        where: { email: loginData.email },
      });

      // Si no existe el usuario o está inactivo
      if (!user || !user.isActive) {
        throw AppError.unauthorized('Credenciales inválidas', ERROR_CODES.INVALID_CREDENTIALS);
      }

      // Verificar contraseña
      const isPasswordValid = await comparePassword(
        loginData.password,
        user.passwordHash
      );

      if (!isPasswordValid) {
        // Registrar intento fallido de inicio de sesión (podría implementarse un sistema de bloqueo)
        throw AppError.unauthorized('Credenciales inválidas', ERROR_CODES.INVALID_CREDENTIALS);
      }

      try {
        // Actualizar último inicio de sesión
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        // Registrar acceso exitoso en el log
        await prisma.dataAccessLog.create({
          data: {
            action: LOG_ACTIONS.LOGIN,
            description: 'Inicio de sesión exitoso',
            userId: user.id,
          },
        });
      } catch (updateError) {
        // Si hay un error al actualizar el último inicio de sesión o al registrar el acceso,
        // continuamos con el proceso de inicio de sesión pero registramos el error
        console.error('Error al actualizar datos de inicio de sesión:', updateError);
      }

      // Generar token JWT
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Eliminar la contraseña del objeto de usuario antes de devolverlo
      const { passwordHash, ...userWithoutPassword } = user;

      return {
        success: true,
        data: {
          user: userWithoutPassword as UserWithoutPassword,
          token,
        },
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof AppError) {
        return {
          success: false,
          error: error.message,
          statusCode: error.statusCode,
        };
      }
      
      console.error('Error en el servicio de autenticación:', error);
      return {
        success: false,
        error: 'Error interno del servidor',
        statusCode: 500,
      };
    }
  }

  /**
   * Verifica si un usuario existe y está activo
   * @param userId ID del usuario
   * @returns Respuesta del servicio indicando si el usuario existe y está activo
   */
  async verifyUserActive(userId: number): Promise<ServiceResponse<boolean>> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw AppError.notFound('Usuario no encontrado', ERROR_CODES.USER_NOT_FOUND);
      }

      if (!user.isActive) {
        throw AppError.forbidden('Usuario inactivo', ERROR_CODES.USER_INACTIVE);
      }

      return {
        success: true,
        data: true,
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof AppError) {
        return {
          success: false,
          error: error.message,
          statusCode: error.statusCode,
        };
      }
      
      console.error('Error al verificar usuario:', error);
      return {
        success: false,
        error: 'Error interno del servidor',
        statusCode: 500,
      };
    }
  }

  /**
   * Refresca el token JWT
   * @param token Token JWT actual
   * @returns Respuesta del servicio con el nuevo token y los datos del usuario
   */
  async refreshToken(token: string): Promise<ServiceResponse<LoginResponse>> {
    try {
      // Verificar token actual
      const decoded = verifyToken(token);

      if (!decoded) {
        throw AppError.unauthorized('Token inválido o expirado', ERROR_CODES.INVALID_TOKEN);
      }

      // Verificar si el usuario existe y está activo
      const userActiveResult = await this.verifyUserActive(decoded.id);
      if (!userActiveResult.success) {
        throw new AppError(
          userActiveResult.error || 'Error al verificar usuario',
          userActiveResult.statusCode,
          ERROR_CODES.USER_INACTIVE
        );
      }

      // Obtener información actualizada del usuario
      const user = await this.getUserById(decoded.id);
      if (!user.success) {
        throw new AppError(
          user.error || 'Error al obtener usuario',
          user.statusCode,
          ERROR_CODES.USER_NOT_FOUND
        );
      }

      // Generar nuevo token
      const newToken = generateToken({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      });

      return {
        success: true,
        data: {
          user: user.data as UserWithoutPassword,
          token: newToken,
        },
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof AppError) {
        return {
          success: false,
          error: error.message,
          statusCode: error.statusCode,
        };
      }
      
      console.error('Error al refrescar token:', error);
      return {
        success: false,
        error: 'Error interno del servidor',
        statusCode: 500,
      };
    }
  }

  /**
   * Obtiene la información de un usuario por su ID
   * @param userId ID del usuario
   * @returns Respuesta del servicio con los datos del usuario
   */
  async getUserById(userId: number): Promise<ServiceResponse<UserWithoutPassword>> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw AppError.notFound('Usuario no encontrado', ERROR_CODES.USER_NOT_FOUND);
      }

      // Eliminar la contraseña del objeto de usuario antes de devolverlo
      const { passwordHash, ...userWithoutPassword } = user;

      return {
        success: true,
        data: userWithoutPassword as UserWithoutPassword,
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof AppError) {
        return {
          success: false,
          error: error.message,
          statusCode: error.statusCode,
        };
      }
      
      console.error('Error al obtener usuario:', error);
      return {
        success: false,
        error: 'Error interno del servidor',
        statusCode: 500,
      };
    }
  }
}