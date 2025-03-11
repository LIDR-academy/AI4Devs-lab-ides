import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from '../utils/AppError';

/**
 * Middleware que verifica si hay errores de validación y los devuelve en un formato consistente
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Ejecutar todas las validaciones
    await Promise.all(validations.map(validation => validation.run(req)));

    // Verificar si hay errores
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Formatear errores
    const formattedErrors = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : error.type,
      message: error.msg,
      value: error.type === 'field' ? error.value : undefined
    }));

    // Devolver respuesta con errores
    return res.status(400).json({
      success: false,
      error: 'Datos de entrada inválidos',
      code: 'VALIDATION_ERROR',
      errors: formattedErrors
    });
  };
};

/**
 * Middleware para validar IDs numéricos en los parámetros de la ruta
 */
export const validateIdParam = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params[paramName], 10);
    
    if (isNaN(id) || id <= 0) {
      throw AppError.badRequest(
        `El parámetro ${paramName} debe ser un número entero positivo`,
        'INVALID_ID_PARAM'
      );
    }
    
    // Asignar el ID convertido a los parámetros
    req.params[paramName] = id.toString();
    next();
  };
};

/**
 * Middleware para validar el cuerpo de la solicitud
 */
export const validateRequestBody = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    throw AppError.badRequest(
      'Error de validación: ' + errorMessages.join(', '),
      'VALIDATION_ERROR'
    );
  }
  next();
};

/**
 * Función para validar una solicitud
 * @param req Objeto de solicitud
 * @throws AppError si hay errores de validación
 */
export const validateRequest = (req: Request) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    throw AppError.badRequest(
      'Error de validación: ' + errorMessages.join(', '),
      'VALIDATION_ERROR'
    );
  }
}; 