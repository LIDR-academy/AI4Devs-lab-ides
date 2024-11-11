import { Router } from 'express';
import { candidateController } from '../controllers/candidateController';
import { upload } from '../middleware/fileUpload';

const router = Router();

/**
 * @swagger
 * /candidates:
 *   get:
 *     summary: Obtiene todos los candidatos
 *     responses:
 *       200:
 *         description: Lista de candidatos
 */
router.get('/', candidateController.getAllCandidates);

/**
 * @swagger
 * /candidates:
 *   post:
 *     summary: Crea un nuevo candidato
 *     responses:
 *       201:
 *         description: Candidato creado
 */
router.post('/', upload.single('cv'), candidateController.createCandidate);

/**
 * @swagger
 * /candidates/{id}:
 *   get:
 *     summary: Obtiene un candidato por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del candidato
 */
router.get('/:id', candidateController.getCandidateById);

/**
 * @swagger
 * /candidates/{id}:
 *   put:
 *     summary: Actualiza un candidato
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Candidato actualizado
 */
router.put('/:id', upload.single('cv'), candidateController.updateCandidate);

/**
 * @swagger
 * /candidates/{id}:
 *   delete:
 *     summary: Elimina un candidato
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Candidato eliminado
 */
router.delete('/:id', candidateController.deleteCandidate);

export default router; 