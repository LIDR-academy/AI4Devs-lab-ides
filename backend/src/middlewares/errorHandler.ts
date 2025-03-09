import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  errors?: any;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  // Determinar el código de estado HTTP
  const statusCode = err.statusCode || 500;
  
  // Construir la respuesta de error
  const errorResponse = {
    error: {
      message: err.message || 'Error interno del servidor',
      ...(err.errors && { details: err.errors }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  };
  
  // Enviar la respuesta
  res.status(statusCode).json(errorResponse);
};

// Middleware para capturar errores en rutas no encontradas
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error: AppError = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Función para crear errores con código de estado
export const createError = (message: string, statusCode: number, errors?: any): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  if (errors) {
    error.errors = errors;
  }
  return error;
}; 