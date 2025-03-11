import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

// Extender la interfaz Request para incluir el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware para autenticar usuarios
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Verificando autenticación para:', req.method, req.originalUrl);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    
    // Obtener el token del encabezado de autorización
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No se proporcionó un token de autenticación válido');
      throw AppError.unauthorized('No se proporcionó un token de autenticación', 'NO_TOKEN_PROVIDED');
    }

    const token = authHeader.split(' ')[1];
    console.log('Token encontrado, verificando...');
    
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as {
      id: number;
      email: string;
      role: string;
    };
    
    console.log('Token verificado correctamente para el usuario:', decoded.email);
    
    // Añadir el usuario a la solicitud
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      next(AppError.unauthorized('Token inválido', 'INVALID_TOKEN'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(AppError.unauthorized('Token expirado', 'TOKEN_EXPIRED'));
    } else {
      next(error);
    }
  }
};

/**
 * Middleware para autorizar roles específicos
 * @param roles Roles permitidos
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(AppError.unauthorized('Usuario no autenticado', 'USER_NOT_AUTHENTICATED'));
    }

    if (!roles.includes(req.user.role)) {
      return next(AppError.forbidden('No tiene permisos para acceder a este recurso', 'INSUFFICIENT_PERMISSIONS'));
    }

    next();
  };
}; 