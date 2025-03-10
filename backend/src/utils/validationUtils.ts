import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Esquema para validar las fechas
const dateSchema = z.preprocess((arg: unknown) => {
  if (arg === '' || arg === null || arg === undefined) return undefined;
  if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
  return arg;
}, z.date().optional());

// Esquema para validar la educación
const educationSchema = z.object({
  institution: z.string().min(1, 'La institución es requerida'),
  degree: z.string().min(1, 'El título es requerido'),
  fieldOfStudy: z.string().optional().nullable(),
  startDate: dateSchema,
  endDate: dateSchema.optional(),
  description: z.string().optional().nullable(),
});

// Esquema para validar la experiencia
const experienceSchema = z.object({
  company: z.string().min(1, 'La empresa es requerida'),
  position: z.string().min(1, 'El cargo es requerido'),
  location: z.string().optional().nullable(),
  startDate: dateSchema,
  endDate: dateSchema.optional(),
  description: z.string().optional().nullable(),
});

// Esquema para validar el candidato
const candidateSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('El correo electrónico debe tener un formato válido'),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  education: z.array(educationSchema).optional().nullable(),
  experience: z.array(experienceSchema).optional().nullable(),
});

// Middleware para validar los datos del candidato
export const validateCandidate = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Validando datos del candidato...');
    
    // Procesar campos de educación y experiencia que vienen como strings
    if (req.body.education && typeof req.body.education === 'string') {
      try {
        req.body.education = JSON.parse(req.body.education);
        console.log('Campo education parseado correctamente:', req.body.education);
      } catch (error) {
        console.error('Error al parsear el campo education:', error);
        return res.status(400).json({ 
          message: 'Datos de candidato inválidos', 
          errors: [{ field: 'education', message: 'El formato de educación es inválido' }] 
        });
      }
    }
    
    if (req.body.experience && typeof req.body.experience === 'string') {
      try {
        req.body.experience = JSON.parse(req.body.experience);
        console.log('Campo experience parseado correctamente:', req.body.experience);
      } catch (error) {
        console.error('Error al parsear el campo experience:', error);
        return res.status(400).json({ 
          message: 'Datos de candidato inválidos', 
          errors: [{ field: 'experience', message: 'El formato de experiencia es inválido' }] 
        });
      }
    }
    
    // Validar los datos del candidato
    const result = candidateSchema.safeParse(req.body);
    
    if (!result.success) {
      console.error('Errores de validación:', result.error.format());
      
      // Extraer y formatear los errores
      interface FormattedError {
        field: string;
        message: string;
      }
      
      const formattedErrors: FormattedError[] = [];
      const errors = result.error.format();
      
      // Procesar errores de campos principales
      Object.entries(errors).forEach(([field, error]) => {
        if (field !== '_errors' && typeof error === 'object' && error !== null && '_errors' in error && Array.isArray(error._errors) && error._errors.length > 0) {
          formattedErrors.push({
            field,
            message: error._errors[0]
          });
        }
      });
      
      // Procesar errores de arrays (education, experience)
      if (errors.education && typeof errors.education === 'object' && errors.education !== null) {
        Object.entries(errors.education).forEach(([index, error]) => {
          if (index !== '_errors' && typeof error === 'object' && error !== null) {
            Object.entries(error).forEach(([field, fieldError]) => {
              if (field !== '_errors' && typeof fieldError === 'object' && fieldError !== null && '_errors' in fieldError && Array.isArray(fieldError._errors) && fieldError._errors.length > 0) {
                formattedErrors.push({
                  field: `education[${index}].${field}`,
                  message: fieldError._errors[0]
                });
              }
            });
          }
        });
      }
      
      if (errors.experience && typeof errors.experience === 'object' && errors.experience !== null) {
        Object.entries(errors.experience).forEach(([index, error]) => {
          if (index !== '_errors' && typeof error === 'object' && error !== null) {
            Object.entries(error).forEach(([field, fieldError]) => {
              if (field !== '_errors' && typeof fieldError === 'object' && fieldError !== null && '_errors' in fieldError && Array.isArray(fieldError._errors) && fieldError._errors.length > 0) {
                formattedErrors.push({
                  field: `experience[${index}].${field}`,
                  message: fieldError._errors[0]
                });
              }
            });
          }
        });
      }
      
      return res.status(400).json({
        message: 'Datos de candidato inválidos',
        errors: formattedErrors.length > 0 ? formattedErrors : [{ field: 'general', message: 'Datos de candidato inválidos' }]
      });
    }
    
    // Si la validación es exitosa, continuar
    console.log('Validación exitosa');
    next();
  } catch (error) {
    console.error('Error en el middleware de validación:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
