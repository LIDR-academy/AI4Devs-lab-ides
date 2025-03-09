import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import candidatoRoutes from './routes/candidatoRoutes';
import path from 'path';
import multer from 'multer';
import cors from 'cors';
import { setupSwagger } from './swagger';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

// Middleware para procesar JSON
app.use(express.json());

// Configuración CORS mejorada
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Configurar Swagger
setupSwagger(app);

// Rutas de la API
app.use('/api/candidatos', candidatoRoutes);

// Ruta para verificar que el servidor está funcionando
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'El servidor está funcionando correctamente' });
});

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
  console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
});
