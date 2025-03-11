import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger';
import { errorHandler } from './middlewares/errorMiddleware';
import routes from './routes';
import path from 'path';

// Crear la aplicación Express
const app = express();

// Configuración de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Middleware de seguridad
app.use(helmet());

// Logging
app.use(morgan('dev'));

// Directorio de archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ruta principal
app.get('/', (req: Request, res: Response) => {
  res.send(`
    <html>
      <head>
        <title>API del Sistema de Gestión de Candidatos</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: #333; }
          .container { max-width: 800px; margin: 0 auto; }
          .endpoint { background: #f4f4f4; padding: 10px; margin-bottom: 10px; border-radius: 5px; }
          a { color: #0066cc; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>API del Sistema de Gestión de Candidatos</h1>
          <p>Bienvenido a la API del Sistema de Gestión de Candidatos.</p>
          <p>Esta API proporciona endpoints para gestionar candidatos, documentos, usuarios y autenticación.</p>
          <p>Para ver la documentación completa, visite <a href="/api-docs">/api-docs</a>.</p>
        </div>
      </body>
    </html>
  `);
});

// Documentación de la API con Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Registrar rutas
app.use('/api', routes);

// Middleware de manejo de errores
app.use(errorHandler);

export default app; 