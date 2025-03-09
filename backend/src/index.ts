import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { addCandidate } from './controllers/candidateController';
import upload from './middleware/upload';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

app.post('/candidates', upload.single('resume'), addCandidate);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.type('text/plain'); 
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});