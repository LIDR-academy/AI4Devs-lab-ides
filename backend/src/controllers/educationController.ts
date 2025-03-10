import { Request, Response, NextFunction } from 'express';
import { EducationService } from '../services/educationService';

/**
 * Controlador para la gestión de educación de candidatos
 */
export class EducationController {
  private educationService: EducationService;

  constructor() {
    this.educationService = new EducationService();
  }

  /**
   * Obtener todos los registros de educación de un candidato
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  async getEducationByCandidateId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidateId = parseInt(req.params.candidateId);
      const education = await this.educationService.getEducationByCandidateId(candidateId);

      res.status(200).json({
        success: true,
        data: education
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al obtener registros de educación'
      });
    }
  }

  /**
   * Obtener un registro de educación por ID
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  async getEducationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const education = await this.educationService.getEducationById(id);

      if (!education) {
        res.status(404).json({
          success: false,
          message: 'Registro de educación no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: education
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al obtener registro de educación'
      });
    }
  }

  /**
   * Crear un nuevo registro de educación para un candidato
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  async createEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Obtener candidateId de los parámetros o del cuerpo de la solicitud
      const candidateIdParam = req.params.candidateId ? parseInt(req.params.candidateId) : undefined;
      const candidateIdBody = req.body.candidateId;
      const candidateId = candidateIdParam || candidateIdBody;

      if (!candidateId) {
        res.status(400).json({
          success: false,
          message: 'ID de candidato es requerido'
        });
        return;
      }

      const { institution, degree, fieldOfStudy, startDate, endDate, description } = req.body;

      // Validar campos obligatorios
      if (!institution || !degree || !fieldOfStudy || !startDate) {
        res.status(400).json({
          success: false,
          message: 'Campos obligatorios faltantes'
        });
        return;
      }

      // Si todos los datos están en el cuerpo, usar directamente
      if (req.body.institution && req.body.degree && req.body.fieldOfStudy && req.body.startDate) {
        const education = await this.educationService.createEducation(req.body);
        
        res.status(201).json({
          success: true,
          message: 'Educación creada exitosamente',
          data: education
        });
        return;
      }

      // Método anterior para compatibilidad
      const education = await this.educationService.createEducation({
        candidateId,
        institution,
        degree,
        fieldOfStudy,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description
      });

      res.status(201).json({
        success: true,
        message: 'Educación creada exitosamente',
        data: education
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al crear registro de educación'
      });
    }
  }

  /**
   * Actualizar un registro de educación
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  async updateEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { institution, degree, fieldOfStudy, startDate, endDate, description } = req.body;

      const education = await this.educationService.updateEducation(id, {
        institution,
        degree,
        fieldOfStudy,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        description
      });

      if (!education) {
        res.status(404).json({
          success: false,
          message: 'Registro de educación no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: education
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al actualizar registro de educación'
      });
    }
  }

  /**
   * Eliminar un registro de educación
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  async deleteEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.educationService.deleteEducation(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Registro de educación no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Registro de educación eliminado correctamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al eliminar registro de educación'
      });
    }
  }
} 