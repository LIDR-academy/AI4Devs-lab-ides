import { Education, WorkExperience, Document } from '../types/candidate';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    // Necesario para que instanceof funcione correctamente
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Regular expressions for validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+?[\d\s-]{10,}$/;

// File constraints
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export const validatePersonalInfo = (data: PersonalInfo): void => {
  if (!data.firstName?.trim()) {
    throw new ValidationError('First name is required');
  }
  if (!data.lastName?.trim()) {
    throw new ValidationError('Last name is required');
  }
  if (!data.email?.trim()) {
    throw new ValidationError('Email is required');
  }
  if (!EMAIL_REGEX.test(data.email)) {
    throw new ValidationError('Invalid email format');
  }
  if (!data.phone?.trim()) {
    throw new ValidationError('Phone number is required');
  }
  if (!PHONE_REGEX.test(data.phone)) {
    throw new ValidationError('Invalid phone number format');
  }
};

export const validateEducation = (education: Education[]): void => {
  if (!education || education.length === 0) {
    throw new ValidationError('At least one education entry is required');
  }

  education.forEach((edu, index) => {
    if (!edu.title?.trim()) {
      throw new ValidationError('Degree/Title is required');
    }
    if (!edu.institution?.trim()) {
      throw new ValidationError('Institution is required');
    }
    if (!edu.startDate) {
      throw new ValidationError('Start date is required');
    }
    if (!edu.endDate) {
      throw new ValidationError('End date is required');
    }
    if (edu.endDate < edu.startDate) {
      throw new ValidationError('End date must be after start date');
    }
  });
};

export const validateWorkExperience = (experience: WorkExperience[]): void => {
  if (!experience || experience.length === 0) {
    throw new ValidationError('At least one work experience entry is required');
  }

  experience.forEach((exp, index) => {
    if (!exp.company?.trim()) {
      throw new ValidationError('Company name is required');
    }
    if (!exp.position?.trim()) {
      throw new ValidationError('Position is required');
    }
    if (!exp.startDate) {
      throw new ValidationError('Start date is required');
    }
    if (!exp.endDate) {
      throw new ValidationError('End date is required');
    }
    if (exp.endDate < exp.startDate) {
      throw new ValidationError('End date must be after start date');
    }
  });
};

export const validateDocument = (document: Document | null): void => {
  if (!document) {
    return; // Document is optional
  }

  if (!document.file) {
    throw new ValidationError('File is required');
  }

  if (!ALLOWED_FILE_TYPES.includes(document.file.type)) {
    throw new ValidationError('Invalid file type. Only PDF, DOC, DOCX are allowed');
  }

  if (document.file.size > MAX_FILE_SIZE) {
    throw new ValidationError('File size exceeds 5MB limit');
  }
}; 