import { Request, Response } from 'express';
import { candidateService } from '../services/candidateService';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Express } from 'express';

// Extender el tipo Request para incluir el archivo
interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

// Directorio para almacenar los archivos CV
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Asegurarse de que el directorio de uploads exista
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const candidateController = {
  // Crear un nuevo candidato
  createCandidate: async (req: RequestWithFile, res: Response): Promise<void> => {
    try {
      const candidateData = req.body;
      
      console.log('Datos recibidos del candidato:', JSON.stringify(candidateData, null, 2));
      console.log('Headers de la solicitud:', req.headers);
      console.log('Archivo recibido:', req.file);
      
      // Asegurarse de que los campos requeridos estén presentes
      if (!candidateData.firstName || !candidateData.lastName || !candidateData.email) {
        res.status(400).json({
          message: 'Faltan campos requeridos',
          errors: [
            { field: 'firstName', message: candidateData.firstName ? '' : 'El nombre es requerido' },
            { field: 'lastName', message: candidateData.lastName ? '' : 'El apellido es requerido' },
            { field: 'email', message: candidateData.email ? '' : 'El email es requerido' }
          ].filter(error => error.message)
        });
        return;
      }
      
      // Manejar la carga del archivo CV si existe
      if (req.file) {
        const fileExtension = path.extname(req.file.originalname);
        const fileName = `${uuidv4()}${fileExtension}`;
        const filePath = path.join(UPLOAD_DIR, fileName);
        
        // Asegurarse de que el directorio existe
        if (!fs.existsSync(UPLOAD_DIR)) {
          fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }
        
        // Guardar el archivo
        fs.writeFileSync(filePath, req.file.buffer);
        
        // Añadir información del archivo al candidato
        candidateData.cvFilePath = `/uploads/${fileName}`;
        candidateData.cvFileType = req.file.mimetype;
        candidateData.cvUploadedAt = new Date();
      }
      
      // Convertir fechas en los arrays de educación y experiencia
      if (candidateData.education && Array.isArray(candidateData.education)) {
        candidateData.education = candidateData.education.map((edu: any) => ({
          ...edu,
          startDate: new Date(edu.startDate),
          endDate: edu.endDate ? new Date(edu.endDate) : null
        }));
      }
      
      if (candidateData.experience && Array.isArray(candidateData.experience)) {
        candidateData.experience = candidateData.experience.map((exp: any) => ({
          ...exp,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : null
        }));
      }
      
      const candidate = await candidateService.createCandidate(candidateData);
      res.status(201).json({
        success: true,
        message: 'Candidato añadido exitosamente',
        data: candidate
      });
    } catch (error) {
      console.error('Error al crear candidato:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear el candidato',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  },

  // Obtener todos los candidatos
  getAllCandidates: async (_req: Request, res: Response): Promise<void> => {
    try {
      const candidates = await candidateService.getAllCandidates();
      res.status(200).json({
        success: true,
        data: candidates
      });
    } catch (error) {
      console.error('Error al obtener candidatos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los candidatos',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  },

  // Obtener un candidato por ID
  getCandidateById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const candidate = await candidateService.getCandidateById(id);
      
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
    } catch (error) {
      console.error('Error al obtener candidato:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el candidato',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  },

  // Actualizar un candidato
  updateCandidate: async (req: RequestWithFile, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const candidateData = req.body;
      
      console.log('Datos recibidos del candidato:', JSON.stringify(candidateData, null, 2));
      
      // Asegurarse de que los campos requeridos estén presentes
      if (!candidateData.firstName || !candidateData.lastName || !candidateData.email) {
        res.status(400).json({
          message: 'Faltan campos requeridos',
          errors: [
            { field: 'firstName', message: candidateData.firstName ? '' : 'El nombre es requerido' },
            { field: 'lastName', message: candidateData.lastName ? '' : 'El apellido es requerido' },
            { field: 'email', message: candidateData.email ? '' : 'El email es requerido' }
          ].filter(error => error.message)
        });
        return;
      }
      
      // Manejar la actualización del archivo CV si existe
      if (req.file) {
        const fileExtension = path.extname(req.file.originalname);
        const fileName = `${uuidv4()}${fileExtension}`;
        const filePath = path.join(UPLOAD_DIR, fileName);
        
        // Asegurarse de que el directorio existe
        if (!fs.existsSync(UPLOAD_DIR)) {
          fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }
        
        // Guardar el nuevo archivo
        fs.writeFileSync(filePath, req.file.buffer);
        
        // Añadir información del archivo al candidato
        candidateData.cvFilePath = `/uploads/${fileName}`;
        candidateData.cvFileType = req.file.mimetype;
        candidateData.cvUploadedAt = new Date();
        
        // Obtener el candidato actual para eliminar el archivo anterior si existe
        const currentCandidate = await candidateService.getCandidateById(id);
        if (currentCandidate?.cvFilePath) {
          const oldFilePath = path.join(__dirname, '..', '..', currentCandidate.cvFilePath);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
      }
      
      // Convertir fechas en los arrays de educación y experiencia
      if (candidateData.education && Array.isArray(candidateData.education)) {
        candidateData.education = candidateData.education.map((edu: any) => ({
          ...edu,
          startDate: new Date(edu.startDate),
          endDate: edu.endDate ? new Date(edu.endDate) : null
        }));
      }
      
      if (candidateData.experience && Array.isArray(candidateData.experience)) {
        candidateData.experience = candidateData.experience.map((exp: any) => ({
          ...exp,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : null
        }));
      }
      
      const candidate = await candidateService.updateCandidate(id, candidateData);
      res.status(200).json({
        success: true,
        message: 'Candidato actualizado exitosamente',
        data: candidate
      });
    } catch (error) {
      console.error('Error al actualizar candidato:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el candidato',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  },

  // Eliminar un candidato
  deleteCandidate: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      // Obtener el candidato para eliminar el archivo CV si existe
      const candidate = await candidateService.getCandidateById(id);
      if (candidate?.cvFilePath) {
        const filePath = path.join(__dirname, '..', '..', candidate.cvFilePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      await candidateService.deleteCandidate(id);
      res.status(200).json({
        success: true,
        message: 'Candidato eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar candidato:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el candidato',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
};
