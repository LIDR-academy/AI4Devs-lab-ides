import { Request, Response, NextFunction } from 'express';
import { CreateCandidateUseCase } from '../../application/useCases/CreateCandidateUseCase';
import { AppError } from '../middlewares/errorHandler';

export class CandidateController {
  constructor(private readonly createCandidateUseCase: CreateCandidateUseCase) {}

  async createCandidate(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('Body:', req.body);  // Para debugging
      console.log('File:', req.file);  // Para debugging

      if (!req.file) {
        throw new AppError(400, 'El archivo CV es requerido');
      }

      const cvUrl = `uploads/${req.file.filename}`; // Crear la URL del CV

      const candidateData = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        correo: req.body.correo,
        telefono: req.body.telefono,
        direccion: req.body.direccion,
        educacion: req.body.educacion,
        experiencia: req.body.experiencia,
        cvUrl: cvUrl // Agregar la URL del CV
      };

      const result = await this.createCandidateUseCase.execute(candidateData);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
} 