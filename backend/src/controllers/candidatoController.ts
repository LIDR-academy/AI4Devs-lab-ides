import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCandidato = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, correo_electronico, telefono, direccion, educacion, experiencia_laboral } = req.body;

    // Validate required fields
    if (!nombre || !apellido || !correo_electronico) {
      return res.status(400).json({ error: "Missing required fields: nombre, apellido, or correo_electronico." });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo_electronico)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    // Process file upload (CV)
    let cv_path = null;
    if (req.file) {
      cv_path = req.file.path; // storing file path from Multer
    }

    // Create candidate in database; parsing JSON fields if provided
    const candidato = await prisma.candidato.create({
      data: {
        nombre,
        apellido,
        correo_electronico,
        telefono,
        direccion,
        educacion: educacion ? JSON.parse(educacion) : null,
        experiencia_laboral: experiencia_laboral ? JSON.parse(experiencia_laboral) : null,
        cv_path,
      },
    });

    return res.status(201).json({ message: "Candidato created.", candidato });
  } catch (error) {
    return res.status(500).json({ error: "Error creating candidato." });
  }
};