import { Router } from 'express';
import { createCandidate } from '../controllers/candidateController';
import { validateCandidate } from '../middleware/validateCandidate';
import { upload } from '../middleware/uploadCV';

const router = Router();

router.post('/candidates', upload.single('cv'), validateCandidate, createCandidate);

export default router;