import express from 'express';
import { EducationController } from '../controllers/educationController';

const router = express.Router();
const educationController = new EducationController();

/**
 * @route GET /api/candidates/:candidateId/education
 * @desc Obtener todos los registros de educación de un candidato
 * @access Public
 */
router.get('/candidates/:candidateId/education', educationController.getEducationByCandidateId.bind(educationController));

/**
 * @route GET /api/education/:id
 * @desc Obtener un registro de educación por ID
 * @access Public
 */
router.get('/education/:id', educationController.getEducationById.bind(educationController));

/**
 * @route POST /api/candidates/:candidateId/education
 * @desc Crear un nuevo registro de educación para un candidato
 * @access Public
 */
router.post('/candidates/:candidateId/education', educationController.createEducation.bind(educationController));

/**
 * @route PUT /api/education/:id
 * @desc Actualizar un registro de educación
 * @access Public
 */
router.put('/education/:id', educationController.updateEducation.bind(educationController));

/**
 * @route DELETE /api/education/:id
 * @desc Eliminar un registro de educación
 * @access Public
 */
router.delete('/education/:id', educationController.deleteEducation.bind(educationController));

export default router; 