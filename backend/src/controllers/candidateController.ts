import { Request, Response } from 'express';
import prisma from '../index';

export const createCandidate = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address
    } = req.body;

    const candidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address
      }
    });

    res.status(201).json(candidate);
  } catch (error) {
    console.error('Error al crear candidato:', error);
    res.status(500).json({ error: 'Error al crear el candidato' });
  }
}; 