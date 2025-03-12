import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

// Importar rutas y middlewares
import candidateRoutes from './routes/candidateRoutes';
import { errorHandler, joiErrorHandler, notFoundHandler } from './middlewares/errorHandler';
import { apiLimiter } from './middlewares/rateLimiter';
import { configureSecurityMiddleware } from './middlewares/security';
import logger from './config/logger';

// Configurar variables de entorno
dotenv.config();

// Inicializar Prisma
export const prisma = new PrismaClient();

// Inicializar Express
export const app = express();
const port = process.env.PORT || 3010;

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Sistema de Seguimiento de Candidatos',
      version: '1.0.0',
      description: 'API para gestionar candidatos en un sistema ATS',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Configurar middlewares de seguridad
configureSecurityMiddleware(app);

// Middlewares
app.use(express.json()); // Parseo de JSON
app.use(express.urlencoded({ extended: true })); // Parseo de formularios

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Aplicar rate limiting a todas las rutas
app.use('/api', apiLimiter);

// Rutas
app.use('/api/candidates', candidateRoutes);

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.send('API del Sistema de Seguimiento de Candidatos');
});

// Middleware para rutas no encontradas
app.use(notFoundHandler);

// Middlewares de manejo de errores
app.use(joiErrorHandler);
app.use(errorHandler);

// Iniciar servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    logger.info(`Servidor iniciado en http://localhost:${port}`);
    logger.info(`Documentación disponible en http://localhost:${port}/api-docs`);
  });
}

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

export default app;
