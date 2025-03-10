import express from 'express';
import { CandidateController } from '../controllers/candidateController';
import { uploadCV, handleMulterError } from '../middleware/fileUpload';

const router = express.Router();
const candidateController = new CandidateController();

/**
 * @route   POST /api/candidates
 * @desc    Crear un nuevo candidato
 * @access  Public
 */
router.post('/candidates', uploadCV, handleMulterError, candidateController.createCandidate.bind(candidateController));

/**
 * @route   GET /api/candidates
 * @desc    Obtener todos los candidatos
 * @access  Public
 */
router.get('/candidates', candidateController.getAllCandidates.bind(candidateController));

/**
 * @route   GET /api/candidates/:id
 * @desc    Obtener un candidato por ID
 * @access  Public
 */
router.get('/candidates/:id', candidateController.getCandidateById.bind(candidateController));

/**
 * @route   PUT /api/candidates/:id
 * @desc    Actualizar un candidato
 * @access  Public
 */
router.put('/candidates/:id', uploadCV, handleMulterError, candidateController.updateCandidate.bind(candidateController));

/**
 * @route   DELETE /api/candidates/:id
 * @desc    Eliminar un candidato
 * @access  Public
 */
router.delete('/candidates/:id', candidateController.deleteCandidate.bind(candidateController));

export default router; 