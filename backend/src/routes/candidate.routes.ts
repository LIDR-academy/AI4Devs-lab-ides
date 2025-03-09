import { Router } from 'express';
import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  uploadCandidateDocument
} from '../controllers/candidate.controller';
import upload from '../middlewares/upload.middleware';
import { validateCandidate } from '../middlewares/validation.middleware';
import { parseFormData } from '../middlewares/parseFormData.middleware';

const router = Router();

// GET /api/candidates - Get all candidates
router.get('/', getCandidates);

// GET /api/candidates/:id - Get a candidate by ID
router.get('/:id', getCandidateById);

// POST /api/candidates - Create a new candidate
router.post('/', upload.single('file'), parseFormData, validateCandidate, createCandidate);

// PUT /api/candidates/:id - Update a candidate
router.put('/:id', upload.single('file'), parseFormData, updateCandidate);

// DELETE /api/candidates/:id - Delete a candidate
router.delete('/:id', deleteCandidate);

// POST /api/candidates/:id/documents - Upload a document for a candidate
router.post('/:id/documents', upload.single('file'), uploadCandidateDocument);

export default router;