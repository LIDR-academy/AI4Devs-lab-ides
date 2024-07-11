import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ dest: 'uploads/' });

router.post('/candidate', upload.single('cv'), async (req, res) => {
  try {
    const { name, lastName, email, phone, address, education, workExperience } = req.body;
    const cvUrl = req.file?.path;

    const candidate = await prisma.candidate.create({
      data: {
        name,
        lastName,
        email,
        phone,
        address,
        education,
        workExperience,
        cvUrl,
      },
    });

    res.status(201).json(candidate);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error al crear el candidato', error: error.message });
    } else {
      res.status(500).json({ message: 'Error al crear el candidato', error: 'Unknown error' });
    }
  }
});

export default router;