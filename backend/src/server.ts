import 'reflect-metadata';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { initializeDatabase } from './infrastructure/database/config/database';
import { setupRoutes } from './infrastructure/routes';
import { errorHandler } from './infrastructure/middlewares/errorHandler';
import { specs } from './infrastructure/swagger/swagger';
import cors from 'cors';

dotenv.config();

export async function createServer(): Promise<Express> {
  // Inicializar la base de datos primero
  await initializeDatabase();

  const app = express();
  
  app.use(cors());
  app.use(express.json());

  // Ruta raíz
  app.get('/', (req, res) => {
    res.status(200).send('Hola LTI!');
  });

  const router = setupRoutes();
  app.use('/api', router);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  app.use(errorHandler);

  return app;
}

if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  
  createServer()
    .then(app => {
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
      });
    })
    .catch((error) => {
      console.error('Failed to initialize app:', error);
      process.exit(1);
    });
} 