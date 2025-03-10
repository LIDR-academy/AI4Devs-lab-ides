import { Request, Response, NextFunction } from 'express';
import { CandidateService } from '../services/candidateService';
import { FileUploadService } from '../services/fileUploadService';
import { ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import { CreateCandidateData, UpdateCandidateData } from '../dtos/candidateDto';
import { createError } from '../middleware/errorHandler';
import multer from 'multer';

// Extender la interfaz Request para incluir la propiedad file de Multer
interface MulterRequest extends Request {
  file?: multer.File;
}

/**
 * Controlador para la gestión de candidatos
 */
export class CandidateController {
  private candidateService: CandidateService;
  private fileUploadService: FileUploadService;

  constructor() {
    this.candidateService = new CandidateService();
    this.fileUploadService = new FileUploadService();
  }

  /**
   * Crear un nuevo candidato
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  async createCandidate(req: MulterRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidateData: CreateCandidateData = req.body;
      
      // Manejar el archivo CV si existe
      let file: any = undefined;
      if (req.file) {
        file = req.file;
      }

      const newCandidate = await this.candidateService.createCandidate(candidateData, file);
      res.status(201).json({
        success: true,
        message: 'Candidato creado exitosamente',
        data: newCandidate
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear candidato'
      });
    }
  }

  /**
   * Obtener todos los candidatos
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  async getAllCandidates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidates = await this.candidateService.getAllCandidates();
      res.status(200).json({
        success: true,
        data: candidates
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener candidatos'
      });
    }
  }

  /**
   * Obtener un candidato por ID
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  async getCandidateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID de candidato inválido'
        });
        return;
      }

      const candidate = await this.candidateService.getCandidateById(id);
      if (!candidate) {
        res.status(404).json({
          success: false,
          message: 'Candidato no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: candidate
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener candidato'
      });
    }
  }

  /**
   * Actualizar un candidato
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  async updateCandidate(req: MulterRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID de candidato inválido'
        });
        return;
      }

      const candidateData: UpdateCandidateData = req.body;
      
      // Manejar el archivo CV si existe
      let file: any = undefined;
      if (req.file) {
        file = req.file;
      }

      const updatedCandidate = await this.candidateService.updateCandidate(id, candidateData, file);
      if (!updatedCandidate) {
        res.status(404).json({
          success: false,
          message: 'Candidato no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Candidato actualizado exitosamente',
        data: updatedCandidate
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar candidato'
      });
    }
  }

  /**
   * Eliminar un candidato
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  async deleteCandidate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID de candidato inválido'
        });
        return;
      }

      await this.candidateService.deleteCandidate(id);
      res.status(200).json({
        success: true,
        message: 'Candidato eliminado exitosamente'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar candidato'
      });
    }
  }
} 