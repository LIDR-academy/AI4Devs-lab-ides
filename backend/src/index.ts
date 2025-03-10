import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import morgan from 'morgan';
import fs from 'fs';
import candidateRoutes from './routes/candidates';
import authRoutes from './routes/auth';
import { globalLimiter } from './middlewares/rateLimit';
import { auditLogger } from './utils/logger';
import authConfig from './config/auth.config';

// Cargar variables de entorno
dotenv.config();

// Inicializar Prisma
const prisma = new PrismaClient();
export default prisma;

// Crear directorio de logs si no existe
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Inicializar Express
export const app = express();

// Middlewares para seguridad
app.use(helmet()); // Protección de cabeceras HTTP
app.use(cors(authConfig.security.corsOptions)); // CORS seguro
app.use(globalLimiter); // Rate limiting global

// Middlewares para logs y parseo
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging de solicitudes HTTP
app.use(morgan('combined', {
  stream: {
    write: (message: string) => {
      console.log(message.trim());
    }
  }
}));

// Middleware para medir tiempo de respuesta (para logs)
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    auditLogger.api(req, res, responseTime);
  });
  
  next();
});

// Directorio para archivos estáticos (CVs)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api/candidates', candidateRoutes);
app.use('/api/auth', authRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.send('API del Sistema de Gestión de Candidatos');
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores global
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  auditLogger.error(err, req);
  
  res.status(500).json({
    success: false,
    message: 'Ha ocurrido un error en el servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Puerto
const port = process.env.PORT || 3010;

// Iniciar el servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
  });
}
