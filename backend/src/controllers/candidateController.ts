import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCandidate = async (req: Request, res: Response, next: NextFunction) => {
  const { first_name, last_name, email, phone_number, address, education, work_experience } = req.body;
  const cv = req.file?.filename;

  if (!first_name || !last_name || !email || !phone_number || !address || !education || !work_experience) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto el CV.' });
  }

  try {
    const candidate = {
      first_name,
      last_name,
      email,
      phone_number,
      address,
      education,
      work_experience,
      cv,
    };

    const newCandidate = await prisma.candidate.create({
      data: candidate,
    });

    res.status(200).json(newCandidate);
  } catch (error) {
    console.error('Error al crear el candidato:', error);
    next(error); // Pasar el error al middleware de manejo de errores
  }
};