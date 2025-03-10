import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../../index';
import authConfig from '../../config/auth.config';
import { auditLogger } from '../../utils/logger';

/**
 * Servicio de autenticación
 */
export const authService = {
  /**
   * Registrar un nuevo usuario
   */
  register: async (email: string, password: string, name?: string) => {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return {
          success: false,
          message: 'El correo electrónico ya está registrado'
        };
      }

      // Generar hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, authConfig.security.saltRounds);
      
      // Generar token de verificación
      const verificationToken = uuidv4();

      // Crear el usuario
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          verificationToken
        }
      });

      // TODO: Enviar correo de verificación

      return {
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      };
    } catch (error: any) {
      auditLogger.error(error);
      throw error;
    }
  },

  /**
   * Iniciar sesión
   */
  login: async (email: string, password: string, ip: string, userAgent?: string) => {
    try {
      // Buscar usuario por email
      const user = await prisma.user.findUnique({
        where: { email }
      });

      // Si el usuario no existe
      if (!user) {
        auditLogger.auth(email, 'LOGIN_FAILED', false, ip, userAgent || '');
        return {
          success: false,
          message: 'Credenciales inválidas'
        };
      }

      // Verificar si la cuenta está bloqueada
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        auditLogger.auth(email, 'ACCOUNT_LOCKED', false, ip, userAgent || '');
        return {
          success: false,
          message: 'Cuenta bloqueada temporalmente. Intente más tarde.',
          lockedUntil: user.lockedUntil
        };
      }

      // Verificar contraseña
      const passwordIsValid = await bcrypt.compare(password, user.password);

      if (!passwordIsValid) {
        // Incrementar contador de intentos fallidos
        const failedAttempts = user.failedLoginAttempts + 1;
        
        // Verificar si debe bloquear la cuenta
        const updateData: any = {
          failedLoginAttempts: failedAttempts
        };

        if (failedAttempts >= authConfig.security.maxFailedAttempts) {
          const lockTime = new Date();
          lockTime.setMinutes(lockTime.getMinutes() + authConfig.security.accountLockTime);
          updateData.lockedUntil = lockTime;
        }

        // Actualizar usuario
        await prisma.user.update({
          where: { id: user.id },
          data: updateData
        });

        auditLogger.auth(email, 'LOGIN_FAILED', false, ip, userAgent || '');
        return {
          success: false,
          message: 'Credenciales inválidas',
          attemptsLeft: authConfig.security.maxFailedAttempts - failedAttempts
        };
      }

      // Generar tokens
      const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        authConfig.jwt.secret,
        { expiresIn: authConfig.jwt.accessTokenExpiration }
      );
      
      const refreshToken = jwt.sign(
        { id: user.id },
        authConfig.jwt.secret,
        { expiresIn: authConfig.jwt.refreshTokenExpiration }
      );

      // Calcular expiración del refresh token
      const refreshExpiry = new Date();
      refreshExpiry.setDate(refreshExpiry.getDate() + 7); // 7 días

      // Actualizar usuario
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
          lastLogin: new Date(),
          refreshToken,
          refreshTokenExpiry: refreshExpiry
        }
      });

      auditLogger.auth(email, 'LOGIN_SUCCESS', true, ip, userAgent || '');
      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          accessToken,
          refreshToken
        }
      };
    } catch (error: any) {
      auditLogger.error(error);
      throw error;
    }
  },

  /**
   * Renovar token de acceso
   */
  refreshToken: async (refreshToken: string) => {
    try {
      // Verificar el token de actualización
      const decoded = jwt.verify(refreshToken, authConfig.jwt.secret) as { id: number };

      // Buscar usuario con el refresh token
      const user = await prisma.user.findFirst({
        where: {
          id: decoded.id,
          refreshToken,
          refreshTokenExpiry: {
            gt: new Date()
          }
        }
      });

      if (!user) {
        return {
          success: false,
          message: 'Token de actualización inválido o expirado'
        };
      }

      // Generar nuevo token de acceso
      const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        authConfig.jwt.secret,
        { expiresIn: authConfig.jwt.accessTokenExpiration }
      );

      return {
        success: true,
        message: 'Token de acceso renovado',
        data: {
          accessToken
        }
      };
    } catch (error: any) {
      auditLogger.error(error);
      return {
        success: false,
        message: 'Error al renovar el token'
      };
    }
  },

  /**
   * Cerrar sesión
   */
  logout: async (userId: number) => {
    try {
      // Invalidar refresh token
      await prisma.user.update({
        where: { id: userId },
        data: {
          refreshToken: null,
          refreshTokenExpiry: null
        }
      });

      return {
        success: true,
        message: 'Sesión cerrada exitosamente'
      };
    } catch (error: any) {
      auditLogger.error(error);
      throw error;
    }
  },

  /**
   * Verificar correo electrónico
   */
  verifyEmail: async (token: string) => {
    try {
      // Buscar usuario con el token de verificación
      const user = await prisma.user.findFirst({
        where: { verificationToken: token }
      });

      if (!user) {
        return {
          success: false,
          message: 'Token de verificación inválido'
        };
      }

      // Marcar email como verificado
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
          verificationToken: null
        }
      });

      return {
        success: true,
        message: 'Correo electrónico verificado exitosamente'
      };
    } catch (error: any) {
      auditLogger.error(error);
      throw error;
    }
  },

  /**
   * Enviar correo de restablecimiento de contraseña
   */
  requestPasswordReset: async (email: string) => {
    try {
      // Buscar usuario por email
      const user = await prisma.user.findUnique({
        where: { email }
      });

      // No indicar si el usuario existe o no (protección contra enumeración)
      if (!user) {
        return {
          success: true,
          message: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña'
        };
      }

      // Generar token de restablecimiento
      const resetToken = uuidv4();
      const resetTokenExpiry = new Date();
      resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 hora de validez

      // Actualizar usuario
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: resetToken,
          resetTokenExpiry: resetTokenExpiry
        }
      });

      // TODO: Enviar correo con instrucciones

      return {
        success: true,
        message: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña'
      };
    } catch (error: any) {
      auditLogger.error(error);
      throw error;
    }
  },

  /**
   * Restablecer contraseña
   */
  resetPassword: async (token: string, newPassword: string) => {
    try {
      // Buscar usuario con el token de restablecimiento
      const user = await prisma.user.findFirst({
        where: {
          resetPasswordToken: token,
          resetTokenExpiry: {
            gt: new Date()
          }
        }
      });

      if (!user) {
        return {
          success: false,
          message: 'Token inválido o expirado'
        };
      }

      // Generar hash de la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, authConfig.security.saltRounds);

      // Actualizar usuario
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetTokenExpiry: null,
          failedLoginAttempts: 0,
          lockedUntil: null
        }
      });

      return {
        success: true,
        message: 'Contraseña restablecida exitosamente'
      };
    } catch (error: any) {
      auditLogger.error(error);
      throw error;
    }
  }
}; 