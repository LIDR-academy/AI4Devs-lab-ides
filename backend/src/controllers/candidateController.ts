import { Request, Response, NextFunction } from 'express';
import { CandidateService } from '../services/candidateService';
import { CreateCandidateData, UpdateCandidateData } from '../repositories/candidateRepository';
import { createError } from '../middleware/errorHandler';

/**
 * Controlador para la gestión de candidatos
 */
export class CandidateController {
  private candidateService: CandidateService;

  constructor() {
    this.candidateService = new CandidateService();
  }

  /**
   * Crear un nuevo candidato
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  createCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar datos de entrada
      const { firstName, lastName, email, phone, address, education, workExperience } = req.body;

      if (!firstName || !lastName || !email) {
        return next(createError('Los campos nombre, apellido y email son obligatorios', 400, 'VALIDATION_ERROR'));
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return next(createError('El formato del email no es válido', 400, 'VALIDATION_ERROR'));
      }

      // Crear candidato
      const candidateData: CreateCandidateData = {
        firstName,
        lastName,
        email,
        phone,
        address,
        education,
        workExperience
      };

      const candidate = await this.candidateService.createCandidate(req, candidateData);

      // Responder con el candidato creado
      res.status(201).json({
        success: true,
        data: candidate
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtener todos los candidatos
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  getAllCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidates = await this.candidateService.getAllCandidates();

      res.status(200).json({
        success: true,
        data: candidates
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtener un candidato por ID
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  getCandidateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return next(createError('ID de candidato inválido', 400, 'VALIDATION_ERROR'));
      }

      const candidate = await this.candidateService.getCandidateById(id);

      res.status(200).json({
        success: true,
        data: candidate
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Actualizar un candidato
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  updateCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return next(createError('ID de candidato inválido', 400, 'VALIDATION_ERROR'));
      }

      const { firstName, lastName, email, phone, address, education, workExperience } = req.body;

      // Validar formato de email si se proporciona
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return next(createError('El formato del email no es válido', 400, 'VALIDATION_ERROR'));
        }
      }

      // Actualizar candidato
      const candidateData: UpdateCandidateData = {};
      
      if (firstName !== undefined) candidateData.firstName = firstName;
      if (lastName !== undefined) candidateData.lastName = lastName;
      if (email !== undefined) candidateData.email = email;
      if (phone !== undefined) candidateData.phone = phone;
      if (address !== undefined) candidateData.address = address;
      if (education !== undefined) candidateData.education = education;
      if (workExperience !== undefined) candidateData.workExperience = workExperience;

      const candidate = await this.candidateService.updateCandidate(req, id, candidateData);

      res.status(200).json({
        success: true,
        data: candidate
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Eliminar un candidato
   * @param req Objeto Request de Express
   * @param res Objeto Response de Express
   * @param next Función NextFunction de Express
   */
  deleteCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return next(createError('ID de candidato inválido', 400, 'VALIDATION_ERROR'));
      }

      await this.candidateService.deleteCandidate(id);

      res.status(200).json({
        success: true,
        message: 'Candidato eliminado correctamente'
      });
    } catch (error) {
      next(error);
    }
  };
} 