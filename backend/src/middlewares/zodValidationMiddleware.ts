import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { AppError } from '../utils/AppError';

/**
 * Middleware para validar el cuerpo de la petición con un esquema Zod
 * @param schema Esquema Zod para validar el cuerpo de la petición
 */
export const validateBody = <T extends z.ZodType>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Validando cuerpo de la petición:', JSON.stringify(req.body, null, 2));
      
      // Validar el cuerpo de la petición con el esquema
      const validatedData = schema.parse(req.body);
      
      console.log('Datos validados:', JSON.stringify(validatedData, null, 2));
      
      // Reemplazar el cuerpo de la petición con los datos validados
      req.body = validatedData;
      
      next();
    } catch (error) {
      console.error('Error de validación:', error);
      
      if (error instanceof z.ZodError) {
        // Convertir el error de Zod a un formato más amigable
        const validationError = fromZodError(error);
        
        console.error('Errores de validación:', JSON.stringify(validationError, null, 2));
        
        // Formatear los errores para la respuesta
        const formattedErrors = error.errors.map((err: z.ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        // Devolver respuesta con errores
        return res.status(400).json({
          success: false,
          error: 'Datos de entrada inválidos',
          code: 'VALIDATION_ERROR',
          message: validationError.message,
          errors: formattedErrors
        });
      }
      
      // Si no es un error de Zod, pasar al siguiente middleware de error
      next(error);
    }
  };
};

/**
 * Middleware para validar los parámetros de la ruta con un esquema Zod
 * @param schema Esquema Zod para validar los parámetros de la ruta
 */
export const validateParams = <T extends z.ZodType>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar los parámetros de la ruta con el esquema
      const validatedParams = schema.parse(req.params);
      
      // Reemplazar los parámetros de la ruta con los datos validados
      req.params = validatedParams;
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convertir el error de Zod a un formato más amigable
        const validationError = fromZodError(error);
        
        // Formatear los errores para la respuesta
        const formattedErrors = error.errors.map((err: z.ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        // Devolver respuesta con errores
        return res.status(400).json({
          success: false,
          error: 'Parámetros de ruta inválidos',
          code: 'VALIDATION_ERROR',
          message: validationError.message,
          errors: formattedErrors
        });
      }
      
      // Si no es un error de Zod, pasar al siguiente middleware de error
      next(error);
    }
  };
};

/**
 * Middleware para validar los parámetros de consulta con un esquema Zod
 * @param schema Esquema Zod para validar los parámetros de consulta
 */
export const validateQuery = <T extends z.ZodType>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar los parámetros de consulta con el esquema
      const validatedQuery = schema.parse(req.query);
      
      // Reemplazar los parámetros de consulta con los datos validados
      req.query = validatedQuery;
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convertir el error de Zod a un formato más amigable
        const validationError = fromZodError(error);
        
        // Formatear los errores para la respuesta
        const formattedErrors = error.errors.map((err: z.ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        // Devolver respuesta con errores
        return res.status(400).json({
          success: false,
          error: 'Parámetros de consulta inválidos',
          code: 'VALIDATION_ERROR',
          message: validationError.message,
          errors: formattedErrors
        });
      }
      
      // Si no es un error de Zod, pasar al siguiente middleware de error
      next(error);
    }
  };
}; 