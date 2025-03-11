import { Response, NextFunction } from 'express';
import { extractTokenFromRequest, verifyToken } from '../utils/authUtils';
import { AuthRequest } from '../types';
import { AppError } from '../../../utils/AppError';
import { ERROR_CODES } from '../../../utils/constants';

/**
 * Middleware para verificar la autenticación del usuario
 * @param req Request de Express
 * @param res Response de Express
 * @param next Función next de Express
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extraer token de la solicitud
    const token = extractTokenFromRequest(req);

    if (!token) {
      throw AppError.unauthorized('No se proporcionó token de autenticación', ERROR_CODES.UNAUTHORIZED);
    }

    // Verificar token
    const decoded = verifyToken(token);

    if (!decoded) {
      throw AppError.unauthorized('Token inválido o expirado', ERROR_CODES.INVALID_TOKEN);
    }

    // Añadir información del usuario al request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
        code: error.errorCode,
      });
    }
    
    console.error('Error en middleware de autenticación:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      code: ERROR_CODES.INTERNAL_ERROR,
    });
  }
};

/**
 * Middleware para verificar el rol del usuario
 * @param roles Roles permitidos
 * @returns Middleware de Express
 */
export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw AppError.unauthorized('No autenticado', ERROR_CODES.UNAUTHORIZED);
      }

      if (!roles.includes(req.user.role)) {
        throw AppError.forbidden('No autorizado para acceder a este recurso', ERROR_CODES.FORBIDDEN);
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
          code: error.errorCode,
        });
      }
      
      console.error('Error en middleware de autorización:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }
  };
}; 