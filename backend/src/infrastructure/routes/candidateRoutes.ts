import { Router } from 'express';
import { CandidateController } from '../controllers/CandidateController';
import { upload } from '../middlewares/fileUpload';
import { PrismaCandidateRepository } from '../repositories/PrismaCandidateRepository';
import { CandidateService } from '../../domain/services/CandidateService';
import { CreateCandidateUseCase } from '../../application/useCases/CreateCandidateUseCase';
import { EncryptionService } from '../services/EncryptionService';

const router = Router();

// Inicialización de dependencias
const encryptionService = new EncryptionService();
const candidateRepository = new PrismaCandidateRepository(encryptionService);
const candidateService = new CandidateService(candidateRepository, encryptionService);
const createCandidateUseCase = new CreateCandidateUseCase(candidateService);
const candidateController = new CandidateController(createCandidateUseCase);

// GET - Obtener todos los candidatos
router.get('/', async (req, res, next) => {
  try {
    const candidates = await candidateRepository.findAll();
    res.json(candidates);
  } catch (error) {
    next(error);
  }
});

// POST - Crear un candidato
router.post('/', 
  upload.single('cv'),  // Primero procesamos el archivo
  (req, res, next) => {
    console.log('Después de multer - Body:', req.body);  // Para debugging
    console.log('Después de multer - File:', req.file);  // Para debugging
    next();
  },
  (req, res, next) => candidateController.createCandidate(req, res, next)
);

router.get('/:id/decrypt', async (req, res, next) => {
  try {
    const candidate = await candidateRepository.findById(req.params.id);
    if (!candidate) {
      throw new Error('Candidato no encontrado');
    }

    res.json({
      correo: candidate.correo,
      telefono: candidate.telefono,
      direccion: candidate.direccion
    });
  } catch (error) {
    next(error);
  }
});

export { router as candidateRoutes };