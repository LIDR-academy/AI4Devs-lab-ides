import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import candidateRoutes from './routes/candidateRoutes';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010; // Volvemos al puerto original

// Configuración de CORS
app.use(cors({
  origin: '*', // Permitir cualquier origen durante el desarrollo
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

// Rutas de candidatos
app.use('/api/candidates', candidateRoutes);

// Middleware para manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.type('text/plain'); 
  res.status(500).send('Something broke!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${port}`);
});
