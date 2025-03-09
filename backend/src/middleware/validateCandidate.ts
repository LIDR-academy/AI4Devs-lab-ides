import { Request, Response, NextFunction } from 'express';

const EDUCATION_LEVELS = ['None', 'High School', 'Bachelor\'s', 'Master\'s', 'PhD'];

export const validateCandidate = (req: Request, res: Response, next: NextFunction) => {
  const errors = [];
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    currentLocation,
    yearsExperience,
    educationLevel
  } = req.body;

  // Required fields & string length validation
  if (!firstName?.trim()) errors.push({ field: 'firstName', message: 'First name is required' });
  if (!lastName?.trim()) errors.push({ field: 'lastName', message: 'Last name is required' });
  if (!currentLocation?.trim()) errors.push({ field: 'currentLocation', message: 'Current location is required' });

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }

  // Phone validation (E.164 format)
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
    errors.push({ field: 'phoneNumber', message: 'Phone number must be in E.164 format' });
  }

  // Years of experience validation
  if (typeof yearsExperience !== 'number' || yearsExperience < 0) {
    errors.push({ field: 'yearsExperience', message: 'Years of experience must be a non-negative number' });
  }

  // Education level validation
  if (!educationLevel || !EDUCATION_LEVELS.includes(educationLevel)) {
    errors.push({ field: 'educationLevel', message: `Education level must be one of: ${EDUCATION_LEVELS.join(', ')}` });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
