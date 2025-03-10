import { Request, Response, NextFunction } from 'express';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import prisma from './lib/prisma';
import candidateRoutes from './routes/candidateRoutes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

// Asegurar que la conexión está establecida
prisma.$connect()
  .then(() => {
    console.log('Database connection established');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  });

const app = express();

const port = process.env.PORT || 3010;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar directorio de uploads como estático
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads/resumes', express.static(path.join(__dirname, '../uploads/resumes')));

// Rutas
app.use('/api/candidates', candidateRoutes);

// Ruta de verificación de salud
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Manejador global de errores ANTES del manejo de rutas no encontradas
app.use(errorHandler);

// Manejo de rutas no encontradas al final
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada'
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
