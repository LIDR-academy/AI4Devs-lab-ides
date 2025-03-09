import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

const port = process.env.PORT || 3010;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
