import { Request, Response, NextFunction } from 'express';
import { formatError } from '../utils/response.utils';
import { translate } from '../utils/i18n.utils';

/**
 * Validate candidate request data
 */
export const validateCandidate = (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, phone, address } = req.body;
  const errors: Record<string, string> = {};

  // Validate required fields
  if (!firstName) {
    errors.firstName = translate('validation.firstName.required', req.language);
  }

  if (!lastName) {
    errors.lastName = translate('validation.lastName.required', req.language);
  }

  if (!email) {
    errors.email = translate('validation.email.required', req.language);
  } else if (!isValidEmail(email)) {
    errors.email = translate('validation.email.invalid', req.language);
  }

  if (!phone) {
    errors.phone = translate('validation.phone.required', req.language);
  }

  if (!address) {
    errors.address = translate('validation.address.required', req.language);
  }

  // If there are validation errors, return a 400 response
  if (Object.keys(errors).length > 0) {
    return res.status(400).json(formatError(translate('common.errors.validation', req.language), errors));
  }

  // No validation errors, proceed to the next middleware
  next();
};

/**
 * Validate email format
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};