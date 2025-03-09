import crypto from 'crypto';
import express from 'express';
import multer from 'multer';
import path from 'path';
import { CandidateController } from './controller';

// Configure multer for file uploads with custom storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Guardar directamente en la carpeta uploads
    cb(null, path.join(__dirname, '../../../uploads/'));
  },
  filename: function (req, file, cb) {
    // Generación de nombre seguro directamente
    const fileExtension = path.extname(file.originalname);
    const randomString = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    cb(null, `${timestamp}-${randomString}${fileExtension}`);
  },
});

// Validación de tipo de archivo
const fileFilter = function (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
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

  // GET /api/candidates/statistics - Get statistics
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
