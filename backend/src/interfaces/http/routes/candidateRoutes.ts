import { Router } from 'express';
import { CandidateController } from '../controllers/CandidateController';
import { CreateCandidateUseCase } from '../../../application/use-cases/candidate/CreateCandidateUseCase';
import { PrismaCandidateRepository } from '../../../infrastructure/persistence/PrismaCandidateRepository';
import { PrismaClient } from '@prisma/client';
import { validateCreateCandidate } from '../middleware/validationMiddleware';
import { sanitizeInputs } from '../middleware/sanitizationMiddleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const candidateRouter = (prismaClient: PrismaClient): Router => {
  const router = Router();

  // Asegurarse de que el directorio de uploads existe
  const uploadDir = path.join(__dirname, '../../../../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Configuración de multer para subir archivos
  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
      // Generar un nombre de archivo único para evitar colisiones
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, 'cv-' + uniqueSuffix + ext);
    }
  });

  // Filtro para aceptar solo ciertos tipos de archivos
  const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Aceptar solo PDFs, docs, docx
    const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se admiten PDF, DOC y DOCX.'));
    }
  };

  const upload = multer({ 
    storage, 
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB límite
    }
  });

  // Repositorios
  const candidateRepository = new PrismaCandidateRepository(prismaClient);

  // Casos de uso
  const createCandidateUseCase = new CreateCandidateUseCase(candidateRepository);

  // Controlador
  const candidateController = new CandidateController(createCandidateUseCase);

  /**
   * @swagger
   * /api/candidates:
   *   post:
   *     summary: Crear un nuevo candidato
   *     tags: [Candidates]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - firstName
   *               - lastName
   *               - email
   *               - phone
   *               - cv
   *             properties:
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               phone:
   *                 type: string
   *               address:
   *                 type: string
   *               city:
   *                 type: string
   *               state:
   *                 type: string
   *               postalCode:
   *                 type: string
   *               country:
   *                 type: string
   *               currentPosition:
   *                 type: string
   *               currentCompany:
   *                 type: string
   *               yearsOfExperience:
   *                 type: integer
   *               notes:
   *                 type: string
   *               skills:
   *                 type: string
   *                 description: JSON array of skills
   *               educations:
   *                 type: string
   *                 description: JSON array of educations
   *               experiences:
   *                 type: string
   *                 description: JSON array of work experiences
   *               tags:
   *                 type: string
   *                 description: JSON array of tags
   *               cv:
   *                 type: string
   *                 format: binary
   *     responses:
   *       201:
   *         description: Candidato creado con éxito
   *       400:
   *         description: Datos de entrada inválidos
   *       500:
   *         description: Error del servidor
   */
  router.post('/', upload.single('cv'), sanitizeInputs, validateCreateCandidate, candidateController.create);

  /**
   * @swagger
   * /api/candidates:
   *   get:
   *     summary: Obtener todos los candidatos
   *     tags: [Candidates]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de candidatos
   *       500:
   *         description: Error del servidor
   */
  router.get('/', candidateController.listAll);

  /**
   * @swagger
   * /api/candidates/{id}:
   *   get:
   *     summary: Obtener un candidato por ID
   *     tags: [Candidates]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID del candidato
   *     responses:
   *       200:
   *         description: Datos del candidato
   *       404:
   *         description: Candidato no encontrado
   *       500:
   *         description: Error del servidor
   */
  router.get('/:id', candidateController.getById);

  /**
   * @swagger
   * /api/candidates/{id}:
   *   put:
   *     summary: Actualizar un candidato
   *     tags: [Candidates]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID del candidato
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               phone:
   *                 type: string
   *               # ... (resto de los campos)
   *     responses:
   *       200:
   *         description: Candidato actualizado con éxito
   *       404:
   *         description: Candidato no encontrado
   *       400:
   *         description: Datos de entrada inválidos
   *       500:
   *         description: Error del servidor
   */
  router.put('/:id', candidateController.update);

  /**
   * @swagger
   * /api/candidates/{id}:
   *   delete:
   *     summary: Eliminar un candidato
   *     tags: [Candidates]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID del candidato
   *     responses:
   *       200:
   *         description: Candidato eliminado con éxito
   *       404:
   *         description: Candidato no encontrado
   *       500:
   *         description: Error del servidor
   */
  router.delete('/:id', candidateController.delete);

  return router;
}; 