import express from 'express';
import { candidateController } from '../controllers/candidateController';
import upload from '../middlewares/uploadMiddleware';
import { validateCandidate } from '../utils/validationUtils';

const router = express.Router();

// Ruta para crear un nuevo candidato
router.post('/', upload.single('cvFile'), validateCandidate, candidateController.createCandidate);

// Ruta para obtener todos los candidatos
router.get('/', candidateController.getAllCandidates);

// Ruta para obtener un candidato por ID
router.get('/:id', candidateController.getCandidateById);

// Ruta para actualizar un candidato
router.put('/:id', upload.single('cvFile'), validateCandidate, candidateController.updateCandidate);

// Ruta para eliminar un candidato
router.delete('/:id', candidateController.deleteCandidate);

export default router;
