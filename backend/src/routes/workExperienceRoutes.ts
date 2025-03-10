import express from 'express';
import { WorkExperienceController } from '../controllers/workExperienceController';

const router = express.Router();
const workExperienceController = new WorkExperienceController();

/**
 * @route GET /api/candidates/:candidateId/work-experience
 * @desc Obtener todos los registros de experiencia laboral de un candidato
 * @access Public
 */
router.get('/candidates/:candidateId/work-experience', workExperienceController.getWorkExperienceByCandidateId.bind(workExperienceController));

/**
 * @route GET /api/work-experience/:id
 * @desc Obtener un registro de experiencia laboral por ID
 * @access Public
 */
router.get('/work-experience/:id', workExperienceController.getWorkExperienceById.bind(workExperienceController));

/**
 * @route POST /api/candidates/:candidateId/work-experience
 * @desc Crear un nuevo registro de experiencia laboral para un candidato
 * @access Public
 */
router.post('/candidates/:candidateId/work-experience', workExperienceController.createWorkExperience.bind(workExperienceController));

/**
 * @route PUT /api/work-experience/:id
 * @desc Actualizar un registro de experiencia laboral
 * @access Public
 */
router.put('/work-experience/:id', workExperienceController.updateWorkExperience.bind(workExperienceController));

/**
 * @route DELETE /api/work-experience/:id
 * @desc Eliminar un registro de experiencia laboral
 * @access Public
 */
router.delete('/work-experience/:id', workExperienceController.deleteWorkExperience.bind(workExperienceController));

export default router; 