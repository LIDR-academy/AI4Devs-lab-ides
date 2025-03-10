import { Request, Response } from 'express';
import { CandidateService } from '../services/candidateService';
import { CandidateInput } from '../types/candidate';
import path from 'path';

const candidateService = new CandidateService();

/**
 * Controlador para manejar operaciones relacionadas con candidatos
 */
export class CandidateController {
  /**
   * Crea un nuevo candidato
   * @param req Request de Express
   * @param res Response de Express
   */
  async createCandidate(req: Request, res: Response): Promise<void> {
    try {
      const candidateData: CandidateInput = req.body;
      
      // Verificar si el email ya existe
      const emailExists = await candidateService.emailExists(candidateData.email);
      if (emailExists) {
        res.status(400).json({ error: 'El email ya está registrado en el sistema.' });
        return;
      }
      
      // Crear el candidato
      const candidate = await candidateService.createCandidate(candidateData);
      
      // Si hay un archivo CV, guardar su ruta
      if (req.file) {
        const relativePath = path.relative(
          path.join(__dirname, '../../'),
          req.file.path
        );
        
        await candidateService.saveCvFilePath(candidate.id, relativePath);
        
        // Actualizar el objeto candidato con la ruta del CV
        candidate.cvFilePath = relativePath;
      }
      
      res.status(201).json({
        message: 'Candidato creado exitosamente',
        candidate
      });
    } catch (error) {
      console.error('Error al crear candidato:', error);
      res.status(500).json({
        error: 'Error al crear el candidato',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
} 