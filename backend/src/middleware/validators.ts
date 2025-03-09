import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prismaClient';

// Validation rules for candidate creation
export const validateCandidateCreation = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser un texto'),
  
  body('apellido')
    .notEmpty().withMessage('El apellido es obligatorio')
    .isString().withMessage('El apellido debe ser un texto'),
  
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El email debe tener un formato válido')
    .custom(async (value) => {
      // Check if email already exists in the database
      //@ts-ignore
      const existingCandidate = await prisma.candidate.findUnique({
        where: { email: value }
      });
      
      if (existingCandidate) {
        throw new Error('Este email ya está registrado');
      }
      
      return true;
    }),
  
  body('telefono')
    .optional()
    .isString().withMessage('El teléfono debe ser un texto'),
  
  body('direccion')
    .optional()
    .isString().withMessage('La dirección debe ser un texto'),
  
  body('educacion')
    .notEmpty().withMessage('La educación es obligatoria')
    .isString().withMessage('La educación debe ser un texto'),
  
  body('experiencia')
    .notEmpty().withMessage('La experiencia es obligatoria')
    .isString().withMessage('La experiencia debe ser un texto'),
];

// Middleware to check validation results
export const checkValidationResult = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  
  next();
}; 