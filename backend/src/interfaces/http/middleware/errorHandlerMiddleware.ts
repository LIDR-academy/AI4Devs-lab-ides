import { Request, Response, NextFunction } from 'express';

/**
 * Interfaz para errores personalizados de la aplicación
 */
export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
}

/**
 * Middleware para manejar errores operacionales (controlados)
 */
export const handleOperationalErrors = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Solo manejamos errores operacionales aquí
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Error operacional',
      code: err.code
    });
  }
  
  // Si no es un error operacional, pasamos al siguiente manejador
  next(err);
};

/**
 * Middleware para manejar errores de programación o desconocidos
 * No revela detalles sensibles en producción
 */
export const handleProgrammerErrors = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log del error para depuración (solo visible en servidor)
  console.error('Error no controlado:', err);
  
  // Enviamos respuesta genérica en producción 
  // En desarrollo podemos incluir más detalles
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Ha ocurrido un error en el servidor' 
      : err.message || 'Error interno del servidor',
    // Solo incluimos el stack trace en desarrollo
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

/**
 * Crear un error operacional controlado
 */
export const createOperationalError = (
  message: string, 
  statusCode: number = 400, 
  code: string = 'BAD_REQUEST'
): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.isOperational = true;
  return error;
};

/**
 * Lista de errores comunes con mensajes generales
 */
export const CommonErrors = {
  EMAIL_EXISTS: createOperationalError(
    'Ya existe un usuario con este email', 
    409, 
    'EMAIL_EXISTS'
  ),
  VALIDATION_ERROR: createOperationalError(
    'Los datos proporcionados no son válidos',
    400,
    'VALIDATION_ERROR'
  ),
  UNAUTHORIZED: createOperationalError(
    'No está autorizado para realizar esta acción',
    401,
    'UNAUTHORIZED'
  ),
  FORBIDDEN: createOperationalError(
    'No tiene permisos para acceder a este recurso',
    403,
    'FORBIDDEN'
  ),
  NOT_FOUND: createOperationalError(
    'El recurso solicitado no existe',
    404,
    'NOT_FOUND'
  ),
  SERVER_ERROR: createOperationalError(
    'Error interno del servidor',
    500,
    'SERVER_ERROR'
  )
}; 