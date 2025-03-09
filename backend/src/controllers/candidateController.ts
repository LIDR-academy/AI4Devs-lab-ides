import { Request, Response, NextFunction } from 'express';
import candidateService from '../services/candidateService';
import { candidateSchema } from '../utils/validation';
import logger from '../config/logger';
import { AppError } from '../middlewares/errorHandler';

/**
 * Controlador para manejar las operaciones relacionadas con candidatos
 */
export class CandidateController {
  /**
   * Crea un nuevo candidato
   */
  async createCandidate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('Solicitud recibida para crear candidato');
      
      // Extraer datos del cuerpo de la solicitud
      const candidateData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address || '',
        education: JSON.parse(req.body.education || '[]'),
        workExperience: JSON.parse(req.body.workExperience || '[]'),
        cvFilePath: req.file ? req.file.path : undefined
      };
      
      // Validar datos con Joi
      const { error } = candidateSchema.validate(candidateData, { abortEarly: false });
      
      if (error) {
        // Formatear errores de validación
        const errors: Record<string, string[]> = {};
        
        error.details.forEach(detail => {
          const key = detail.path.join('.');
          if (!errors[key]) {
            errors[key] = [];
          }
          errors[key].push(detail.message);
        });
        
        // Eliminar el archivo CV si existe y hay errores
        if (req.file) {
          await candidateService.deleteCV(req.file.path);
        }
        
        const validationError: AppError = new Error('Error de validación');
        validationError.statusCode = 400;
        validationError.errors = errors;
        throw validationError;
      }
      
      // Crear candidato
      const candidate = await candidateService.createCandidate(candidateData);
      
      // Enviar respuesta
      res.status(201).json({
        success: true,
        message: 'Candidato creado exitosamente',
        data: candidate
      });
    } catch (error) {
      // Eliminar el archivo CV si existe y hay errores
      if (req.file) {
        await candidateService.deleteCV(req.file.path);
      }
      
      next(error);
    }
  }
  
  /**
   * Obtiene los candidatos recientes
   */
  async getRecentCandidates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Obtener el límite de candidatos a mostrar (por defecto 3)
      const limit = parseInt(req.query.limit as string) || 3;
      
      // Validar el límite
      if (limit < 1 || limit > 10) {
        const error: AppError = new Error('El límite debe estar entre 1 y 10');
        error.statusCode = 400;
        throw error;
      }
      
      // Obtener candidatos recientes
      const candidates = await candidateService.getRecentCandidates(limit);
      
      // Enviar respuesta
      res.status(200).json({
        success: true,
        data: candidates
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Obtiene todos los candidatos con paginación
   */
  async getAllCandidates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extraer parámetros de paginación de la consulta
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Validar parámetros de paginación
      if (page < 1 || limit < 1 || limit > 100) {
        const error: AppError = new Error('Parámetros de paginación inválidos');
        error.statusCode = 400;
        throw error;
      }
      
      // Obtener candidatos
      const result = await candidateService.getAllCandidates(page, limit);
      
      // Enviar respuesta
      res.status(200).json({
        success: true,
        data: result.candidates,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Obtiene un candidato por su ID
   */
  async getCandidateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        const error: AppError = new Error('ID de candidato inválido');
        error.statusCode = 400;
        throw error;
      }
      
      const candidate = await candidateService.getCandidateById(id);
      
      if (!candidate) {
        const error: AppError = new Error('Candidato no encontrado');
        error.statusCode = 404;
        throw error;
      }
      
      // Eliminar datos sensibles antes de enviar la respuesta
      const { cvFilePath, ...candidateData } = candidate;
      
      res.status(200).json({
        success: true,
        data: candidateData
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CandidateController(); 