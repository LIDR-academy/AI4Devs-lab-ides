import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AppError } from '../../../utils/AppError';
import { generatePaginationLinks } from '../../../utils/paginationUtils';

/**
 * Controlador para manejar las operaciones de usuarios
 */
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Obtiene todos los usuarios con paginación y filtros
   */
  async getAllUsers(req: Request, res: Response) {
    try {
      const searchParams = req.query;
      
      // Verificar que req.pagination existe
      if (!req.pagination) {
        throw new AppError('Error de configuración: middleware de paginación no aplicado', 500);
      }
      
      const result = await this.userService.getAllUsers(searchParams, req.pagination);

      if (!result.success || !result.data) {
        return res.status(result.statusCode).json({
          success: false,
          error: result.error || 'Error al obtener los usuarios',
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
      console.error('Error en getAllUsers:', error);
      
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
   * Obtiene un usuario por su ID
   */
  async getUserById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      
      const result = await this.userService.getUserById(id);

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
      console.error('Error en getUserById:', error);
      
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
} 