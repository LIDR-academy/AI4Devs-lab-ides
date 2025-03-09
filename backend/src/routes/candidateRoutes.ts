import express from 'express';
import {
  getCandidates,
  getCandidateById,
  createCandidate,
  deleteCandidate,
} from '../controllers/candidateController';
import { validateCandidate } from '../middleware/validation';
import uploadMiddleware from '../middleware/upload';

const router = express.Router();

// GET all candidates
router.get('/', getCandidates);

// GET a single candidate by ID
router.get('/:id', getCandidateById);

// POST a new candidate with CV upload
router.post('/', uploadMiddleware, validateCandidate, createCandidate);

// DELETE a candidate by ID
router.delete('/:id', deleteCandidate);

export default router;
