import express from 'express';
import {
  getEducationSuggestions,
  getExperienceSuggestions,
} from '../controllers/autocompleteController';

const router = express.Router();

// GET education suggestions
router.get('/education', getEducationSuggestions);

// GET work experience suggestions
router.get('/experience', getExperienceSuggestions);

export default router;
