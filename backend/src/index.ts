import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

// Middleware
app.use(express.json());
app.use(cors());

// Rutas básicas
app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

// Rutas para candidatos
app.post('/api/candidates', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      education,
      workExperience,
    } = req.body;

    // Validación básica
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        error: 'Los campos nombre, apellido y email son obligatorios',
      });
    }

    const candidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        education,
        workExperience,
        resumeUrl: req.body.resumeUrl || null,
      },
    });

    res.status(201).json(candidate);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res
        .status(400)
        .json({ error: 'Ya existe un candidato con ese email' });
    }
    console.error('Error al crear candidato:', error);
    res.status(500).json({ error: 'Error al crear el candidato' });
  }
});

app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany();
    res.json(candidates);
  } catch (error) {
    console.error('Error al obtener candidatos:', error);
    res.status(500).json({ error: 'Error al obtener los candidatos' });
  }
});

app.get('/api/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await prisma.candidate.findUnique({
      where: { id: Number(id) },
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidato no encontrado' });
    }

    res.json(candidate);
  } catch (error) {
    console.error('Error al obtener candidato:', error);
    res.status(500).json({ error: 'Error al obtener el candidato' });
  }
});

// Manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.type('text/plain');
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
