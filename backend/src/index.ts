import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';
import candidatoRoutes from './routes/candidatoRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas base
app.get('/', (req, res) => {
  res.send('API del Sistema de Seguimiento de Talento (ATS)');
});

// Rutas de la API
app.use('/api/candidatos', candidatoRoutes);
app.use('/api/user', userRoutes);

// Middleware de manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    mensaje: err.message || 'Algo salió mal'
  });
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
