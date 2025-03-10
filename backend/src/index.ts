import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import candidateRoutes from './routes/candidateRoutes';

// Configuración de variables de entorno
dotenv.config();

// Inicialización de Prisma
const prisma = new PrismaClient();

// Inicialización de Express
export const app = express();
export default prisma;

// Configuración del puerto
const port = process.env.PORT || 3010;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.get('/', (req, res) => {
  res.send('Bienvenido a la API del Sistema de Seguimiento de Talento (LTI)');
});

// Rutas de la API
app.use('/api/candidates', candidateRoutes);

// Middleware para manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
