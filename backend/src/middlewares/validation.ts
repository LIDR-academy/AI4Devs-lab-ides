import { Request, Response, NextFunction } from 'express';
import { CandidateInput } from '../types/candidate';

/**
 * Middleware para validar los datos de entrada de un candidato
 */
export const validateCandidateInput = (req: Request, res: Response, next: NextFunction) => {
  const candidateData: CandidateInput = req.body;
  const errors: string[] = [];

  // Validar campos obligatorios
  if (!candidateData.firstName || candidateData.firstName.trim() === '') {
    errors.push('El nombre es obligatorio');
  }

  if (!candidateData.lastName || candidateData.lastName.trim() === '') {
    errors.push('El apellido es obligatorio');
  }

  if (!candidateData.email || candidateData.email.trim() === '') {
    errors.push('El email es obligatorio');
  } else {
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(candidateData.email)) {
      errors.push('El formato del email no es válido');
    }
  }

  // Validar formato de teléfono si está presente
  if (candidateData.phone) {
    const phoneRegex = /^\+?[0-9]{8,15}$/;
    if (!phoneRegex.test(candidateData.phone)) {
      errors.push('El formato del teléfono no es válido');
    }
  }

  // Validar educación si está presente
  if (candidateData.education && candidateData.education.length > 0) {
    candidateData.education.forEach((edu, index) => {
      if (!edu.institution || edu.institution.trim() === '') {
        errors.push(`La institución educativa #${index + 1} es obligatoria`);
      }
      if (!edu.degree || edu.degree.trim() === '') {
        errors.push(`El título educativo #${index + 1} es obligatorio`);
      }
      if (!edu.startDate) {
        errors.push(`La fecha de inicio de educación #${index + 1} es obligatoria`);
      }
    });
  }

  // Validar experiencia laboral si está presente
  if (candidateData.workExperience && candidateData.workExperience.length > 0) {
    candidateData.workExperience.forEach((exp, index) => {
      if (!exp.company || exp.company.trim() === '') {
        errors.push(`La empresa #${index + 1} es obligatoria`);
      }
      if (!exp.position || exp.position.trim() === '') {
        errors.push(`El cargo #${index + 1} es obligatorio`);
      }
      if (!exp.startDate) {
        errors.push(`La fecha de inicio de experiencia #${index + 1} es obligatoria`);
      }
    });
  }

  // Si hay errores, devolver respuesta con errores
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Sanitizar datos
  candidateData.firstName = candidateData.firstName.trim();
  candidateData.lastName = candidateData.lastName.trim();
  candidateData.email = candidateData.email.trim().toLowerCase();
  
  if (candidateData.phone) {
    candidateData.phone = candidateData.phone.trim();
  }

  // Continuar con el siguiente middleware
  next();
}; 