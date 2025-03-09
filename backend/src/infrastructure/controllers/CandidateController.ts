import { Request, Response, Router } from 'express';
import multer from 'multer';
import { CreateCandidateDto } from '../dtos/CreateCandidateDto';
import { CreateCandidateUseCase } from '../../application/useCases/CreateCandidate';
import { GetCandidatesUseCase } from '../../application/useCases/GetCandidates';
import { validateCreateCandidateDto } from '../validators/candidateValidator';
import { ErrorType } from '../../domain/shared/Result';

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/cvs');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export class CandidateController {
  public router: Router;

  constructor(
    private createCandidateUseCase: CreateCandidateUseCase,
    private getCandidatesUseCase: GetCandidatesUseCase
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /api/candidates:
     *   post:
     *     summary: Create a new candidate
     *     tags: [Candidates]
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               cv:
     *                 type: string
     *                 format: binary
     *               candidate:
     *                 $ref: '#/components/schemas/CreateCandidateDto'
     *     responses:
     *       201:
     *         description: Candidate created successfully
     *       400:
     *         description: Invalid input
     *       500:
     *         description: Server error
     */
    this.router.post('/', upload.single('cv'), this.createCandidate.bind(this));
    this.router.get('/', this.getCandidates.bind(this));
  }

  private async createCandidate(req: Request, res: Response) {
    try {
      console.log('Request body:', req.body);
      console.log('File:', req.file);

      if (!req.body.candidate) {
        return res.status(400).json({
          error: 'No se proporcionaron datos del candidato'
        });
      }

      let candidateData;
      try {
        candidateData = JSON.parse(req.body.candidate);
      } catch (error) {
        return res.status(400).json({
          error: 'Los datos del candidato no tienen un formato JSON válido'
        });
      }

      const result = await this.createCandidateUseCase.execute({
        ...candidateData,
        file: req.file
      });

      if (result.isOk()) {
        return res.status(201).json({
          message: 'Candidato creado exitosamente',
          data: result.getValue()
        });
      } else {
        const error = result.getError();
        return res.status(400).json({
          error: typeof error === 'string' ? error : error.message,
          details: typeof error === 'string' ? undefined : error.details
        });
      }
    } catch (error) {
      console.error('Error creating candidate:', error);
      return res.status(500).json({
        error: 'Error interno del servidor al crear el candidato'
      });
    }
  }

  private async getCandidates(req: Request, res: Response) {
    try {
      const result = await this.getCandidatesUseCase.execute();
      
      if (result.isOk()) {
        return res.status(200).json(result.getValue());
      } else {
        const error = result.getError();
        return res.status(400).json({
          error: typeof error === 'string' ? error : error.message
        });
      }
    } catch (error) {
      console.error('Error getting candidates:', error);
      return res.status(500).json({
        error: 'Error interno del servidor al obtener los candidatos'
      });
    }
  }
} 