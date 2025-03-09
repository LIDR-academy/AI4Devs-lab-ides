import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateCandidate = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .customSanitizer((value) => value || ''),

  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .customSanitizer((value) => value || ''),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .customSanitizer((value) => value || ''),

  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Invalid phone number'),

  body('education')
    .optional()
    .isString()
    .withMessage('Education must be a string'),

  body('experience')
    .optional()
    .isString()
    .withMessage('Experience must be a string'),

  (req: Request, res: Response, next: NextFunction) => {
    console.log('Request body:', req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    next();
  },
];
