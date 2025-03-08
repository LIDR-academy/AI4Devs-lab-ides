import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Importar rutas
import { candidateRouter } from './interfaces/http/routes/candidateRoutes';
import { authRouter } from './interfaces/http/routes/authRoutes';

// Importar middlewares
import { handleOperationalErrors, handleProgrammerErrors, AppError } from './interfaces/http/middleware/errorHandlerMiddleware';
import { sanitizeInputs } from './interfaces/http/middleware/sanitizationMiddleware';

// Configurar variables de entorno
dotenv.config();

// Inicializar Prisma
const prisma = new PrismaClient();

// Inicializar Express
export const app = express();
export default prisma;

// Puerto
const port = process.env.PORT || 3010;

// Configurar rate limiter para prevenir ataques de fuerza bruta
const rateLimiter = new RateLimiterMemory({
  points: 10, // Número de solicitudes permitidas
  duration: 1, // Por segundo
});

// Middleware para aplicar rate limiting
const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.ip || '0.0.0.0'; // Valor por defecto si req.ip es undefined
  rateLimiter.consume(clientIp)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).json({
        success: false,
        message: 'Demasiadas solicitudes, por favor intente más tarde'
      });
    });
};

// Middleware de seguridad
app.use(helmet()); // Protección de cabeceras HTTP
app.use(rateLimiterMiddleware); // Limitar número de solicitudes

// Middleware
// Permitir CORS para desarrollo
app.use((req, res, next) => {
  // Permitir solicitudes desde el frontend
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Aplicar sanitización a todas las solicitudes
app.use(sanitizeInputs);

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api/candidates', candidateRouter(prisma));
app.use('/api/auth', authRouter(prisma));

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de LTI - Sistema de Seguimiento de Talento'
  });
});

// Middleware de manejo de errores
app.use(handleOperationalErrors);
app.use(handleProgrammerErrors);

// Middleware para rutas no encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Recurso no encontrado',
  });
});

// Iniciar servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
}
