import { Router } from 'express';
import {
  getAllCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} from '../controllers/candidate.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

// Protect all routes after this middleware
router.use(protect);

// Only recruiters and admins can access these routes
router.use(restrictTo('RECRUITER', 'ADMIN'));

router
  .route('/')
  .get(getAllCandidates)
  .post(createCandidate);

router
  .route('/:id')
  .get(getCandidate)
  .patch(updateCandidate)
  .delete(deleteCandidate);

export default router; 