// filepath: /my-project/src/middleware/validateCandidate.ts
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateCandidate = [
  body('first_name').notEmpty().withMessage('El nombre es obligatorio.'),
  body('last_name').notEmpty().withMessage('El apellido es obligatorio.'),
  body('email').isEmail().withMessage('El correo electrónico no es válido.'),
  body('phone_number').notEmpty().withMessage('El número de teléfono es obligatorio.'),
  body('address').notEmpty().withMessage('La dirección es obligatoria.'),
  body('education').notEmpty().withMessage('La educación es obligatoria.'),
  body('work_experience').notEmpty().withMessage('La experiencia laboral es obligatoria.'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];