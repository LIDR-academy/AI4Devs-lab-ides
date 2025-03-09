import express from 'express';
import { 
  crearCandidato, 
  subirCVCandidato, 
  obtenerCandidatoPorId,
  obtenerCandidatos,
  upload
} from '../controllers/candidatoController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Candidatos
 *   description: Operaciones relacionadas con candidatos
 */

/**
 * @swagger
 * /api/candidatos:
 *   get:
 *     summary: Obtener todos los candidatos
 *     tags: [Candidatos]
 */
router.get('/', obtenerCandidatos);

/**
 * @swagger
 * /api/candidatos:
 *   post:
 *     summary: Crear un nuevo candidato
 *     tags: [Candidatos]
 */
router.post('/', crearCandidato);

/**
 * @swagger
 * /api/candidatos/{id_candidato}/documentos:
 *   post:
 *     summary: Subir CV de un candidato
 *     tags: [Candidatos]
 */
router.post('/:id_candidato/documentos', upload.single('archivo'), subirCVCandidato);

/**
 * @swagger
 * /api/candidatos/{id_candidato}:
 *   get:
 *     summary: Obtener candidato por ID
 *     tags: [Candidatos]
 */
router.get('/:id_candidato', obtenerCandidatoPorId);

export default router; 