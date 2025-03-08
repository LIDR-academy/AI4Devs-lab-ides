import express from 'express';
import {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  uploadResume,
} from '../controllers/candidateController';
import upload from '../middlewares/uploadMiddleware';

const router = express.Router();

// Get all candidates
router.get('/', getCandidates);

// Get a single candidate by ID
router.get('/:id', getCandidateById);

// Create a new candidate
router.post('/', createCandidate);

// Update an existing candidate
router.put('/:id', updateCandidate);

// Delete a candidate
router.delete('/:id', deleteCandidate);

// Upload resume for a candidate
router.post('/:id/resume', upload.single('resume'), uploadResume);

export default router; 