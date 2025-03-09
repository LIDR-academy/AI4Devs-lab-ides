import { Router } from 'express';
import authRoutes from './auth';
import candidateRoutes from './candidates';
import documentRoutes from './documents';

const router = Router();

router.use('/auth', authRoutes);
router.use('/candidates', candidateRoutes);
router.use('/documents', documentRoutes);

export default router;