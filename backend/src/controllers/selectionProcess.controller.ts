import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middlewares/error.middleware';

const prisma = new PrismaClient();

// Get all selection processes
export const getAllSelectionProcesses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const selectionProcesses = await prisma.selectionProcess.findMany({
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        recruiter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        stages: true,
      },
    });

    res.status(200).json({
      status: 'success',
      results: selectionProcesses.length,
      data: {
        selectionProcesses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get selection processes for a specific candidate
export const getCandidateSelectionProcesses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { candidateId } = req.params;

    // Check if candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return next(new AppError('No candidate found with that ID', 404));
    }

    const selectionProcesses = await prisma.selectionProcess.findMany({
      where: { candidateId },
      include: {
        stages: true,
        recruiter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      results: selectionProcesses.length,
      data: {
        selectionProcesses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single selection process
export const getSelectionProcess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const selectionProcess = await prisma.selectionProcess.findUnique({
      where: { id },
      include: {
        candidate: true,
        recruiter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        stages: true,
      },
    });

    if (!selectionProcess) {
      return next(new AppError('No selection process found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        selectionProcess,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create a new selection process
export const createSelectionProcess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      description,
      position,
      candidateId,
      stages,
    } = req.body;

    // Check if candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return next(new AppError('No candidate found with that ID', 404));
    }

    // Create new selection process with stages
    const newSelectionProcess = await prisma.selectionProcess.create({
      data: {
        title,
        description,
        position,
        candidateId,
        recruiterId: req.user.id,
        stages: {
          create: stages || [
            {
              name: 'Initial Screening',
              description: 'Review of candidate resume and application',
              status: 'PENDING',
            },
            {
              name: 'Technical Interview',
              description: 'Assessment of technical skills and knowledge',
              status: 'PENDING',
            },
            {
              name: 'Final Interview',
              description: 'Final interview with hiring manager',
              status: 'PENDING',
            },
          ],
        },
      },
      include: {
        stages: true,
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        selectionProcess: newSelectionProcess,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update a selection process
export const updateSelectionProcess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      position,
      endDate,
      notes,
    } = req.body;

    // Check if selection process exists
    const selectionProcess = await prisma.selectionProcess.findUnique({
      where: { id },
    });

    if (!selectionProcess) {
      return next(new AppError('No selection process found with that ID', 404));
    }

    // Update selection process
    const updatedSelectionProcess = await prisma.selectionProcess.update({
      where: { id },
      data: {
        title,
        description,
        status,
        position,
        endDate,
        notes,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        selectionProcess: updatedSelectionProcess,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete a selection process
export const deleteSelectionProcess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if selection process exists
    const selectionProcess = await prisma.selectionProcess.findUnique({
      where: { id },
      include: {
        stages: true,
      },
    });

    if (!selectionProcess) {
      return next(new AppError('No selection process found with that ID', 404));
    }

    // Delete all stages first
    await prisma.processStage.deleteMany({
      where: { selectionProcessId: id },
    });

    // Delete selection process
    await prisma.selectionProcess.delete({
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

// Update a process stage
export const updateProcessStage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, stageId } = req.params;
    const { status, feedback, date } = req.body;

    // Check if selection process exists
    const selectionProcess = await prisma.selectionProcess.findUnique({
      where: { id },
      include: {
        stages: true,
      },
    });

    if (!selectionProcess) {
      return next(new AppError('No selection process found with that ID', 404));
    }

    // Check if stage exists
    const stage = selectionProcess.stages.find(s => s.id === stageId);
    if (!stage) {
      return next(new AppError('No stage found with that ID', 404));
    }

    // Update stage
    const updatedStage = await prisma.processStage.update({
      where: { id: stageId },
      data: {
        status,
        feedback,
        date,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        stage: updatedStage,
      },
    });
  } catch (error) {
    next(error);
  }
}; 