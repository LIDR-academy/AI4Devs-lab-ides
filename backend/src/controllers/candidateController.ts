import { Request, Response } from 'express';
import prisma from '../index';
import path from 'path';
import fs from 'fs';

/**
 * Crear un nuevo candidato
 */
export const createCandidate = async (req: Request, res: Response) => {
  try {
    const candidate = await prisma.candidate.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone || null,
        address: req.body.address || null,
        education: req.body.education || null,
        workExperience: req.body.workExperience || null,
        resumeUrl: req.body.resumeUrl || null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Candidato creado exitosamente',
      data: candidate
    });
  } catch (error: any) {
    // Si hay un error y se subió un archivo, eliminarlo
    if (req.body.resumeUrl && req.file) {
      const filePath = path.join(__dirname, '..', '..', req.body.resumeUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear el candidato',
      error: error.message
    });
  }
};

/**
 * Obtener todos los candidatos
 */
export const getAllCandidates = async (req: Request, res: Response) => {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      message: 'Candidatos recuperados exitosamente',
      data: candidates
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al recuperar los candidatos',
      error: error.message
    });
  }
};

/**
 * Obtener un candidato por ID
 */
export const getCandidateById = async (req: Request, res: Response) => {
  try {
    const candidate = await prisma.candidate.findUnique({
      where: {
        id: Number(req.params.id)
      }
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidato no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Candidato recuperado exitosamente',
      data: candidate
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al recuperar el candidato',
      error: error.message
    });
  }
};

/**
 * Actualizar un candidato
 */
export const updateCandidate = async (req: Request, res: Response) => {
  try {
    // Verificar si el candidato existe
    const existingCandidate = await prisma.candidate.findUnique({
      where: {
        id: Number(req.params.id)
      }
    });

    if (!existingCandidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidato no encontrado'
      });
    }

    // Si se subió un nuevo archivo y ya existía uno, eliminarlo
    let oldResumeUrl = existingCandidate.resumeUrl;
    if (req.body.resumeUrl && oldResumeUrl) {
      const oldFilePath = path.join(__dirname, '..', '..', oldResumeUrl);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Actualizar el candidato
    const updatedCandidate = await prisma.candidate.update({
      where: {
        id: Number(req.params.id)
      },
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone || null,
        address: req.body.address || null,
        education: req.body.education || null,
        workExperience: req.body.workExperience || null,
        resumeUrl: req.body.resumeUrl || oldResumeUrl
      }
    });

    res.status(200).json({
      success: true,
      message: 'Candidato actualizado exitosamente',
      data: updatedCandidate
    });
  } catch (error: any) {
    // Si hay un error y se subió un archivo, eliminarlo
    if (req.body.resumeUrl && req.file) {
      const filePath = path.join(__dirname, '..', '..', req.body.resumeUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar el candidato',
      error: error.message
    });
  }
};

/**
 * Eliminar un candidato
 */
export const deleteCandidate = async (req: Request, res: Response) => {
  try {
    // Verificar si el candidato existe
    const existingCandidate = await prisma.candidate.findUnique({
      where: {
        id: Number(req.params.id)
      }
    });

    if (!existingCandidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidato no encontrado'
      });
    }

    // Eliminar el archivo de CV si existe
    if (existingCandidate.resumeUrl) {
      const filePath = path.join(__dirname, '..', '..', existingCandidate.resumeUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Eliminar el candidato
    await prisma.candidate.delete({
      where: {
        id: Number(req.params.id)
      }
    });

    res.status(200).json({
      success: true,
      message: 'Candidato eliminado exitosamente'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el candidato',
      error: error.message
    });
  }
}; 