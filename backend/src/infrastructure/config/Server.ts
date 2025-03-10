import express from 'express';
import cors from 'cors';
import { DependencyInjection } from './DependencyInjection';
import { Routes } from './Routes';

export class Server {
  private app: express.Express;
  private port: number;
  private dependencyInjection: DependencyInjection;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.dependencyInjection = new DependencyInjection();
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors({
      origin: 'http://localhost:3000', // Permite el acceso desde el frontend
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
      credentials: true, // Permite el envío de cookies
    }));
  }

  private configureRoutes() {
    const authController = this.dependencyInjection.getAuthController();
    const candidateController = this.dependencyInjection.getCandidateController();
    const authMiddleware = this.dependencyInjection.getAuthMiddleware();
    const uploadMiddleware = this.dependencyInjection.getUploadMiddleware();

    const routes = new Routes(
      this.app,
      authController,
      candidateController,
      authMiddleware,
      uploadMiddleware
    );

    routes.setup();
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}`);
    });
  }
} 