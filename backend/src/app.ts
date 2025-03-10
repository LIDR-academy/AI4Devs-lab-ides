import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes/index';

const app = express();

// Configuración básica
app.use(cors());

// Configurar body parsers
app.use(express.json({ limit: '2mb' }));
app.use(
  express.urlencoded({
    extended: true,
    limit: '2mb',
    parameterLimit: 100000,
  }),
);

// Rutas
app.use('/api', routes);

// Manejador de errores
app.use(errorHandler);

export default app;
