import express from 'express';
import { createCandidate } from '../controllers/candidateController';
import { validateCandidateCreation, checkValidationResult } from '../middleware/validators';
import upload from '../middleware/upload';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Candidate:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - email
 *         - educacion
 *         - experiencia
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del candidato (UUID)
 *         nombre:
 *           type: string
 *           description: Nombre del candidato
 *         apellido:
 *           type: string
 *           description: Apellido del candidato
 *         email:
 *           type: string
 *           format: email
 *           description: Email del candidato (único)
 *         telefono:
 *           type: string
 *           description: Teléfono del candidato
 *         direccion:
 *           type: string
 *           description: Dirección del candidato
 *         educacion:
 *           type: string
 *           description: Educación del candidato
 *         experiencia:
 *           type: string
 *           description: Experiencia del candidato
 *         cv_path:
 *           type: string
 *           description: Ruta al archivo CV del candidato
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 */

/**
 * @swagger
 * /candidatos:
 *   post:
 *     summary: Crear un nuevo candidato
 *     description: Crea un nuevo candidato en el sistema con la información proporcionada
 *     tags: [Candidatos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - email
 *               - educacion
 *               - experiencia
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *               educacion:
 *                 type: string
 *               experiencia:
 *                 type: string
 *               cv:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Candidato creado exitosamente
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
 *                   example: Candidato creado exitosamente
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     nombre:
 *                       type: string
 *                       example: Juan
 *                     apellido:
 *                       type: string
 *                       example: Pérez
 *                     email:
 *                       type: string
 *                       example: juan.perez@ejemplo.com
 *       400:
 *         description: Datos inválidos o incompletos
 *       409:
 *         description: Email ya registrado
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  '/',
  upload.single('cv'), // Handle file upload (cv field is optional)
  validateCandidateCreation,
  checkValidationResult,
  createCandidate
);

export default router; 