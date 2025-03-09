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
router.post('/', uploadCV, handleMulterError, candidateController.createCandidate);

/**
 * @route   GET /api/candidates
 * @desc    Obtener todos los candidatos
 * @access  Public
 */
router.get('/', candidateController.getAllCandidates);

/**
 * @route   GET /api/candidates/:id
 * @desc    Obtener un candidato por ID
 * @access  Public
 */
router.get('/:id', candidateController.getCandidateById);

/**
 * @route   PUT /api/candidates/:id
 * @desc    Actualizar un candidato
 * @access  Public
 */
router.put('/:id', uploadCV, handleMulterError, candidateController.updateCandidate);

/**
 * @route   DELETE /api/candidates/:id
 * @desc    Eliminar un candidato
 * @access  Public
 */
router.delete('/:id', candidateController.deleteCandidate);

export default router; 