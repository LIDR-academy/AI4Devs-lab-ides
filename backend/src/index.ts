import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';
import { createCandidate } from './controllers/candidateController';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Rutas de candidatos
app.post('/api/candidates', createCandidate);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
