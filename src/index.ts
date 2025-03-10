import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

// Middleware
app.use(express.json());
app.use(cors());

// Configuración para almacenar archivos CV
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.doc'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF, DOCX o DOC'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Rutas
app.get('/', (req: Request, res: Response) => {
  res.send('Hola LTI!');
});

// Ruta para crear un candidato
app.post('/api/candidates', upload.single('cv'), async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, address, education, workExperience } = req.body;
    
    // Validaciones básicas
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'Los campos nombre, apellido y email son obligatorios' });
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'El formato del email no es válido' });
    }
    
    // Verificar si el candidato ya existe
    const existingCandidate = await prisma.candidate.findUnique({
      where: { email }
    });
    
    if (existingCandidate) {
      return res.status(409).json({ error: 'Ya existe un candidato con este email' });
    }
    
    // Crear el candidato
    const candidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        address: address || null,
        education: education || null,
        workExperience: workExperience || null,
        cvFilePath: req.file ? req.file.path : null
      }
    });
    
    res.status(201).json({
      message: 'Candidato añadido exitosamente',
      candidate
    });
  } catch (error) {
    console.error('Error al crear candidato:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

// Middleware de manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.type('text/plain'); 
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}); 