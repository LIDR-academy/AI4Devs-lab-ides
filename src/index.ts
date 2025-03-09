import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import { setupSecurityMiddleware } from './middlewares/securityMiddleware';
import { config } from './config/config';

// Cargar variables de entorno
dotenv.config();

// Inicializar Prisma
const prisma = new PrismaClient();

// Inicializar Express
const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3000', // Permitir solicitudes desde el frontend
  credentials: true, // Permitir cookies en solicitudes cross-origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
}));

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configurar middlewares de seguridad
setupSecurityMiddleware(app);

// Rutas de la API
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API del sistema ATS funcionando correctamente');
});

// Middleware de manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
  });
});

// Iniciar servidor solo si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  const port = config.server.port;
  app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
  });
}

// Exportar para pruebas
export { app, prisma }; 