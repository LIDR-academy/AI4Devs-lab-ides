import { Request, Response, NextFunction } from 'express';

// Interfaz para errores personalizados
export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

// Middleware para capturar errores
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Valores por defecto
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const details = err.details || null;

  // Registrar el error
  console.error(`[ERROR] ${code}: ${message}`, {
    path: req.path,
    method: req.method,
    statusCode,
    details,
    stack: err.stack,
  });

  // Enviar respuesta al cliente
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details: process.env.NODE_ENV === 'production' ? undefined : details,
    },
  });
};

// Función para crear errores personalizados
export const createError = (
  message: string,
  statusCode: number = 500,
  code: string = 'INTERNAL_SERVER_ERROR',
  details?: any
): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
};

// Middleware para capturar rutas no encontradas
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error: AppError = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.statusCode = 404;
  error.code = 'NOT_FOUND';
  next(error);
}; 