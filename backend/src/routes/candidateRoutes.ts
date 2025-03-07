import { Router } from 'express';
import { createCandidate, getCandidates } from '../controllers/candidateController';
import { upload } from '../middlewares/fileUpload';

const router = Router();

// Route for adding a new candidate (with CV upload)
router.post('/', upload.single('cv'), createCandidate);

// Route for getting all candidates
router.get('/', getCandidates);

export default router; 