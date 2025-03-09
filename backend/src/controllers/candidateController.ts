import { Request, Response } from 'express';
import prisma from '../index';

export const addCandidate = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, address, education, experience } = req.body;
  const resume = req.file?.path;

  try {
    const newCandidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        education,
        experience,
        resume: resume || '',
      },
    });
    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(500).json({ error: 'Error adding candidate' });
  }
};