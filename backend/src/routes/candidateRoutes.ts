import express from 'express';
import { 
  createCandidate, 
  getCandidates, 
  getCandidateById, 
  updateCandidate, 
  deleteCandidate
} from '../controllers/candidateController';
import { validateFile } from '../middlewares/fileValidator';

const router = express.Router();

// Rutas para candidatos
router.post('/', validateFile, createCandidate);
router.get('/', getCandidates);
router.get('/:id', getCandidateById);
router.put('/:id', validateFile, updateCandidate);
router.delete('/:id', deleteCandidate);

export default router; 