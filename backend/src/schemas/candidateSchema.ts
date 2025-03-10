import { z } from 'zod';

/**
 * Esquema para la validación de experiencia laboral
 */
export const workExperienceSchema = z.object({
  company: z
    .string()
    .min(2, 'El nombre de la empresa debe tener al menos 2 caracteres')
    .max(100, 'El nombre de la empresa no puede tener más de 100 caracteres'),
  position: z
    .string()
    .min(2, 'El puesto debe tener al menos 2 caracteres')
    .max(100, 'El puesto no puede tener más de 100 caracteres'),
  startDate: z.string(),
  endDate: z
    .string()
    .optional(),
  description: z
    .string()
    .max(1000, 'La descripción no puede tener más de 1000 caracteres')
    .optional(),
});

/**
 * Esquema para la validación de educación
 */
export const educationSchema = z.object({
  institution: z
    .string()
    .min(2, 'El nombre de la institución debe tener al menos 2 caracteres')
    .max(100, 'El nombre de la institución no puede tener más de 100 caracteres'),
  degree: z
    .string()
    .min(2, 'El título debe tener al menos 2 caracteres')
    .max(100, 'El título no puede tener más de 100 caracteres'),
  field: z
    .string()
    .min(2, 'El campo de estudio debe tener al menos 2 caracteres')
    .max(100, 'El campo de estudio no puede tener más de 100 caracteres'),
  startDate: z.string(),
  endDate: z
    .string()
    .optional(),
  description: z
    .string()
    .max(500, 'La descripción no puede tener más de 500 caracteres')
    .optional(),
});

/**
 * Esquema para la validación de habilidades
 */
export const skillSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre de la habilidad debe tener al menos 2 caracteres')
    .max(50, 'El nombre de la habilidad no puede tener más de 50 caracteres'),
  level: z
    .enum(['beginner', 'intermediate', 'advanced', 'expert'], {
      errorMap: () => ({
        message: 'El nivel debe ser beginner, intermediate, advanced o expert',
      }),
    })
    .optional(),
  yearsOfExperience: z
    .number()
    .min(0, 'Los años de experiencia no pueden ser negativos')
    .max(50, 'Los años de experiencia no pueden ser más de 50')
    .optional(),
});

/**
 * Esquema para la validación de documentos
 */
export const documentSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre del documento debe tener al menos 2 caracteres')
    .max(100, 'El nombre del documento no puede tener más de 100 caracteres'),
  type: z
    .enum(['CV', 'Cover Letter', 'Certificate', 'Other'], {
      errorMap: () => ({
        message: 'El tipo debe ser CV, Cover Letter, Certificate u Other',
      }),
    }),
  fileUrl: z
    .string()
    .optional(), // Será completado por el backend
  fileType: z
    .enum(['pdf', 'docx', 'doc', 'txt'], {
      errorMap: () => ({
        message: 'El tipo de archivo debe ser pdf, docx, doc o txt',
      }),
    }),
  isEncrypted: z
    .boolean()
    .default(true),
});

/**
 * Esquema para la validación de privacidad del candidato
 */
export const privacySettingsSchema = z.object({
  shareWithThirdParties: z
    .boolean()
    .default(false),
  showContactInfo: z
    .boolean()
    .default(true),
  showEducation: z
    .boolean()
    .default(true),
  showExperience: z
    .boolean()
    .default(true),
});

/**
 * Esquema base para la validación de candidatos
 */
