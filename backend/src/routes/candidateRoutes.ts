import { Router } from 'express';
import candidateController from '../controllers/candidateController';
import upload from '../config/multer';
import { createCandidateLimiter } from '../middlewares/rateLimiter';

const router = Router();

/**
 * @swagger
 * /api/candidates/recent:
 *   get:
 *     summary: Obtiene los candidatos recientes
 *     description: Retorna los últimos candidatos añadidos al sistema
 *     tags: [Candidates]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 3
 *           minimum: 1
 *           maximum: 10
 *         description: Número de candidatos a retornar
 *     responses:
 *       200:
 *         description: Lista de candidatos recientes obtenida exitosamente
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error del servidor
 */
router.get('/recent', candidateController.getRecentCandidates);

/**
 * @swagger
 * /api/candidates:
 *   get:
 *     summary: Obtiene todos los candidatos
 *     description: Retorna una lista paginada de candidatos
 *     tags: [Candidates]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de candidatos por página
 *     responses:
 *       200:
 *         description: Lista de candidatos obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */
router.get('/', candidateController.getAllCandidates);

/**
 * @swagger
 * /api/candidates:
 *   post:
 *     summary: Crea un nuevo candidato
 *     description: Crea un nuevo candidato con su información personal, educación, experiencia laboral y CV
 *     tags: [Candidates]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - education
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Nombre del candidato
 *               lastName:
 *                 type: string
 *                 description: Apellido del candidato
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del candidato
 *               phone:
 *                 type: string
 *                 description: Teléfono del candidato
 *               address:
 *                 type: string
 *                 description: Dirección del candidato
 *               education:
 *                 type: string
 *                 format: json
 *                 description: Información educativa del candidato en formato JSON
 *               workExperience:
 *                 type: string
 *                 format: json
 *                 description: Experiencia laboral del candidato en formato JSON
 *               cvFile:
 *                 type: string
 *                 format: binary
 *                 description: Archivo CV del candidato (PDF o DOCX)
 *     responses:
 *       201:
 *         description: Candidato creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El email ya está registrado
 *       500:
 *         description: Error del servidor
 */
router.post('/', createCandidateLimiter, upload.single('cvFile'), candidateController.createCandidate);

/**
 * @swagger
 * /api/candidates/{id}:
 *   get:
 *     summary: Obtiene un candidato por su ID
 *     description: Retorna un candidato específico con su información completa
 *     tags: [Candidates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del candidato
 *     responses:
 *       200:
 *         description: Candidato encontrado
 *       404:
 *         description: Candidato no encontrado
 */
router.get('/:id', candidateController.getCandidateById);

export default router; 