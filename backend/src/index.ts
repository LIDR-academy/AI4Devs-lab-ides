import { Request, Response, NextFunction } from 'express';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './routes';
import { languageMiddleware } from './middlewares/language.middleware';
import { translate } from './utils/i18n.utils';
import prisma from './lib/prisma';

// Load environment variables
dotenv.config();

// Initialize Express app
export const app = express();

// Export Prisma client for use in other files
export { prisma };

// Configure port
const port = process.env.PORT || 3010;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(languageMiddleware);

// API Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: translate('common.welcome', req.language)
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: translate('common.errors.somethingWentWrong', req.language),
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
