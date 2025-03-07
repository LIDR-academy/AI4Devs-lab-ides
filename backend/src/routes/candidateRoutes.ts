import { Router } from 'express';
import { CandidateController } from '../controllers/CandidateController';

const router = Router();
const candidateController = new CandidateController();

router.post('/candidates', candidateController.addCandidate);
router.get('/candidates', candidateController.getAllCandidates);

export default router;