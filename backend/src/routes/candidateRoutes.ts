import { Router } from 'express';
import { candidateController } from '../controllers/candidateController';
import { upload } from '../middleware/upload';
import { validate } from '../middleware/validate';
import {
  createCandidateSchema,
  updateCandidateSchema,
} from '../schemas/candidateSchema';

const router = Router();

router.get('/statistics', candidateController.getStatistics);
router.get('/', candidateController.getAllCandidates);
router.get('/:id', candidateController.getCandidate);
router.post(
  '/',
  upload.single('cv'),
  validate(createCandidateSchema),
  candidateController.createCandidate,
);
router.put(
  '/:id',
  validate(updateCandidateSchema),
  candidateController.updateCandidate,
);
router.delete('/:id', candidateController.deleteCandidate);
router.get('/:id/cv', candidateController.downloadCV);

export default router;
