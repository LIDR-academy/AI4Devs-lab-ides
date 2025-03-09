import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import candidateRoutes from './routes/candidateRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

// Configuración de variables de entorno
dotenv.config();

// Inicializar Prisma
const prisma = new PrismaClient();
export default prisma;

// Inicializar Express
export const app = express();
const port = process.env.PORT || 3010;

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Permitir solicitudes desde el frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middlewares
app.use(cors(corsOptions)); // Habilitar CORS con opciones específicas
app.use(express.json()); // Parsear JSON
app.use(express.urlencoded({ extended: true })); // Parsear URL-encoded

// Middleware para registrar solicitudes
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.send('API del Sistema de Seguimiento de Talento - LTI');
});

// Rutas de la API
app.use('/api/candidates', candidateRoutes);

// Middleware para manejar rutas no encontradas
app.use(notFoundHandler);

// Middleware para manejar errores
app.use(errorHandler);

// Iniciar el servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
  });
}
