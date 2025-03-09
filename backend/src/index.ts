import express from 'express';
import dotenv from 'dotenv';
import candidateRoutes from './routes/candidateRoutes';
import { errorHandler } from './middleware/errorMiddleware';
import { swaggerUi, specs, swaggerOptions } from './config/swagger';
import path from 'path';
import prisma from './prisma'; // Importamos prisma desde el nuevo módulo

dotenv.config();
export const app = express();
const port = process.env.PORT || 3010;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api/candidates', candidateRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

app.get('/', (req, res) => {
  res.send('Candidate Management API');
});

app.use(errorHandler);
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(
      `API Documentation available at http://localhost:${port}/api-docs`,
    );
  });
}

export default prisma;
