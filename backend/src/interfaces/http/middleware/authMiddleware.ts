import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '../../../domain/models/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

// Extender la interfaz Request para incluir el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: Role;
        permissions: string[];
      };
    }
  }
}

interface JwtPayload {
  userId: number;
}

/**
 * Middleware para verificar el token JWT
 */
export const authenticate = (
  userRepository: IUserRepository,
  jwtSecret: string
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extraer el token del header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No se proporcionó un token de autenticación'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar el token
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    
    // Buscar el usuario
    const user = await userRepository.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado o inactivo'
      });
    }

    // Añadir información del usuario a la request
    req.user = {
      id: user.id!,
      role: user.role,
      permissions: user.permissions.map(p => p.name)
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    
    next(error);
  }
};

/**
 * Middleware para verificar el rol del usuario
 */
export const authorize = (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado'
    });
  }

  // Si el usuario es ADMIN, permitir acceso a todo
  if (req.user.role === Role.ADMIN) {
    return next();
  }

  // Verificar si el rol del usuario está en la lista de roles permitidos
  if (roles.includes(req.user.role)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'No tiene permisos para acceder a este recurso'
  });
};

/**
 * Middleware para verificar permisos específicos
 */
export const hasPermission = (permissionName: string) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado'
    });
  }

  // Si el usuario es ADMIN, permitir acceso a todo
  if (req.user.role === Role.ADMIN) {
    return next();
  }

  // Verificar si el usuario tiene el permiso específico
  if (req.user.permissions.includes(permissionName)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'No tiene permisos para realizar esta acción'
  });
}; 