import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';
import candidateRoutes from './routes/candidates';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

// Middleware
app.use(cors());

// Increase size limits for JSON and URL-encoded data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Add debug logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

app.use('/candidates', candidateRoutes);

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error handling request:', err.stack);
  res.type('text/plain'); 
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
