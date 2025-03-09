import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { createError } from './errorHandler';

// Middleware para validar los datos de entrada con Zod
export const validate = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validar los datos de entrada contra el esquema
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      file: req.file,
      files: req.files,
    });
    
    return next();
  } catch (error) {
    // Si hay un error de validación, formatearlo y enviarlo
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      
      return next(createError('Error de validación', 400, formattedErrors));
    }
    
    return next(error);
  }
}; 