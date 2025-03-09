import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import prisma from '../index';
import { AppError } from '../middleware/errorHandler';
import { encrypt, decrypt } from '../utils/encryption';

export const createCandidate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phoneNumber, 
      address,
      education,
      experience,
      status 
    } = req.body;

    const candidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber: encrypt(phoneNumber),
        address: encrypt(address),
        status: status || 'ACTIVE',
        userId: req.user!.id,
        education: {
          create: education || []
        },
        experience: {
          create: experience || []
        }
      },
      include: {
        education: true,
        experience: true,
        documents: true
      }
    });

    // Decrypt sensitive information
    const decryptedCandidate = {
      ...candidate,
      phoneNumber: decrypt(candidate.phoneNumber),
      address: decrypt(candidate.address),
    };

    res.status(201).json({
      status: 'success',
      data: decryptedCandidate,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCandidate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { 
      firstName, 
      lastName, 
      email, 
      phoneNumber, 
      address,
      education,
      experience,
      status 
    } = req.body;

    // First, delete existing education and experience
    await prisma.$transaction([
      prisma.education.deleteMany({
        where: { candidateId: parseInt(id) }
      }),
      prisma.experience.deleteMany({
        where: { candidateId: parseInt(id) }
      })
    ]);

    // Then update candidate with new data
    const candidate = await prisma.candidate.update({
      where: { id: parseInt(id) },
      data: {
        firstName,
        lastName,
        email,
        phoneNumber: phoneNumber ? encrypt(phoneNumber) : undefined,
        address: address ? encrypt(address) : undefined,
        status,
        education: {
          create: education || []
        },
        experience: {
          create: experience || []
        }
      },
      include: {
        education: true,
        experience: true,
        documents: true
      }
    });

    const decryptedCandidate = {
      ...candidate,
      phoneNumber: decrypt(candidate.phoneNumber),
      address: decrypt(candidate.address),
    };

    res.json({
      status: 'success',
      data: decryptedCandidate,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCandidate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.candidate.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      status: 'success',
      message: 'Candidate deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getCandidate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const candidate = await prisma.candidate.findUnique({
      where: { id: parseInt(id) },
      include: {
        education: true,
        experience: true,
        documents: true
      }
    });

    if (!candidate) {
      throw new AppError('Candidate not found', 404);
    }

    const decryptedCandidate = {
      ...candidate,
      phoneNumber: decrypt(candidate.phoneNumber),
      address: decrypt(candidate.address),
    };

    res.json({
      status: 'success',
      data: decryptedCandidate,
    });
  } catch (error) {
    next(error);
  }
};

export const listCandidates = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const skip = (page - 1) * limit;

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        take: limit,
        skip,
        include: {
          education: true,
          experience: true,
          documents: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.candidate.count()
    ]);

    const decryptedCandidates = candidates.map((candidate: { phoneNumber: string; address: string }) => ({
      ...candidate,
      phoneNumber: decrypt(candidate.phoneNumber),
      address: decrypt(candidate.address),
    }));

    res.json({
      status: 'success',
      data: decryptedCandidates,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    next(error);
  }
};