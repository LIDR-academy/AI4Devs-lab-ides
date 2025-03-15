import express from 'express';
import { createCandidate } from '../controllers/candidateController';
import { upload } from '../middleware/fileUpload';

const router = express.Router();

// Ruta para crear un nuevo candidato
router.post('/', upload.single('cv'), createCandidate);

export default router; 