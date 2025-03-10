import express from 'express';
import { AutocompleteController } from '../controllers/autocompleteController';

const router = express.Router();
const autocompleteController = new AutocompleteController();

/**
 * @route GET /api/autocomplete/institutions
 * @desc Buscar instituciones educativas
 * @access Public
 */
router.get('/autocomplete/institutions', autocompleteController.searchInstitutions.bind(autocompleteController));

/**
 * @route GET /api/autocomplete/companies
 * @desc Buscar empresas
 * @access Public
 */
router.get('/autocomplete/companies', autocompleteController.searchCompanies.bind(autocompleteController));

/**
 * @route GET /api/autocomplete/degrees
 * @desc Buscar títulos académicos
 * @access Public
 */
router.get('/autocomplete/degrees', autocompleteController.searchDegrees.bind(autocompleteController));

/**
 * @route GET /api/autocomplete/positions
 * @desc Buscar posiciones laborales
 * @access Public
 */
router.get('/autocomplete/positions', autocompleteController.searchPositions.bind(autocompleteController));

export default router; 