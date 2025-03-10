import express from 'express';
import cors from 'cors';
import path from 'path';
import { candidateRoutes } from './infrastructure/routes/candidateRoutes';
import { errorHandler } from './infrastructure/middlewares/errorHandler';

const app = express();

// Configuración básica
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api/candidates', candidateRoutes);

// Manejo de errores (siempre al final)
app.use(errorHandler);

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
