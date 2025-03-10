import express from 'express';
import { body } from 'express-validator';
import { createCandidate, getAllCandidates, getCandidateById, updateCandidate, deleteCandidate } from '../controllers/candidateController';
import { validateRequest } from '../middlewares/validateRequest';
import { uploadResume } from '../middlewares/uploadFile';

const router = express.Router();

// Validaciones para la creación y actualización de candidatos
const candidateValidations = [
  body('firstName').notEmpty().withMessage('El nombre es obligatorio'),
  body('lastName').notEmpty().withMessage('El apellido es obligatorio'),
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  body('phone').optional().isMobilePhone('any').withMessage('El número de teléfono no es válido'),
  validateRequest
];

// Rutas para candidatos
router.post('/', uploadResume, candidateValidations, createCandidate);
router.get('/', getAllCandidates);
router.get('/:id', getCandidateById);
router.put('/:id', uploadResume, candidateValidations, updateCandidate);
router.delete('/:id', deleteCandidate);

export default router; 