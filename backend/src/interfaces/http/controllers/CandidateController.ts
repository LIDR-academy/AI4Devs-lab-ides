import { Request, Response } from 'express';
import { CreateCandidateUseCase } from '../../../application/use-cases/candidate/CreateCandidateUseCase';
import { AppError } from '../middleware/errorHandlerMiddleware';

export class CandidateController {
  constructor(private createCandidateUseCase: CreateCandidateUseCase) {}

  // Método para crear un candidato
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      // Obtener los datos del body
      const { 
        firstName, lastName, email, phone, address, city, state, postalCode, country,
        currentPosition, currentCompany, yearsOfExperience, notes
      } = req.body;
      
      // Procesar arrays que pueden venir como JSON strings
      let skills = [];
      let educations = [];
      let experiences = [];
      let tags = [];
      
      try {
        // Para skills - procesamiento especial para permitir una habilidad única o múltiples
        if (req.body.skills) {
          if (typeof req.body.skills === 'string') {
            try {
              const parsedSkills = JSON.parse(req.body.skills);
              skills = Array.isArray(parsedSkills) ? parsedSkills : [parsedSkills];
            } catch (e) {
              // Si no es un JSON válido, podría ser una habilidad única como string
              skills = [{ name: req.body.skills, level: 'BEGINNER' }];
            }
          } else if (Array.isArray(req.body.skills)) {
            skills = req.body.skills;
          }
        }
        
        // Para educations (opcionales)
        if (req.body.educations) {
          if (typeof req.body.educations === 'string') {
            try {
              const parsed = JSON.parse(req.body.educations);
              educations = Array.isArray(parsed) ? parsed : [];
            } catch (e) {
              educations = [];
            }
          } else if (Array.isArray(req.body.educations)) {
            educations = req.body.educations;
          }
        }
        
        // Para experiences (opcionales)
        if (req.body.experiences) {
          if (typeof req.body.experiences === 'string') {
            try {
              const parsed = JSON.parse(req.body.experiences);
              experiences = Array.isArray(parsed) ? parsed : [];
            } catch (e) {
              experiences = [];
            }
          } else if (Array.isArray(req.body.experiences)) {
            experiences = req.body.experiences;
          }
        }
        
        // Para tags (opcionales)
        if (req.body.tags) {
          if (typeof req.body.tags === 'string') {
            try {
              const parsed = JSON.parse(req.body.tags);
              tags = Array.isArray(parsed) ? parsed : [];
            } catch (e) {
              // Si es un string simple, podría ser una etiqueta única
              tags = [{ name: req.body.tags }];
            }
          } else if (Array.isArray(req.body.tags)) {
            tags = req.body.tags;
          }
        }
      } catch (error) {
        console.error('Error al procesar arrays:', error);
      }

      // Obtener información del archivo CV
      const cvFile = req.file; 
      const cvData = cvFile ? {
        filename: cvFile.filename,
        originalName: cvFile.originalname,
        path: cvFile.path,
        mimetype: cvFile.mimetype,
        size: cvFile.size
      } : undefined;

      // Preparar datos del candidato
      const candidateData = {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        postalCode,
        country,
        currentPosition,
        currentCompany,
        yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : undefined,
        notes,
        skills,
        educations,
        experiences,
        tags,
        cv: cvData
      };

      // Ejecutar caso de uso
      const candidate = await this.createCandidateUseCase.execute(candidateData);

      res.status(201).json({
        success: true,
        data: candidate.toJSON(),
        message: 'Candidato creado con éxito'
      });
    } catch (error) {
      console.error('Error al crear el candidato:', error);
      
      const err = error as AppError;
      
      // Manejo según el tipo de error (los errores operacionales ya vienen con status code)
      if (err.isOperational) {
        res.status(err.statusCode || 500).json({
          success: false,
          message: err.message,
          code: err.code
        });
      } else {
        // Para errores no controlados, enviamos un mensaje genérico
        res.status(500).json({
          success: false,
          message: 'Error al procesar la solicitud'
        });
      }
    }
  };

  // Método para obtener un candidato por ID
  getById = async (req: Request, res: Response): Promise<void> => {
    // Simplificado para la prueba
    res.status(200).json({ success: true, message: 'Función no implementada' });
  };

  // Método para listar todos los candidatos
  listAll = async (req: Request, res: Response): Promise<void> => {
    // Simplificado para la prueba
    res.status(200).json({ success: true, message: 'Función no implementada' });
  };

  // Método para actualizar un candidato
  update = async (req: Request, res: Response): Promise<void> => {
    // Simplificado para la prueba
    res.status(200).json({ success: true, message: 'Función no implementada' });
  };

  // Método para eliminar un candidato
  delete = async (req: Request, res: Response): Promise<void> => {
    // Simplificado para la prueba
    res.status(200).json({ success: true, message: 'Función no implementada' });
  };
} 