import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import express from 'express';
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

// Load environment variables
dotenv.config();

// Initialize Express app
export const app = express();
const port = process.env.PORT || 3010;

// Initialize Prisma client
export const prisma = new PrismaClient();

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '../uploads');
const tempDir = path.join(__dirname, '../temp');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Configure middleware
configureMiddleware(app);

// Initialize services and controllers
const fileService = new FileService();
const candidateRepository = new CandidateRepository(prisma);
const candidateService = new CandidateService(candidateRepository, fileService);
const candidateController = new CandidateController(candidateService);

// Configure routes
configureCandidateRoutes(app, candidateController);

// Root route
app.get('/', (req, res) => {
  res.send('LTI Candidate Management System API');
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

// Export for testing
export default app;
