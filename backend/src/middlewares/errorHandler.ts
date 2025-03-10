import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/AppError';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error('Error Handler:', err);

  // Si ya se envió una respuesta, pasar al siguiente middleware
  if (res.headersSent) {
    return next(err);
  }

  const timestamp = new Date().toISOString();

  // Manejar errores específicos
  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: 'error',
      message: err.message,
      timestamp,
      errors: err.details,
    });
  }

  // Manejar errores de Prisma
  if (err.code && err.code.startsWith('P')) {
    let statusCode = 400;
    let message = 'Error en la base de datos';

    switch (err.code) {
      case 'P2002':
        statusCode = 409;
        const field = err.meta?.target?.[0];
        message =
          field === 'email'
            ? 'Ya existe un candidato registrado con este correo electrónico'
            : `El valor para ${field} ya existe`;
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Registro no encontrado';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Violación de restricción de clave foránea';
        break;
    }

    return res.status(statusCode).json({
      status: 'error',
      message,
      timestamp,
      code: err.code,
    });
  }

  // Error por defecto
  return res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Error interno del servidor',
    timestamp,
  });
};
