import { Router } from 'express';
import { CandidateController } from '../controllers/candidate.controller';
import { uploadConfig, handleMulterError } from '../config/multer.config';

export const candidateRouter = Router();
const controller = new CandidateController();

// Ruta para enviar una aplicación completa
candidateRouter.post('/applications', 
  uploadConfig.single('document'),
  controller.submitApplication.bind(controller)
);

// Rutas existentes
candidateRouter.post('/', controller.createCandidate.bind(controller));
candidateRouter.get('/email/:email', controller.findCandidateByEmail.bind(controller));

// Ruta para subir documentos con Multer
candidateRouter.post(
  '/:id/document',
  uploadConfig.single('file'),
  controller.addDocument.bind(controller)
);

// Error handler para Multer
candidateRouter.use(handleMulterError);

export default candidateRouter; 