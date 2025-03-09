import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { candidateService } from '../services/candidateService';
import { CandidateCreateInput } from '../types/candidate';
import { createError } from '../middlewares/errorHandler';

export const candidateController = {
  // Crear un nuevo candidato
  createCandidate: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Datos recibidos:', req.body);
      console.log('Archivo recibido:', req.file);
      
      // Validar que los campos requeridos estén presentes
      if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.phone || !req.body.address) {
        throw createError('Faltan campos obligatorios', 400);
      }
      
      // Validar que education y experience sean JSON válidos
      let education, experience;
      try {
        education = JSON.parse(req.body.education);
        experience = JSON.parse(req.body.experience);
      } catch (error) {
        console.error('Error al parsear JSON:', error);
        throw createError('Los campos education y experience deben ser JSON válidos', 400);
      }
      
      // Preparar los datos del candidato
      const candidateData: CandidateCreateInput = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        education,
        experience,
        cv: req.file
      };
      
      // Crear el candidato
      const candidate = await candidateService.createCandidate(candidateData);
      
      // Enviar respuesta
      res.status(201).json({
        success: true,
        data: candidate,
        message: 'Candidato creado exitosamente'
      });
    } catch (error) {
      console.error('Error en createCandidate:', error);
      next(error);
    }
  }),
  
  // Obtener todos los candidatos
  getCandidates: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidates = await candidateService.getCandidates();
      
      res.status(200).json({
        success: true,
        data: candidates,
        count: candidates.length
      });
    } catch (error) {
      next(error);
    }
  }),
  
  // Obtener un candidato por ID
  getCandidateById: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID de candidato inválido'
        });
        return;
      }
      
      const candidate = await candidateService.getCandidateById(id);
      
      res.status(200).json({
        success: true,
        data: candidate
      });
    } catch (error) {
      next(error);
    }
  })
}; 