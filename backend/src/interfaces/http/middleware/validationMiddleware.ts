import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Validaciones para candidatos
export const validateCreateCandidate = [
  // Campos básicos obligatorios
  body('firstName')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/).withMessage('El nombre contiene caracteres no válidos'),

  body('lastName')
    .trim()
    .notEmpty().withMessage('El apellido es obligatorio')
    .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/).withMessage('El apellido contiene caracteres no válidos'),

  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El formato de email no es válido')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty().withMessage('El teléfono es obligatorio')
    .matches(/^\+?[0-9]{6,15}$/).withMessage('El formato de teléfono no es válido'),

  // Campos opcionales
  body('address')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('La dirección no puede exceder los 100 caracteres'),

  body('city')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 }).withMessage('La ciudad no puede exceder los 50 caracteres'),

  body('state')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 }).withMessage('La provincia/estado no puede exceder los 50 caracteres'),

  body('postalCode')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[A-Za-z0-9\s-]{1,10}$/).withMessage('El código postal tiene un formato inválido'),

  body('country')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 }).withMessage('El país no puede exceder los 50 caracteres'),

  body('currentPosition')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('El puesto actual no puede exceder los 100 caracteres'),

  body('currentCompany')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('La empresa actual no puede exceder los 100 caracteres'),

  body('yearsOfExperience')
    .optional({ checkFalsy: true })
    .isInt({ min: 0, max: 50 }).withMessage('Los años de experiencia deben ser un número entre 0 y 50'),

  body('notes')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Las notas no pueden exceder los 500 caracteres'),

  // Validación para estructuras complejas como arrays
  body('skills')
    .optional({ checkFalsy: true })
    .custom((value) => {
      // Si es un string, intentamos parsearlo como JSON
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          // Verificamos que sea un array
          if (!Array.isArray(parsed)) {
            throw new Error('Las habilidades deben ser una lista');
          }
          return true;
        } catch (error) {
          // Si es un string pero no parseable como JSON, asumimos que es una habilidad única
          return true;
        }
      }
      // Si ya es un array, está bien
      if (Array.isArray(value)) {
        return true;
      }
      // Si no es ni string ni array, es un error
      return false;
    }).withMessage('Las habilidades deben ser una lista válida'),

  body('educations')
    .optional({ checkFalsy: true })
    .custom((value) => {
      // Si no hay valor, está bien (es opcional)
      if (!value) return true;
      
      // Si es un string, intentamos parsearlo como JSON
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          // Verificamos que sea un array
          if (!Array.isArray(parsed)) {
            throw new Error('La educación debe ser una lista');
          }
          return true;
        } catch (error) {
          // Si es un string pero no parseable como JSON, aceptamos para manejar en controlador
          return true;
        }
      }
      // Si ya es un array, está bien
      if (Array.isArray(value)) {
        return true;
      }
      // Si no es ni string ni array, es un error
      return false;
    }).withMessage('La educación debe ser una lista válida'),

  body('experiences')
    .optional({ checkFalsy: true })
    .custom((value) => {
      // Si no hay valor, está bien (es opcional)
      if (!value) return true;
      
      // Si es un string, intentamos parsearlo como JSON
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          // Verificamos que sea un array
          if (!Array.isArray(parsed)) {
            throw new Error('Las experiencias deben ser una lista');
          }
          return true;
        } catch (error) {
          // Si es un string pero no parseable como JSON, aceptamos para manejar en controlador
          return true;
        }
      }
      // Si ya es un array, está bien
      if (Array.isArray(value)) {
        return true;
      }
      // Si no es ni string ni array, es un error
      return false;
    }).withMessage('Las experiencias deben ser una lista válida'),

  body('tags')
    .optional({ checkFalsy: true })
    .custom((value) => {
      // Si no hay valor, está bien (es opcional)
      if (!value) return true;
      
      // Si es un string, intentamos parsearlo como JSON
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          // Verificamos que sea un array
          if (!Array.isArray(parsed)) {
            throw new Error('Las etiquetas deben ser una lista');
          }
          return true;
        } catch (error) {
          // Si es un string pero no parseable como JSON, aceptamos para manejar en controlador
          return true;
        }
      }
      // Si ya es un array, está bien
      if (Array.isArray(value)) {
        return true;
      }
      // Si no es ni string ni array, es un error
      return false;
    }).withMessage('Las etiquetas deben ser una lista válida'),

  // Middleware para procesar los resultados de la validación
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }
    next();
  }
];

// Función genérica para manejar errores de validación
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array()
    });
  }
  next();
}; 