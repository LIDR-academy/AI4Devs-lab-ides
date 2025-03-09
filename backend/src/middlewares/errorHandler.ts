import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

// Interfaz para errores personalizados
export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  errors?: Record<string, string[]>;
}

// Middleware para manejar errores
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Registrar el error
  logger.error(`${err.name}: ${err.message}`, {
    error: err,
    requestId: req.headers['x-request-id'],
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // Determinar el código de estado HTTP
  const statusCode = err.statusCode || 500;
  
  // Preparar la respuesta de error
  const errorResponse = {
    success: false,
    message: statusCode === 500 
      ? 'Error interno del servidor' 
      : err.message || 'Ocurrió un error',
    errors: err.errors || undefined,
    // Solo incluir stack trace en desarrollo
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  };

  // Enviar respuesta
  res.status(statusCode).json(errorResponse);
};

// Middleware para manejar errores de validación de Joi
export const joiErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err && err.error && err.error.isJoi) {
    // Extraer detalles de error de Joi
    const errors: Record<string, string[]> = {};
    
    err.error.details.forEach((detail: any) => {
      const key = detail.path.join('.');
      if (!errors[key]) {
        errors[key] = [];
      }
      errors[key].push(detail.message);
    });

    // Crear error personalizado
    const customError: AppError = new Error('Error de validación');
    customError.statusCode = 400;
    customError.errors = errors;
    
    return next(customError);
  }
  
  next(err);
};

// Middleware para manejar rutas no encontradas
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error: AppError = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}; 