export const candidateBaseSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres'),
  email: z
    .string()
    .email('El email debe tener un formato válido')
    .min(5, 'El email debe tener al menos 5 caracteres')
    .max(100, 'El email no puede tener más de 100 caracteres'),
  phone: z
    .string()
    .regex(
      /^\+?[0-9]{6,15}$/,
      'El teléfono debe tener entre 6 y 15 dígitos, opcionalmente precedido por un signo +'
    )
    .optional(),
  address: z
    .string()
    .max(200, 'La dirección no puede tener más de 200 caracteres')
    .optional(),
  location: z
    .string()
    .max(100, 'La ubicación no puede tener más de 100 caracteres')
    .optional(),
  linkedIn: z
    .string()
    .url('El perfil de LinkedIn debe ser una URL válida')
    .optional(),
  github: z
    .string()
    .url('El perfil de GitHub debe ser una URL válida')
    .optional(),
  portfolio: z
    .string()
    .url('El portafolio debe ser una URL válida')
    .optional(),
  summary: z
    .string()
    .max(1000, 'El resumen no puede tener más de 1000 caracteres')
    .optional(),
  status: z
    .enum(['new', 'active', 'contacted', 'interview', 'offer', 'hired', 'rejected'], {
      errorMap: () => ({
        message: 'El estado debe ser new, active, contacted, interview, offer, hired o rejected',
      }),
    })
    .default('active'),
  source: z
    .string()
    .max(100, 'La fuente no puede tener más de 100 caracteres')
    .optional(),
  tags: z
    .array(z.string().max(50, 'Cada etiqueta no puede tener más de 50 caracteres'))
    .max(10, 'No puede haber más de 10 etiquetas')
    .optional(),
  workExperience: z
    .array(workExperienceSchema)
    .max(20, 'No puede haber más de 20 experiencias laborales')
    .optional(),
  education: z
    .array(educationSchema)
    .max(10, 'No puede haber más de 10 educaciones')
    .optional(),
  skills: z
    .array(skillSchema)
    .max(30, 'No puede haber más de 30 habilidades')
    .optional(),
  notes: z
    .string()
    .max(2000, 'Las notas no pueden tener más de 2000 caracteres')
    .optional(),
  dataConsent: z
    .boolean()
    .default(false),
  documents: z
    .array(documentSchema)
    .max(5, 'No puede haber más de 5 documentos')
    .optional(),
  privacySettings: privacySettingsSchema.optional(),
});

/**
 * Esquema simplificado para la creación de candidatos
 */
export const createCandidateSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres'),
  email: z
    .string()
    .email('El email debe tener un formato válido')
    .min(5, 'El email debe tener al menos 5 caracteres')
    .max(100, 'El email no puede tener más de 100 caracteres'),
  phone: z
    .string()
    .regex(
      /^\+?[0-9]{6,15}$/,
      'El teléfono debe tener entre 6 y 15 dígitos, opcionalmente precedido por un signo +'
    )
    .optional(),
  summary: z
    .string()
    .max(1000, 'El resumen no puede tener más de 1000 caracteres')
    .optional(),
  status: z
    .enum(['new', 'active', 'contacted', 'interview', 'offer', 'hired', 'rejected'], {
      errorMap: () => ({
        message: 'El estado debe ser new, active, contacted, interview, offer, hired o rejected',
      }),
    })
    .default('active'),
  notes: z
    .string()
    .max(2000, 'Las notas no pueden tener más de 2000 caracteres')
    .optional(),
  dataConsent: z
    .boolean()
    .default(false),
  recruiterId: z
    .number()
    .optional(),
  education: z
    .array(educationSchema)
    .optional(),
  workExperience: z
    .array(workExperienceSchema)
    .optional(),
  skills: z
    .array(skillSchema)
    .optional(),
});

/**
 * Esquema para la actualización de candidatos
 */
export const updateCandidateSchema = candidateBaseSchema.partial();

/**
 * Esquema para la búsqueda de candidatos
 */
export const searchCandidateSchema = z.object({
  query: z.string().optional(),
  status: z
    .enum(['new', 'active', 'contacted', 'interview', 'offer', 'hired', 'rejected'])
    .optional(),
  skills: z
    .array(skillSchema)
    .max(10, 'No puede buscar por más de 10 habilidades')
    .optional(),
  location: z.string().optional(),
  experienceMin: z
    .number()
    .min(0, 'La experiencia mínima no puede ser negativa')
    .optional(),
  experienceMax: z
    .number()
    .min(0, 'La experiencia máxima no puede ser negativa')
    .optional(),
  tags: z
    .array(z.string())
    .max(10, 'No puede buscar por más de 10 etiquetas')
    .optional(),
  sortBy: z
    .enum(['firstName', 'lastName', 'email', 'createdAt', 'updatedAt'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Tipos derivados de los esquemas
export type CreateCandidateInput = z.infer<typeof createCandidateSchema>;
export type UpdateCandidateInput = z.infer<typeof updateCandidateSchema>;
export type SearchCandidateInput = z.infer<typeof searchCandidateSchema>;
export type WorkExperienceInput = z.infer<typeof workExperienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
export type PrivacySettingsInput = z.infer<typeof privacySettingsSchema>; 