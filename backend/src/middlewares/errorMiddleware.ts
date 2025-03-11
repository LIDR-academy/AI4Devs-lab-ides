import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { config } from '../config/config';

/**
 * Middleware para manejar errores 404 (Not Found)
 * @param req Request de Express
 * @param res Response de Express
 * @param next Función next de Express
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new AppError(`Ruta no encontrada: ${req.originalUrl}`, 404, 'ROUTE_NOT_FOUND');
  next(error);
};

/**
 * Middleware para manejar errores
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Si es un error de la aplicación
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.errorCode || 'UNKNOWN_ERROR',
      },
    });
  }

  // Si es un error de validación de Express Validator
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        message: err.message,
        code: 'VALIDATION_ERROR',
      },
    });
  }

  // Para otros errores no controlados
  return res.status(500).json({
    success: false,
    error: {
      message: 'Error interno del servidor',
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
}; 