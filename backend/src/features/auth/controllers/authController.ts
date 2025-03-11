import { Request, Response } from 'express';
import { body } from 'express-validator';
import { AuthService } from '../services/authService';
import { AuthRequest } from '../types';
import { config } from '../../../config/config';
import { AppError } from '../../../utils/AppError';
import { loginSchema } from '../../../schemas/userSchema';
import { validateBody } from '../../../middlewares/zodValidationMiddleware';

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Operaciones relacionadas con la autenticación de usuarios
 */

/**
 * Controlador para manejar las operaciones de autenticación
 */
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Validadores para el endpoint de login
   */
  static loginValidators = [
    body('email')
      .isEmail()
      .withMessage('Debe proporcionar un email válido')
      .normalizeEmail(),
    body('password')
      .isString()
      .withMessage('La contraseña debe ser una cadena de texto')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
  ];

  /**
   * Validador Zod para el endpoint de login
   */
  static validateLogin = validateBody(loginSchema);

  /**
   * Maneja la solicitud de inicio de sesión
   * @param req Request de Express
   * @param res Response de Express
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Llamar al servicio de autenticación para iniciar sesión
      const result = await this.authService.login({ email, password });

      if (!result.success) {
        return res.status(result.statusCode).json({
          success: false,
          error: result.error,
        });
      }

      // Establecer la cookie de autenticación
      res.cookie(config.jwt.cookieName, result.data?.token, {
        httpOnly: true,
        secure: config.server.env === 'production',
        sameSite: 'strict',
        maxAge: config.jwt.cookieMaxAge, // Usar el valor ya configurado en milisegundos
      });

      // Devolver la respuesta con el token (para clientes que no pueden usar cookies)
      return res.status(200).json({
        success: true,
        data: {
          user: result.data?.user,
          token: result.data?.token, // Incluir el token en la respuesta JSON
        },
      });
    } catch (error) {
      console.error('Error en login:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
          code: error.errorCode,
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  /**
   * Maneja la solicitud de cierre de sesión
   * @param req Request de Express
   * @param res Response de Express
   */
  async logout(req: Request, res: Response) {
    try {
      // Eliminar la cookie de autenticación
      res.clearCookie(config.jwt.cookieName);

      return res.status(200).json({
        success: true,
        message: 'Sesión cerrada correctamente',
      });
    } catch (error) {
      console.error('Error en logout:', error);
      
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  /**
   * Maneja la solicitud de actualización del token
   * @param req Request de Express
   * @param res Response de Express
   */
  async refreshToken(req: Request, res: Response) {
    try {
      // Obtener el token de la cookie o del header de autorización
      let token = req.cookies[config.jwt.cookieName];
      
      // Si no hay token en la cookie, intentar obtenerlo del header de autorización
      if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No se proporcionó token de autenticación',
          code: 'UNAUTHORIZED',
        });
      }

      // Llamar al servicio de autenticación para refrescar el token
      const result = await this.authService.refreshToken(token);

      if (!result.success) {
        return res.status(result.statusCode).json({
          success: false,
          error: result.error,
          code: 'UNAUTHORIZED',
        });
      }

      // Establecer la nueva cookie de autenticación
      res.cookie(config.jwt.cookieName, result.data?.token, {
        httpOnly: true,
        secure: config.server.env === 'production',
        sameSite: 'strict',
        maxAge: config.jwt.cookieMaxAge, // Usar el valor ya configurado en milisegundos
      });

      // Devolver la respuesta con el token (para clientes que no pueden usar cookies)
      return res.status(200).json({
        success: true,
        data: {
          user: result.data?.user,
          token: result.data?.token, // Incluir el token en la respuesta JSON
        },
      });
    } catch (error) {
      console.error('Error en refreshToken:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
          code: error.errorCode,
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  /**
   * Verifica si el usuario está autenticado y devuelve sus datos
   * @param req Request de Express
   * @param res Response de Express
   */
  async verifyAuth(req: AuthRequest, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          error: 'No autenticado',
          code: 'UNAUTHORIZED',
        });
      }

      // Obtener los datos del usuario
      const result = await this.authService.getUserById(req.user.id);

      if (!result.success) {
        return res.status(result.statusCode).json({
          success: false,
          error: result.error,
          code: result.statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR',
        });
      }

      // Generar un nuevo token para el usuario
      const token = req.headers.authorization?.split(' ')[1];

      return res.status(200).json({
        success: true,
        data: {
          user: result.data,
          token: token, // Incluir el token actual en la respuesta
        },
      });
    } catch (error) {
      console.error('Error en verifyAuth:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
          code: error.errorCode,
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
      });
    }
  }
} 