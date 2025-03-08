import { Router } from 'express';
import {
  getAllSelectionProcesses,
  getSelectionProcess,
  createSelectionProcess,
  updateSelectionProcess,
  deleteSelectionProcess,
  getCandidateSelectionProcesses,
  updateProcessStage,
} from '../controllers/selectionProcess.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

// Protect all routes after this middleware
router.use(protect);

// Only recruiters and admins can access these routes
router.use(restrictTo('RECRUITER', 'ADMIN'));

router
  .route('/')
  .get(getAllSelectionProcesses)
  .post(createSelectionProcess);

router
  .route('/:id')
  .get(getSelectionProcess)
  .patch(updateSelectionProcess)
  .delete(deleteSelectionProcess);

router.get('/candidate/:candidateId', getCandidateSelectionProcesses);

router.patch('/:id/stages/:stageId', updateProcessStage);

export default router; 