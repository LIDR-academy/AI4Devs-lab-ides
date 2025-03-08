import { Request, Response, NextFunction } from 'express';
import xss from 'xss';

/**
 * Middleware para sanitizar datos de entrada y prevenir ataques XSS
 */
export const sanitizeInputs = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    // Sanitizar campos de texto para prevenir XSS
    for (const key in req.body) {
      // Sanitizar solo strings para evitar modificar otros tipos de datos
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  
  next();
};

/**
 * Sanitizar un objeto completo, incluyendo objetos anidados
 * @param obj Objeto a sanitizar
 * @returns Objeto sanitizado
 */
export const deepSanitize = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? xss(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepSanitize(item));
  }

  const sanitized: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      sanitized[key] = deepSanitize(obj[key]);
    }
  }

  return sanitized;
}; 