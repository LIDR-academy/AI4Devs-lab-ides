import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import routes from './routes';
import authRoutes from './features/auth/routes/authRoutes';
import userRoutes from './features/users/routes/userRoutes';
import candidateRoutes from './features/candidates/routes/candidateRoutes';
import documentRoutes from './features/candidates/routes/documentRoutes';
import { errorHandler } from './middlewares/errorMiddleware';
import { config } from './config/config';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger';

// Cargar variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();
const PORT = config.server.port;

// Middlewares
app.use(cors(config.cors));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
    },
  },
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configurar Swagger
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API del Sistema ATS - Documentación',
}));

// Registrar rutas directamente
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api', documentRoutes);

// Ruta de inicio
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API del Sistema ATS</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f7fafc;
        }
        h1 {
          color: #2c5282;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 10px;
        }
        .card {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-bottom: 20px;
        }
        .btn {
          display: inline-block;
          background-color: #4299e1;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
          font-weight: 600;
          transition: background-color 0.3s;
        }
        .btn:hover {
          background-color: #3182ce;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .feature {
          background-color: #ebf8ff;
          border-left: 4px solid #4299e1;
          padding: 15px;
          border-radius: 4px;
        }
        .feature h3 {
          margin-top: 0;
          color: #2b6cb0;
        }
      </style>
    </head>
    <body>
      <h1>API del Sistema de Gestión de Candidatos</h1>
      
      <div class="card">
        <h2>Bienvenido al Backend del Sistema ATS</h2>
        <p>Esta API proporciona todas las funcionalidades necesarias para gestionar candidatos, documentos y usuarios en el sistema.</p>
        <a href="/api-docs" class="btn">Ver Documentación API</a>
      </div>
      
      <div class="features">
        <div class="feature">
          <h3>Gestión de Candidatos</h3>
          <p>Crea, actualiza, busca y elimina perfiles de candidatos.</p>
        </div>
        <div class="feature">
          <h3>Gestión de Documentos</h3>
          <p>Sube, descarga y gestiona documentos con encriptación opcional.</p>
        </div>
        <div class="feature">
          <h3>Autenticación Segura</h3>
          <p>Sistema completo de autenticación con JWT y control de acceso.</p>
        </div>
        <div class="feature">
          <h3>Validación Robusta</h3>
          <p>Validación de datos con express-validator y Zod.</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
  console.log(`Documentación de la API disponible en http://localhost:${PORT}/api-docs`);
});

export default app;