import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth.config';
import prisma from '../../index';
import { auditLogger } from '../../utils/logger';

/**
 * Interface para el payload del token JWT
 */
interface TokenPayload {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Middleware para verificar el token JWT
 */
export const verifyToken = async (req: Request & { userId?: number; userRole?: string }, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No se proporcionó un token de autenticación'
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, authConfig.jwt.secret) as TokenPayload;
    
    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      auditLogger.auth(decoded.email, 'INVALID_TOKEN', false, req.ip, req.headers['user-agent'] as string);
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    // Asignar datos del usuario al request
    req.userId = user.id;
    req.userRole = user.role;

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'El token ha expirado'
      });
    }

    auditLogger.error(error, req);
    return res.status(401).json({
      success: false,
      message: 'No autorizado'
    });
  }
};

/**
 * Middleware para verificar rol de administrador
 */
export const isAdmin = (req: Request & { userRole?: string }, res: Response, next: NextFunction) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Requiere rol de administrador'
    });
  }
  next();
}; 