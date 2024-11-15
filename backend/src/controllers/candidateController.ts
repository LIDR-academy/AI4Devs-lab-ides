import { Request, Response } from 'express';
import prisma from '../index';
import path from 'path';
import fs from 'fs';

export const addCandidate = async (req: Request, res: Response) => {
  try {
    const { name, lastName, email, phone, address, education, experience } = req.body;
    const cv = req.file;

    console.log('Creating candidate with data:', req.body);

    if (!cv) {
      return res.status(400).json({ error: 'El CV es obligatorio' });
    }

    const candidate = await prisma.candidate.create({
      data: {
        name,
        lastName,
        email,
        phone,
        address,
        education,
        experience,
        cvPath: cv.path, // Guardar la ruta del archivo en la base de datos
      },
    });

    console.log('Created candidate:', candidate);

    res.status(201).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error creating candidate'
    });
  }
};