import { CreateCandidateDto } from '../../domain/dtos/CreateCandidateDto';

export function validateCreateCandidateDto(data: any): string[] {
  const errors: string[] = [];

  if (!data.name) {
    errors.push('El nombre es requerido');
  }

  if (!data.lastName) {
    errors.push('El apellido es requerido');
  }

  if (!data.email) {
    errors.push('El email es requerido');
  } else if (!isValidEmail(data.email)) {
    errors.push('El email no tiene un formato válido');
  }

  if (data.education) {
    if (!Array.isArray(data.education)) {
      errors.push('La educación debe ser un array');
    } else {
      data.education.forEach((edu: any, index: number) => {
        if (!edu.institution) {
          errors.push(`La institución es requerida en la educación ${index + 1}`);
        }
        if (!edu.degree) {
          errors.push(`El título es requerido en la educación ${index + 1}`);
        }
      });
    }
  }

  if (data.workExperience) {
    if (!Array.isArray(data.workExperience)) {
      errors.push('La experiencia laboral debe ser un array');
    } else {
      data.workExperience.forEach((exp: any, index: number) => {
        if (!exp.company) {
          errors.push(`La empresa es requerida en la experiencia ${index + 1}`);
        }
        if (!exp.position) {
          errors.push(`El puesto es requerido en la experiencia ${index + 1}`);
        }
      });
    }
  }

  return errors;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
} 