import { Router } from 'express';
import { CandidateController } from '../controllers/CandidateController';
import { upload } from '../middlewares/fileUpload';
import { PrismaCandidateRepository } from '../repositories/PrismaCandidateRepository';
import { CandidateService } from '../../domain/services/CandidateService';
import { CreateCandidateUseCase } from '../../application/useCases/CreateCandidateUseCase';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Inicialización de dependencias
const candidateRepository = new PrismaCandidateRepository();
const candidateService = new CandidateService(candidateRepository);
const createCandidateUseCase = new CreateCandidateUseCase(candidateService);
const candidateController = new CandidateController(createCandidateUseCase);

// Rutas
router.post('/', 
  upload.single('cv'),  // Primero procesamos el archivo
  (req, res, next) => {
    console.log('Después de multer - Body:', req.body);  // Para debugging
    console.log('Después de multer - File:', req.file);  // Para debugging
    next();
  },
  (req, res, next) => candidateController.createCandidate(req, res, next)
);

router.get('/', async (req, res, next) => {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(candidates);
  } catch (error) {
    next(error);
  }
});

export { router as candidateRoutes }; 