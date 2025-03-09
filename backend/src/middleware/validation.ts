import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation rules for candidate creation
export const validateCandidate = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone')
    .optional({ checkFalsy: true })
    .if(body('phone').notEmpty())
    .isMobilePhone('any')
    .withMessage('Valid phone number is required'),
  body('address').optional(),
  body('education').optional(),
  body('workExperience').optional(),

  // Middleware to check validation results
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
