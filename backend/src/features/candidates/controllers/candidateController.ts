import { Request, Response } from 'express';
import { CandidateService } from '../services/candidateService';
import { AppError } from '../../../utils/AppError';
import { validateBody, validateParams, validateQuery } from '../../../middlewares/zodValidationMiddleware';
import { 
  createCandidateSchema, 
  updateCandidateSchema, 
  searchCandidateSchema 
} from '../../../schemas/candidateSchema';
import { z } from 'zod';
import { generatePaginationLinks } from '../../../utils/paginationUtils';

/**
 * Controlador para manejar las operaciones de candidatos
 */
export class CandidateController {
  private candidateService: CandidateService;

  constructor() {
    this.candidateService = new CandidateService();
  }

  /**
   * Validador para el ID de candidato
   */
  static validateCandidateId = validateParams(
    z.object({
      id: z.string().refine(
        (val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0,
        { message: 'El ID debe ser un número entero positivo' }
      ),
    })
  );

  /**
   * Validador para la creación de candidatos
   */
  static validateCreateCandidate = validateBody(createCandidateSchema);

  /**
   * Validador para la actualización de candidatos
   */
  static validateUpdateCandidate = validateBody(updateCandidateSchema);

  /**
   * Validador para la búsqueda de candidatos
   */
  static validateSearchCandidates = validateQuery(searchCandidateSchema);

  /**
   * Validador para la búsqueda de habilidades
   */
  static validateSearchSkills = validateQuery(
    z.object({
      query: z.string().min(1, { message: 'El término de búsqueda es obligatorio' }),
    })
  );

  /**
   * Obtiene todos los candidatos con paginación y filtros
   */
  async getAllCandidates(req: Request, res: Response) {
    try {
      const searchParams = req.query;
      
      // Verificar que req.pagination existe
      if (!req.pagination) {
        throw new AppError('Error de configuración: middleware de paginación no aplicado', 500);
      }
      
      const result = await this.candidateService.getAllCandidates(searchParams, req.pagination);

      if (!result.success || !result.data) {
        return res.status(result.statusCode).json({
          success: false,
          error: result.error || 'Error al obtener los candidatos',
        });
      }

      // Generar enlaces de paginación para la cabecera Link
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
      const linkHeader = generatePaginationLinks(baseUrl, result.data.pagination);
      
      // Establecer cabeceras de paginación
      res.setHeader('Link', linkHeader);
      res.setHeader('X-Total-Count', result.data.pagination.total.toString());
      res.setHeader('X-Total-Pages', result.data.pagination.totalPages.toString());
      res.setHeader('X-Current-Page', result.data.pagination.page.toString());
      res.setHeader('X-Page-Limit', result.data.pagination.limit.toString());

      return res.status(200).json(result.data);
    } catch (error) {
      console.error('Error en getAllCandidates:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
          code: error.errorCode,
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  /**
   * Obtiene un candidato por su ID
   */
  async getCandidateById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      
      const result = await this.candidateService.getCandidateById(id);

      if (!result.success) {
        return res.status(result.statusCode).json({
          success: false,
          error: result.error,
        });
      }

      return res.status(200).json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      console.error('Error en getCandidateById:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
          code: error.errorCode,
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  /**
   * Crea un nuevo candidato
   */
  async createCandidate(req: Request, res: Response) {
    try {
      const candidateData = req.body;
      
      // Obtener el ID del usuario autenticado
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no autenticado',
          code: 'UNAUTHORIZED'
        });
      }
      
      const result = await this.candidateService.createCandidate({
        ...candidateData,
        recruiterId: userId
      });

      if (!result.success) {
        return res.status(result.statusCode).json({
          success: false,
          error: result.error,
        });
      }

      return res.status(201).json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      console.error('Error en createCandidate:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
          code: error.errorCode,
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  /**
   * Actualiza un candidato existente
   */
  async updateCandidate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const candidateData = req.body;
      
      const result = await this.candidateService.updateCandidate(id, candidateData);

      if (!result.success) {
        return res.status(result.statusCode).json({
          success: false,
          error: result.error,
        });
      }

      return res.status(200).json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      console.error('Error en updateCandidate:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
          code: error.errorCode,
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  /**
   * Elimina un candidato
   */
  async deleteCandidate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      
      const result = await this.candidateService.deleteCandidate(id);

      if (!result.success) {
        return res.status(result.statusCode).json({
          success: false,
          error: result.error,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Candidato eliminado correctamente',
      });
    } catch (error) {
      console.error('Error en deleteCandidate:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
          code: error.errorCode,
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  /**
   * Busca habilidades que coincidan con un término de búsqueda
   * @param req Solicitud HTTP
   * @param res Respuesta HTTP
   */
  searchSkills = async (req: Request, res: Response) => {
    try {
      const { query } = req.query as { query: string };
      
      const result = await this.candidateService.searchSkills(query);
      
      if (!result.success) {
        throw new AppError(result.error || 'Error al buscar habilidades', result.statusCode || 500);
      }
      
      return res.status(result.statusCode).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message
        });
      }
      
      console.error('Error al buscar habilidades:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  };
} 