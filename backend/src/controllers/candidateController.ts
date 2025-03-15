import { Request, Response } from 'express';
import prisma from '../index';
import { z } from 'zod';

// Esquema de validación para los datos del candidato
const candidateSchema = z.object({
  firstName: z.string().min(1, 'El nombre es obligatorio').max(50, 'El nombre no puede tener más de 50 caracteres'),
  lastName: z.string().min(1, 'El apellido es obligatorio').max(50, 'El apellido no puede tener más de 50 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  phone: z.string().regex(/^[0-9+\s()-]{8,15}$/, 'Número de teléfono inválido'),
  address: z.string().min(1, 'La dirección es obligatoria').max(200, 'La dirección no puede tener más de 200 caracteres'),
  education: z.string().transform((val) => {
    try {
      return JSON.parse(val);
    } catch (e) {
      throw new Error('Formato de educación inválido');
    }
  }),
  experience: z.string().transform((val) => {
    try {
      return JSON.parse(val);
    } catch (e) {
      throw new Error('Formato de experiencia inválido');
    }
  })
});

// Esquema para validar cada entrada de educación
const educationItemSchema = z.object({
  institution: z.string().min(1, 'La institución es obligatoria'),
  degree: z.string().min(1, 'El título es obligatorio'),
  fieldOfStudy: z.string().min(1, 'El campo de estudio es obligatorio'),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

// Esquema para validar cada entrada de experiencia
const experienceItemSchema = z.object({
  company: z.string().min(1, 'La empresa es obligatoria'),
  position: z.string().min(1, 'El cargo es obligatorio'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

/**
 * Controlador para crear un nuevo candidato
 */
export const createCandidate = async (req: Request, res: Response) => {
  try {
    // Verificar si se subió un archivo
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Es necesario subir el CV del candidato'
      });
    }

    // Validar datos del formulario
    const validationResult = candidateSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Datos de candidato inválidos',
        errors: validationResult.error.format()
      });
    }

    const data = validationResult.data;
    
    // Validar cada entrada de educación
    const educationData = data.education;
    for (const edu of educationData) {
      const eduValidation = educationItemSchema.safeParse(edu);
      if (!eduValidation.success) {
        return res.status(400).json({
          success: false,
          message: 'Datos de educación inválidos',
          errors: eduValidation.error.format()
        });
      }
    }
    
    // Validar cada entrada de experiencia
    const experienceData = data.experience;
    for (const exp of experienceData) {
      const expValidation = experienceItemSchema.safeParse(exp);
      if (!expValidation.success) {
        return res.status(400).json({
          success: false,
          message: 'Datos de experiencia inválidos',
          errors: expValidation.error.format()
        });
      }
    }

    // Verificar si el email ya existe
    const existingCandidate = await prisma.candidate.findUnique({
      where: { email: data.email }
    });

    if (existingCandidate) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un candidato con este correo electrónico'
      });
    }

    // Obtener la ruta del archivo CV
    const cvFilePath = req.file.path;

    // Crear el candidato en la base de datos usando una transacción
    const newCandidate = await prisma.$transaction(async (tx) => {
      // Crear el candidato
      const candidate = await tx.candidate.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          cvFilePath: cvFilePath
        }
      });

      // Crear registros de educación
      for (const edu of educationData) {
        await tx.education.create({
          data: {
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: edu.startDate ? new Date(edu.startDate) : null,
            endDate: edu.endDate ? new Date(edu.endDate) : null,
            candidateId: candidate.id
          }
        });
      }

      // Crear registros de experiencia
      for (const exp of experienceData) {
        await tx.experience.create({
          data: {
            company: exp.company,
            position: exp.position,
            description: exp.description || null,
            startDate: exp.startDate ? new Date(exp.startDate) : null,
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            candidateId: candidate.id
          }
        });
      }

      return candidate;
    });

    // Responder con éxito
    return res.status(201).json({
      success: true,
      message: 'Candidato creado exitosamente',
      id: newCandidate.id,
      candidate: {
        id: newCandidate.id,
        firstName: newCandidate.firstName,
        lastName: newCandidate.lastName,
        email: newCandidate.email
      }
    });

  } catch (error: any) {
    console.error('Error al crear candidato:', error);
    
    // Manejar errores específicos
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un candidato con este correo electrónico'
      });
    }
    
    // Error de tamaño de archivo
    if (error.name === 'MulterError' && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'El archivo es demasiado grande. El tamaño máximo es 5MB.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al crear el candidato',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 