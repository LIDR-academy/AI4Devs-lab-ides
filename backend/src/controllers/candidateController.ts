// src/controllers/candidateController.ts
import { Request, Response } from 'express';
import prisma from '../prismaClient';
import path from 'path';
import fs from 'fs';

export const addCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, address, education, experience } = req.body;
    const resume = req.file;

    if (!firstName || !lastName || !email || !phone || !address || !education || !experience || !resume) {
      res.status(400).json({ error: 'Todos los campos son obligatorios' });
      return;
    }

    // Validar el formato del archivo
    const allowedExtensions = ['.pdf', '.docx'];
    const fileExtension = path.extname(resume.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      res.status(400).json({ error: 'Formato de archivo no permitido. Solo se permiten PDF y DOCX.' });
      return;
    }

    // Validar el tamaño del archivo
    if (resume.size > 10 * 1024 * 1024) { // 10MB
      res.status(400).json({ error: 'El archivo no debe superar los 10MB.' });
      return;
    }

    // Guardar el archivo en el servidor
    const resumePath = path.join(__dirname, '../uploads', resume.originalname);
    fs.writeFileSync(resumePath, resume.buffer);

    // Crear el candidato en la base de datos
    const candidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        education,
        experience,
        resumePath,
      },
    });

    res.status(200).json({ message: 'Candidato añadido exitosamente', candidate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al añadir el candidato' });
  }
};

export const getCandidates = async (req: Request, res: Response): Promise<void> => {
  try {
    const candidates = await prisma.candidate.findMany();
    res.status(200).json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los candidatos' });
  }
};
