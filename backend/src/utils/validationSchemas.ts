import { z } from 'zod';

// Expresión regular para validar teléfonos
const phoneRegex = /^(\+?\d{1,3}[-\s]?)?\(?(\d{3})\)?[-\s]?(\d{3})[-\s]?(\d{3,4})$/;

// Esquema para la educación
const educationSchema = z.object({
  institution: z.string().min(1, 'La institución es obligatoria'),
  degree: z.string().min(1, 'El título es obligatorio'),
  fieldOfStudy: z.string().min(1, 'El campo de estudio es obligatorio'),
  startDate: z.string().min(1, 'La fecha de inicio es obligatoria'),
  endDate: z.string().optional(),
  description: z.string().optional(),
}).refine(data => {
  if (!data.startDate || !data.endDate) return true;
  return new Date(data.startDate) <= new Date(data.endDate);
}, {
  message: 'La fecha de finalización debe ser posterior a la fecha de inicio',
  path: ['endDate']
});

// Esquema para la experiencia
const experienceSchema = z.object({
  company: z.string().min(1, 'La empresa es obligatoria'),
  position: z.string().min(1, 'El puesto es obligatorio'),
  startDate: z.string().min(1, 'La fecha de inicio es obligatoria'),
  endDate: z.string().optional(),
  description: z.string().optional(),
}).refine(data => {
  if (!data.startDate || !data.endDate) return true;
  return new Date(data.startDate) <= new Date(data.endDate);
}, {
  message: 'La fecha de finalización debe ser posterior a la fecha de inicio',
  path: ['endDate']
});

// Esquema para crear un candidato
export const createCandidateSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'El nombre es obligatorio'),
    lastName: z.string().min(1, 'El apellido es obligatorio'),
    email: z.string().email('Correo electrónico inválido'),
    phone: z.string()
      .min(1, 'El teléfono es obligatorio')
      .regex(
        phoneRegex, 
        'Formato de teléfono inválido. Ejemplos válidos: 666777888, +34 666 777 888'
      ),
    address: z.string().min(1, 'La dirección es obligatoria'),
    education: z.string().transform((val, ctx) => {
      try {
        const parsed = JSON.parse(val);
        return parsed;
      } catch (e) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La educación debe ser un JSON válido',
        });
        return z.NEVER;
      }
    }).pipe(z.array(educationSchema).min(1, 'Debe agregar al menos una educación')),
    experience: z.string().transform((val, ctx) => {
      try {
        const parsed = JSON.parse(val);
        return parsed;
      } catch (e) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La experiencia debe ser un JSON válido',
        });
        return z.NEVER;
      }
    }).pipe(z.array(experienceSchema).min(1, 'Debe agregar al menos una experiencia')),
  }),
  file: z.any().optional(),
});

// Esquema para obtener un candidato por ID
export const getCandidateByIdSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => !isNaN(parseInt(val)), {
      message: 'ID debe ser un número',
    }),
  }),
}); 