import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Importar rutas
import authRoutes from '../features/auth/routes/authRoutes';
import userRoutes from '../features/users/routes/userRoutes';
import candidateRoutes from '../features/candidates/routes/candidateRoutes';
import documentRoutes from '../features/candidates/routes/documentRoutes';

const router = express.Router();

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Candidatos',
      version: '1.0.0',
      description: 'API para gestionar candidatos y documentos',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/**/*.ts'], // Rutas a los archivos con anotaciones de Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Ruta para la documentación de Swagger
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerSpec));

// Ruta principal
router.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Registrar rutas
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/candidates', candidateRoutes);
router.use('/', documentRoutes);

export default router; 