import { Request, Response, NextFunction } from 'express';
import { WorkExperienceService, CreateWorkExperienceData } from '../services/workExperienceService';

/**
 * Controlador para la gestión de experiencia laboral de candidatos
 */
export class WorkExperienceController {
  private workExperienceService: WorkExperienceService;

  constructor() {
    this.workExperienceService = new WorkExperienceService();
  }

  /**
   * Obtener todos los registros de experiencia laboral de un candidato
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  async getWorkExperienceByCandidateId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidateId = parseInt(req.params.candidateId);
      if (isNaN(candidateId)) {
        res.status(400).json({
          success: false,
          message: 'ID de candidato inválido'
        });
        return;
      }

      const workExperience = await this.workExperienceService.getWorkExperienceByCandidateId(candidateId);
      res.status(200).json({
        success: true,
        data: workExperience
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener experiencia laboral del candidato'
      });
    }
  }

  /**
   * Obtener un registro de experiencia laboral por ID
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  async getWorkExperienceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID de experiencia laboral inválido'
        });
        return;
      }

      const workExperience = await this.workExperienceService.getWorkExperienceById(id);
      if (!workExperience) {
        res.status(404).json({
          success: false,
          message: 'Registro de experiencia laboral no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: workExperience
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener registro de experiencia laboral'
      });
    }
  }

  /**
   * Crear un nuevo registro de experiencia laboral para un candidato
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  async createWorkExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidateId = parseInt(req.params.candidateId);
      if (isNaN(candidateId)) {
        res.status(400).json({
          success: false,
          message: 'ID de candidato inválido'
        });
        return;
      }

      const workExperienceData: CreateWorkExperienceData = req.body;
      const newWorkExperience = await this.workExperienceService.createWorkExperience(candidateId, workExperienceData);
      
      res.status(201).json({
        success: true,
        message: 'Registro de experiencia laboral creado exitosamente',
        data: newWorkExperience
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear registro de experiencia laboral'
      });
    }
  }

  /**
   * Actualizar un registro de experiencia laboral
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  async updateWorkExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID de experiencia laboral inválido'
        });
        return;
      }

      const workExperienceData: CreateWorkExperienceData = req.body;
      const updatedWorkExperience = await this.workExperienceService.updateWorkExperience(id, workExperienceData);
      
      if (!updatedWorkExperience) {
        res.status(404).json({
          success: false,
          message: 'Registro de experiencia laboral no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Registro de experiencia laboral actualizado exitosamente',
        data: updatedWorkExperience
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar registro de experiencia laboral'
      });
    }
  }

  /**
   * Eliminar un registro de experiencia laboral
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  async deleteWorkExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID de experiencia laboral inválido'
        });
        return;
      }

      await this.workExperienceService.deleteWorkExperience(id);
      
      res.status(200).json({
        success: true,
        message: 'Registro de experiencia laboral eliminado exitosamente'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar registro de experiencia laboral'
      });
    }
  }
} 