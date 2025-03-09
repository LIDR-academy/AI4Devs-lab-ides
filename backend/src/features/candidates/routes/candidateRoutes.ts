import { Router } from 'express';
import { CandidateController } from '../controllers/candidateController';
import { authenticate, authorize } from '../../auth/middlewares/authMiddleware';
import { paginationMiddleware } from '../../../middlewares/paginationMiddleware';

const router = Router();
const candidateController = new CandidateController();

/**
 * @swagger
 * tags:
 *   name: Candidates
 *   description: Operaciones relacionadas con candidatos
 */

/**
 * @swagger
 * /api/candidates:
 *   get:
 *     summary: Obtener todos los candidatos
 *     description: Obtiene una lista paginada de candidatos con filtros opcionales
 *     tags: [Candidates]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Búsqueda general por nombre, apellido, email o resumen
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, hired, rejected]
 *         description: Estado del candidato
 *       - in: query
 *         name: skills
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Habilidades del candidato
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Ubicación del candidato
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
 *         description: Número de resultados por página
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [firstName, lastName, email, createdAt, updatedAt]
 *           default: createdAt
 *         description: Campo por el que ordenar
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Orden de los resultados
 *     responses:
 *       200:
 *         description: Lista de candidatos
 *         headers:
 *           Link:
 *             description: Enlaces de paginación
 *             schema:
 *               type: string
 *           X-Total-Count:
 *             description: Número total de candidatos
 *             schema:
 *               type: integer
 *           X-Total-Pages:
 *             description: Número total de páginas
 *             schema:
 *               type: integer
 *           X-Current-Page:
 *             description: Página actual
 *             schema:
 *               type: integer
 *           X-Page-Limit:
 *             description: Número de resultados por página
 *             schema:
 *               type: integer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Candidate'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *                     nextPage:
 *                       type: integer
 *                       example: 2
 *                       nullable: true
 *                     prevPage:
 *                       type: integer
 *                       example: null
 *                       nullable: true
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  '/',
  authenticate,
  paginationMiddleware,
  CandidateController.validateSearchCandidates,
  (req, res) => candidateController.getAllCandidates(req, res)
);

/**
 * @swagger
 * /api/candidates/{id}:
 *   get:
 *     summary: Obtener un candidato por ID
 *     description: Obtiene los detalles de un candidato específico
 *     tags: [Candidates]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del candidato
 *     responses:
 *       200:
 *         description: Detalles del candidato
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Candidate'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  '/:id',
  authenticate,
  CandidateController.validateCandidateId,
  (req, res) => candidateController.getCandidateById(req, res)
);

/**
 * @swagger
 * /api/candidates:
 *   post:
 *     summary: Crear un nuevo candidato
 *     description: Crea un nuevo candidato con la información proporcionada
 *     tags: [Candidates]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCandidateInput'
 *     responses:
 *       201:
 *         description: Candidato creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Candidate'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       409:
 *         description: Conflicto, el email ya está en uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  '/',
  authenticate,
  CandidateController.validateCreateCandidate,
  (req, res) => candidateController.createCandidate(req, res)
);

/**
 * @swagger
 * /api/candidates/{id}:
 *   put:
 *     summary: Actualizar un candidato
 *     description: Actualiza la información de un candidato existente
 *     tags: [Candidates]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del candidato
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCandidateInput'
 *     responses:
 *       200:
 *         description: Candidato actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Candidate'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         description: Conflicto, el email ya está en uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put(
  '/:id',
  authenticate,
  CandidateController.validateCandidateId,
  CandidateController.validateUpdateCandidate,
  (req, res) => candidateController.updateCandidate(req, res)
);

/**
 * @swagger
 * /api/candidates/{id}:
 *   delete:
 *     summary: Eliminar un candidato
 *     description: Elimina un candidato existente
 *     tags: [Candidates]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del candidato
 *     responses:
 *       200:
 *         description: Candidato eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Candidato eliminado correctamente
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete(
  '/:id',
  authenticate,
  CandidateController.validateCandidateId,
  (req, res) => candidateController.deleteCandidate(req, res)
);

export default router; 