import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import userRoutes from './routes/userRoutes';
import candidateRoutes from './routes/candidateRoutes';
import educationRoutes from './routes/educationRoutes';
import workExperienceRoutes from './routes/workExperienceRoutes';
import autocompleteRoutes from './routes/autocompleteRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Cargar variables de entorno
dotenv.config();

// Crear instancia de Prisma
const prisma = new PrismaClient();
export default prisma;

// Crear aplicación Express
const app = express();
const port = process.env.PORT || 3010;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.send('API del Sistema LTI funcionando correctamente');
});

// Rutas de la API
app.use('/api/users', userRoutes);
app.use('/api', candidateRoutes);
app.use('/api', educationRoutes);
app.use('/api', workExperienceRoutes);
app.use('/api', autocompleteRoutes);

// Middleware para rutas no encontradas
app.use(notFoundHandler);

// Middleware para manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

// Manejar cierre de la aplicación
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Conexión a la base de datos cerrada');
  process.exit(0);
});

// Exportar app para pruebas
export { app };
