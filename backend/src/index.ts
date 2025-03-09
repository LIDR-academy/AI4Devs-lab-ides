import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import candidatoRoutes from './routes/candidatoRoutes';
import path from 'path';
import multer from 'multer';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

// Middleware para procesar JSON
app.use(express.json());

// Middleware para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas de la API
app.use('/api/candidatos', candidatoRoutes);

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

// Middleware para manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'El archivo es demasiado grande. El tamaño máximo permitido es 5MB.'
      });
    }
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({ error: 'Error interno del servidor.' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
