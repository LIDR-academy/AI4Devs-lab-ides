import express from 'express';
import candidateRoutes from './candidateRoutes';

const router = express.Router();

router.use('/candidates', candidateRoutes);

export default router; 