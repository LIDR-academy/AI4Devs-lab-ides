import express from 'express';
import multer from 'multer';
import { CandidateController } from './controller';

// Configure multer for file uploads
const upload = multer({
  dest: 'temp/', // Temporary storage
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export const configureCandidateRoutes = (
  app: express.Express,
  candidateController: CandidateController,
): void => {
  const router = express.Router();

  // GET /api/candidates - Get all candidates
  router.get('/', candidateController.getAllCandidates);

  // GET /api/candidates/:id - Get a candidate by ID
  router.get('/:id', candidateController.getCandidateById);

  // POST /api/candidates - Create a new candidate
  router.post(
    '/',
    upload.single('cvFile'),
    candidateController.createCandidate,
  );

  // PUT /api/candidates/:id - Update a candidate
  router.put(
    '/:id',
    upload.single('cvFile'),
    candidateController.updateCandidate,
  );

  // DELETE /api/candidates/:id - Delete a candidate
  router.delete('/:id', candidateController.deleteCandidate);

  // GET /api/candidates/:id/cv - Download a candidate's CV
  router.get('/:id/cv', candidateController.downloadCv);

  // GET /api/candidates/statistics - Get candidate statistics
  router.get('/statistics', candidateController.getStatistics);

  // GET /api/candidates/suggestions/education - Get education suggestions
  router.get(
    '/suggestions/education',
    candidateController.getEducationSuggestions,
  );

  // GET /api/candidates/suggestions/experience - Get experience suggestions
  router.get(
    '/suggestions/experience',
    candidateController.getExperienceSuggestions,
  );

  // Register the router
  app.use('/api/candidates', router);
};
