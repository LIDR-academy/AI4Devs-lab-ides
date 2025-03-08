import { Router } from 'express';
import {
  getAllCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  downloadCV,
} from '../controllers/candidate.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';
import upload from '../middlewares/upload.middleware';

const router = Router();

// Protect all routes after this middleware
router.use(protect);

// Only recruiters and admins can access these routes
router.use(restrictTo('RECRUITER', 'ADMIN'));

router
  .route('/')
  .get(getAllCandidates)
  .post(upload.single('cv'), createCandidate);

router
  .route('/:id')
  .get(getCandidate)
  .patch(upload.single('cv'), updateCandidate)
  .delete(deleteCandidate);

// Ruta para descargar el CV
router.get('/:id/cv', downloadCV);

export default router; 