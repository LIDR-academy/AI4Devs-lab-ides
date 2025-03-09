import { Router } from 'express';
import { CandidateController } from '../controllers/CandidateController';
import { CreateCandidateUseCase } from '../../application/useCases/CreateCandidate';
import { GetCandidatesUseCase } from '../../application/useCases/GetCandidates';
import { PostgresCandidateRepository } from '../database/repositories/PostgresCandidateRepository';
import { LocalFileUploader } from '../services/LocalFileUploader';

export function setupRoutes(): Router {
  const router = Router();
  
  const candidateRepository = new PostgresCandidateRepository();
  const fileUploader = new LocalFileUploader();
  const createCandidateUseCase = new CreateCandidateUseCase(candidateRepository, fileUploader);
  const getCandidatesUseCase = new GetCandidatesUseCase(candidateRepository);
  const candidateController = new CandidateController(
    createCandidateUseCase,
    getCandidatesUseCase
  );

  // Rutas de candidatos
  router.use('/candidates', candidateController.router);

  return router;
} 