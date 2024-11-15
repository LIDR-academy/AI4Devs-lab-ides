import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import candidateRoutes from './routes/candidateRoutes';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3010;

// Essential middleware only
app.use(cors());
app.use(express.json());

// Debug logging
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});

// Basic routes
app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

app.get('/api', (req, res) => {
  res.json({ message: 'API is working' });
});

// Candidates routes
app.use('/api/candidates', candidateRoutes);

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Available routes:');
  console.log('- GET  /');
  console.log('- GET  /api');
  console.log('- POST /api/candidates');
  
});

export { app, prisma };
export default prisma;
