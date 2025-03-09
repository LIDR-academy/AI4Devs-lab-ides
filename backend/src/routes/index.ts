import { Router, Request, Response } from 'express';
import candidateRoutes from './candidate.routes';
import authRoutes from './auth.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// API routes
router.use('/candidates', candidateRoutes);
router.use('/auth', authRoutes);

export default router;