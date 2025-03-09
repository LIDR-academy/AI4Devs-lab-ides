import express from 'express';
import { candidateController } from '../controllers/candidateController';
import upload from '../middlewares/upload';
import { validate } from '../middlewares/validate';
import { createCandidateSchema, getCandidateByIdSchema } from '../utils/validationSchemas';

const router = express.Router();

// Ruta para crear un nuevo candidato
router.post(
  '/',
  upload.single('cv'), // Middleware para manejar la carga del CV
  validate(createCandidateSchema), // Middleware para validar los datos
  candidateController.createCandidate
);

// Ruta para obtener todos los candidatos
router.get('/', candidateController.getCandidates);

// Ruta para obtener un candidato por ID
router.get(
  '/:id',
  validate(getCandidateByIdSchema),
  candidateController.getCandidateById
);

export default router; 