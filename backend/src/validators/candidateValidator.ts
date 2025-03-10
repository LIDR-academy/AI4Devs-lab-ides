import { body } from 'express-validator';

export const createCandidateValidator = [
  body('firstName')
    .notEmpty()
    .trim()
    .isString()
    .withMessage('El nombre es requerido y debe ser texto'),
  body('lastName')
    .notEmpty()
    .trim()
    .isString()
    .withMessage('El apellido es requerido y debe ser texto'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-]+$/)
    .withMessage('Formato de teléfono inválido'),
  body('address')
    .optional()
    .trim()
    .isString()
    .withMessage('La dirección debe ser texto'),
  body('education.*.institution')
    .optional()
    .isString()
    .withMessage('La institución debe ser texto'),
  body('education.*.degree')
    .optional()
    .isString()
    .withMessage('El título debe ser texto'),
  body('education.*.fieldOfStudy')
    .optional()
    .isString()
    .withMessage('El campo de estudio debe ser texto'),
  body('education.*.startDate')
    .optional()
    .isISO8601()
    .withMessage('Fecha de inicio inválida'),
  body('education.*.endDate')
    .optional()
    .isISO8601()
    .withMessage('Fecha de fin inválida'),
  body('experience.*.company')
    .optional()
    .isString()
    .withMessage('La empresa debe ser texto'),
  body('experience.*.position')
    .optional()
    .isString()
    .withMessage('El cargo debe ser texto'),
  body('experience.*.description')
    .optional()
    .isString()
    .withMessage('La descripción debe ser texto'),
];
