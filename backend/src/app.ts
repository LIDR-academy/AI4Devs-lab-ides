import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import candidateRoutes from './routes/candidateRoutes';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api', candidateRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});