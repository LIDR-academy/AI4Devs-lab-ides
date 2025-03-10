import { Request, Response, NextFunction } from 'express';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { candidateRouter } from './routes/candidate.routes';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

// Configuración del puerto
const port = process.env.PORT || 3010;

// Middlewares
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  console.log('Health check requested');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas de la API
app.use('/api/candidates', candidateRouter);

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  const status = err.status || 500;
  const message = err.message || 'Something broke!';
  res.status(status).json({ message });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log('Available routes:');
  console.log('- GET  /api/health');
  console.log('- POST /api/candidates/applications');
  console.log('- POST /api/candidates');
  console.log('- GET  /api/candidates/email/:email');
});
