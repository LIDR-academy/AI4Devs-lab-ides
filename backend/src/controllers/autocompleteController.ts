import { Request, Response, NextFunction } from 'express';
import { AutocompleteService } from '../services/autocompleteService';

/**
 * Controlador para la gestión de autocompletado
 */
export class AutocompleteController {
  private autocompleteService: AutocompleteService;

  constructor() {
    this.autocompleteService = new AutocompleteService();
  }

  /**
   * Buscar instituciones educativas
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  async searchInstitutions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query.query as string || '';
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const institutions = await this.autocompleteService.searchInstitutions(query, limit);
      res.status(200).json({
        success: true,
        data: institutions
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al buscar instituciones'
      });
    }
  }

  /**
   * Buscar empresas
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  async searchCompanies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query.query as string || '';
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const companies = await this.autocompleteService.searchCompanies(query, limit);
      res.status(200).json({
        success: true,
        data: companies
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al buscar empresas'
      });
    }
  }

  /**
   * Buscar títulos académicos
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  async searchDegrees(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query.query as string || '';
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const degrees = await this.autocompleteService.searchDegrees(query, limit);
      res.status(200).json({
        success: true,
        data: degrees
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al buscar títulos académicos'
      });
    }
  }

  /**
   * Buscar posiciones laborales
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  async searchPositions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query.query as string || '';
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const positions = await this.autocompleteService.searchPositions(query, limit);
      res.status(200).json({
        success: true,
        data: positions
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al buscar posiciones laborales'
      });
    }
  }
} 