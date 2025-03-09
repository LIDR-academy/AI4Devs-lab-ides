import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { PAGINATION } from '../utils/constants';

// Interfaz para los parámetros de paginación
export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

// Esquema de validación para los parámetros de paginación
const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : PAGINATION.DEFAULT_PAGE))
    .pipe(
      z
        .number()
        .int('La página debe ser un número entero')
        .positive('La página debe ser un número positivo')
    ),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : PAGINATION.DEFAULT_LIMIT))
    .pipe(
      z
        .number()
        .int('El límite debe ser un número entero')
        .positive('El límite debe ser un número positivo')
        .max(PAGINATION.MAX_LIMIT, `El límite no puede ser mayor a ${PAGINATION.MAX_LIMIT}`)
    ),
});

/**
 * Middleware para extraer y validar los parámetros de paginación
 */
export const paginationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extraer los parámetros de paginación de la consulta
    const { page, limit } = paginationSchema.parse(req.query);

    // Calcular el número de elementos a omitir
    const skip = (page - 1) * limit;

    // Añadir los parámetros de paginación a la solicitud
    req.pagination = {
      page,
      limit,
      skip,
    };

    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Convertir el error de Zod a un formato más amigable
      const validationError = fromZodError(error);

      // Formatear los errores para la respuesta
      const formattedErrors = error.errors.map((err: z.ZodIssue) => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));

      // Devolver respuesta con errores
      return res.status(400).json({
        success: false,
        error: 'Parámetros de paginación inválidos',
        code: 'VALIDATION_ERROR',
        message: validationError.message,
        errors: formattedErrors,
      });
    }

    // Si no es un error de Zod, pasar al siguiente middleware de error
    next(error);
  }
};

// Extender la interfaz Request para incluir los parámetros de paginación
declare global {
  namespace Express {
    interface Request {
      pagination?: PaginationParams;
    }
  }
} 