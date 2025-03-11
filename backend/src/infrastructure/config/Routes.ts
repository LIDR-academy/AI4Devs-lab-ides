import express, { Express } from 'express';
import path from 'path';
import fs from 'fs';
import { AuthController } from '../controllers/AuthController';
import { CandidateController } from '../controllers/CandidateController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { UploadMiddleware } from '../middlewares/UploadMiddleware';

export class Routes {
  private app: Express;
  private authController: AuthController;
  private candidateController: CandidateController;
  private authMiddleware: AuthMiddleware;
  private uploadMiddleware: UploadMiddleware;

  constructor(
    app: Express,
    authController: AuthController,
    candidateController: CandidateController,
    authMiddleware: AuthMiddleware,
    uploadMiddleware: UploadMiddleware
  ) {
    this.app = app;
    this.authController = authController;
    this.candidateController = candidateController;
    this.authMiddleware = authMiddleware;
    this.uploadMiddleware = uploadMiddleware;
  }

  setup() {
    // Ruta de prueba
    this.app.get('/', (req, res) => {
      res.send('Hola LTI!');
    });

    // Rutas de autenticación
    this.app.post(
      '/register',
      this.authController.registerValidationRules(),
      this.authController.register.bind(this.authController)
    );

    this.app.post(
      '/login',
      this.authController.loginValidationRules(),
      this.authController.login.bind(this.authController)
    );

    // Rutas de candidatos
    this.app.post(
      '/candidates',
      this.authMiddleware.authenticate(),
      this.uploadMiddleware.single('cv'),
      this.candidateController.createCandidateValidationRules(),
      this.candidateController.createCandidate.bind(this.candidateController)
    );

    this.app.get(
      '/candidates',
      this.authMiddleware.authenticate(),
      this.candidateController.getAllCandidates.bind(this.candidateController)
    );

    // Ruta para descargar un currículum
    this.app.get('/cv/:filename', this.authMiddleware.authenticate(), (req, res) => {
      const filename = req.params.filename;
      const filePath = path.join(__dirname, '../../../uploads', filename);
      
      console.log('Requested file:', filename);
      console.log('File path:', filePath);
      
      // Verificar si el archivo existe
      if (fs.existsSync(filePath)) {
        res.download(filePath);
      } else {
        res.status(404).json({ message: 'File not found' });
      }
    });

    // Middleware para manejar errores
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });
  }
} 