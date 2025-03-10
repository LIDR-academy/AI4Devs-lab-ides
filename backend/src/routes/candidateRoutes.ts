import express from 'express';
import { CandidateController } from '../controllers/candidateController';
import { uploadCV, handleFileUploadError } from '../middlewares/fileUpload';
import { validateCandidateInput } from '../middlewares/validation';

const router = express.Router();
const candidateController = new CandidateController();

/**
 * @route POST /api/candidates
 * @desc Crear un nuevo candidato
 * @access Privado
 */
router.post(
  '/',
  uploadCV,
  handleFileUploadError,
  validateCandidateInput,
  candidateController.createCandidate.bind(candidateController)
);

export default router; 