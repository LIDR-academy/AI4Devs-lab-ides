import { Router } from 'express';
import { 
  createCandidate, 
  updateCandidate, 
  deleteCandidate, 
  getCandidate, 
  listCandidates 
} from '../controllers/candidateController';
import { auth } from '../middleware/auth';

const router = Router();

// All routes are protected with auth middleware
router.use(auth);

router.post('/', createCandidate);
router.get('/', listCandidates);
router.get('/:id', getCandidate);
router.put('/:id', updateCandidate);
router.delete('/:id', deleteCandidate);

export default router;