import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middlewares/error.middleware';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Get all candidates
export const getAllCandidates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        selectionProcesses: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      results: candidates.length,
      data: {
        candidates,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single candidate
export const getCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        selectionProcesses: {
          include: {
            stages: true,
          },
        },
      },
    });

    if (!candidate) {
      return next(new AppError('No candidate found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        candidate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create a new candidate
export const createCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      education,
      workExperience,
      skills,
      notes,
    } = req.body;

    // Check if candidate with this email already exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { email },
    });

    if (existingCandidate) {
      return next(new AppError('Candidate with this email already exists', 400));
    }

    // Datos para el CV si se ha subido un archivo
    const cvData = req.file ? {
      cvFilename: req.file.originalname,
      cvFileUrl: req.file.path,
      cvFileType: req.file.mimetype,
      cvUploadedAt: new Date(),
    } : {};

    // Create new candidate
    const newCandidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        education,
        workExperience,
        skills,
        notes,
        createdById: req.user.id,
        ...cvData,
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        candidate: newCandidate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update a candidate
export const updateCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      education,
      workExperience,
      skills,
      notes,
      status,
    } = req.body;

    // Check if candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id },
    });

    if (!candidate) {
      return next(new AppError('No candidate found with that ID', 404));
    }

    // If email is being updated, check if it's already in use
    if (email && email !== candidate.email) {
      const existingCandidate = await prisma.candidate.findUnique({
        where: { email },
      });

      if (existingCandidate) {
        return next(new AppError('Candidate with this email already exists', 400));
      }
    }

    // Datos para el CV si se ha subido un archivo nuevo
    const cvData = req.file ? {
      cvFilename: req.file.originalname,
      cvFileUrl: req.file.path,
      cvFileType: req.file.mimetype,
      cvUploadedAt: new Date(),
    } : {};

    // Si hay un archivo nuevo y ya existía uno anterior, eliminar el archivo anterior
    if (req.file && candidate.cvFileUrl) {
      try {
        fs.unlinkSync(candidate.cvFileUrl);
      } catch (err) {
        console.error('Error deleting old CV file:', err);
      }
    }

    // Update candidate
    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        education,
        workExperience,
        skills,
        notes,
        status,
        ...cvData,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        candidate: updatedCandidate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete a candidate
export const deleteCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        selectionProcesses: true,
      },
    });

    if (!candidate) {
      return next(new AppError('No candidate found with that ID', 404));
    }

    // Check if candidate has selection processes
    if (candidate.selectionProcesses.length > 0) {
      return next(
        new AppError(
          'Cannot delete candidate with active selection processes',
          400
        )
      );
    }

    // Si el candidato tiene un CV, eliminar el archivo
    if (candidate.cvFileUrl) {
      try {
        fs.unlinkSync(candidate.cvFileUrl);
      } catch (err) {
        console.error('Error deleting CV file:', err);
      }
    }

    // Delete candidate
    await prisma.candidate.delete({
      where: { id },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Download CV
export const downloadCV = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id },
    });

    if (!candidate) {
      return next(new AppError('No candidate found with that ID', 404));
    }

    // Check if candidate has a CV
    if (!candidate.cvFileUrl) {
      return next(new AppError('This candidate does not have a CV', 404));
    }

    // Enviar el archivo
    const filePath = candidate.cvFileUrl;
    const fileName = candidate.cvFilename;

    res.download(filePath, fileName);
  } catch (error) {
    next(error);
  }
}; 