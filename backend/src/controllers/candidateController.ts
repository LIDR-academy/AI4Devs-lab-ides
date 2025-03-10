import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import path from 'path';
import prisma from '../lib/prisma';
import { CandidateService } from '../services/candidate/candidateService';
import fileStorageService from '../services/fileStorage/fileStorageService';
import { ValidationError } from '../utils/AppError';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Inicializar el servicio con el cliente Prisma
const candidateService = new CandidateService(prisma);

export const createCandidate = async (req: MulterRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array());
    }

    if (!req.body.data) {
      return res.status(400).json({
        status: 'error',
        message: 'No se recibieron datos del candidato'
      });
    }

    try {
      const candidateData = JSON.parse(req.body.data);
      const candidate = await candidateService.createCandidate(candidateData, req.file);

      // Obtener el candidato completo con sus relaciones
      const candidateWithRelations = await candidateService.getCandidateById(candidate.id);

      return res.status(201).json({
        status: 'success',
        data: candidateWithRelations,
        message: 'Candidato creado exitosamente'
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          status: 'error',
          message: error.message
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error en createCandidate controller:', error);
    return next(error);
  }
};

export const getCandidates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const candidates = await candidateService.getCandidates();
    res.json({
      status: 'success',
      data: candidates
    });
  } catch (error) {
    next(error);
  }
};

export const getCandidateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ 
        status: 'error',
        message: 'ID inválido' 
      });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        education: true,
        experience: true
      }
    });
    
    if (!candidate) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Candidato no encontrado' 
      });
    }
    
    return res.json({
      status: 'success',
      data: candidate
    });
  } catch (error) {
    return next(error);
  }
};

export const updateCandidate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ 
        status: 'error',
        message: 'ID inválido' 
      });
    }
    
    // Verificar si existe el candidato
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id }
    });
    
    if (!existingCandidate) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Candidato no encontrado' 
      });
    }
    
    // Procesar datos para actualizar
    const updateData = { ...req.body };
    
    // Procesar archivo si existe
    if (req.file) {
      // Eliminar archivo anterior si existe
      if (existingCandidate.resumeUrl) {
        const oldFilePath = path.join(__dirname, '../..', existingCandidate.resumeUrl);
        try {
          await fileStorageService.deleteFile(oldFilePath);
        } catch (error) {
          console.error('Error al eliminar archivo anterior:', error);
        }
      }
      
      updateData.resumeUrl = `/uploads/${req.file.filename}`;
    }
    
    // Convertir campos JSON si existen
    if (typeof updateData.education === 'string') {
      updateData.education = JSON.parse(updateData.education);
    }
    
    if (typeof updateData.experience === 'string') {
      updateData.experience = JSON.parse(updateData.experience);
    }
    
    // Actualizar candidato
    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: updateData,
      include: {
        education: true,
        experience: true
      }
    });
    
    return res.json({
      status: 'success',
      message: 'Candidato actualizado exitosamente',
      data: updatedCandidate
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteCandidate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ 
        status: 'error',
        message: 'ID inválido' 
      });
    }
    
    // Verificar si existe el candidato
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id }
    });
    
    if (!existingCandidate) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Candidato no encontrado' 
      });
    }
    
    // Eliminar archivo asociado si existe
    if (existingCandidate.resumeUrl) {
      const fileName = existingCandidate.resumeUrl.split('/').pop();
      if (fileName) {
        await fileStorageService.deleteFile(fileName);
      }
    }
    
    // Eliminar candidato de la base de datos
    await prisma.candidate.delete({
      where: { id }
    });
    
    return res.json({
      status: 'success',
      message: 'Candidato eliminado exitosamente'
    });
  } catch (error) {
    return next(error);
  }
};