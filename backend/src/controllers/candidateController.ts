import { Request, Response } from 'express';
import prisma from '../utils/prismaClient';
import path from 'path';
import fs from 'fs';

/**
 * Create a new candidate
 * @route POST /candidatos
 */
export const createCandidate = async (req: Request, res: Response) => {
  try {
    const { 
      nombre, 
      apellido, 
      email, 
      telefono, 
      direccion, 
      educacion, 
      experiencia 
    } = req.body;

    // Handle file upload if present
    let cv_path = null;
    if (req.file) {
      // Get relative path for storage in database
      cv_path = path.relative(
        path.join(__dirname, '../..'), 
        req.file.path
      );
    }

    // Create candidate in database
    const candidate = await prisma.candidate.create({
      data: {
        nombre,
        apellido,
        email,
        telefono: telefono || null,
        direccion: direccion || null,
        educacion,
        experiencia,
        cv_path: cv_path || null
      }
    });

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Candidato creado exitosamente',
      data: {
        id: candidate.id,
        nombre: candidate.nombre,
        apellido: candidate.apellido,
        email: candidate.email
      }
    });
  } catch (error) {
    console.error('Error al crear candidato:', error);
    
    // If there was a file uploaded but database operation failed, delete the file
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error al eliminar archivo:', unlinkError);
      }
    }

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed on the fields: (`email`)')) {
        return res.status(409).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}; 