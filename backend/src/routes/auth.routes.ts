import { Router } from 'express';
import { login, getProfile } from '../controllers/auth.controller';

const router = Router();

// Auth routes
router.post('/login', login);
router.get('/me', getProfile);

export default router;