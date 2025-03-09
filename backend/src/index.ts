import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// Import application components
import { CandidateService } from './application/candidate';
import { CandidateRepository } from './infrastructure/candidate';
import { FileService } from './infrastructure/file.service';
import {
  CandidateController,
  configureCandidateRoutes,
} from './presentation/candidate';
import { configureMiddleware } from './presentation/middleware';
import {
  StatisticsController,
  configureStatisticsRoutes,
} from './presentation/statistics';
import {
  SuggestionsController,
  configureSuggestionsRoutes,
} from './presentation/suggestions';

// Load environment variables
dotenv.config();

// Initialize Express app
export const app = express();
const port = process.env.PORT || 3010;

// ===== HIGHEST PRIORITY: MANUAL CORS CONFIGURATION =====
// This middleware will run before any other middleware and will send CORS headers for all requests
app.use((req, res, next) => {
  // Allow all origins for development, restrict for production
  res.header('Access-Control-Allow-Origin', '*');
  // Allow these headers in requests
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  // Allow these methods
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // Handle OPTIONS requests (preflight requests)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// Initialize Prisma client
export const prisma = new PrismaClient();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ===== CORS CONFIGURATION USING LIBRARY =====
// This can remain, but the manual middleware above takes precedence
app.use(
  cors({
    origin: '*', // Allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Configure middleware
configureMiddleware(app);

// Add error handling middleware for multer errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'MulterError' && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'File size limit exceeded',
      message: 'The uploaded file exceeds the 5MB size limit.',
    });
  }
  next(err);
});

// Initialize services and controllers
const fileService = new FileService();
const candidateRepository = new CandidateRepository(prisma);
const candidateService = new CandidateService(candidateRepository, fileService);
const candidateController = new CandidateController(candidateService);
const statisticsController = new StatisticsController();
const suggestionsController = new SuggestionsController();

// Configure routes
configureCandidateRoutes(app, candidateController);
configureStatisticsRoutes(app, statisticsController);
configureSuggestionsRoutes(app, suggestionsController);

// Root route
app.get('/', (req, res) => {
  res.send('LTI Candidate Management System API');
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log('CORS is manually enabled for all origins');
  });
}

// Export for testing
export default app;
