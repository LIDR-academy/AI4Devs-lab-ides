import { Request, Response, NextFunction } from 'express';
import { createCandidateHandler } from './controllers/CandidateController';
import { body } from 'express-validator';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import multer from 'multer';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Candidate API',
      version: '1.0.0',
      description: 'API for managing candidates',
    },
  },
  apis: ['./src/controllers/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
  methods: ['GET', 'POST', 'DELETE'],
}));

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.type('text/plain'); 
  res.status(500).send('Something broke!');
});

app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// app.post(
//   '/api/candidates',
//   upload.single('cv'),
//   [
//     body('first_name').trim().isString().notEmpty().withMessage('First name is required'),
//     body('last_name').trim().isString().notEmpty().withMessage('Last name is required'),
//     body('email').trim().isEmail().withMessage('Valid email is required'),
//     body('phone').trim().isString().notEmpty().withMessage('Phone is required'),
//     body('address').trim().isString().notEmpty().withMessage('Address is required'),
//     body('education').custom((value) => {
//       try {
//         const parsed = JSON.parse(value);
//         if (typeof parsed !== 'object') throw new Error('Must be an object');
//         return true;
//       } catch (e) {
//         throw new Error('Invalid education format');
//       }
//     }),
//     body('work_experience').custom((value) => {
//       try {
//         const parsed = JSON.parse(value);
//         if (typeof parsed !== 'object') throw new Error('Must be an object');
//         return true;
//       } catch (e) {
//         throw new Error('Invalid work experience format');
//       }
//     }),
//   ],
//   createCandidateHandler
// );
// backend/src/index.ts

app.post('/api/candidates', createCandidateHandler);

app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany();
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/uploads', express.static('uploads'));

app.delete('/api/candidates/:id', async (req: Request, res: Response) => {
  const candidateId = req.params.id;

  try {
    const deletedCandidate = await prisma.candidate.delete({
      where: { id: candidateId },
    });
    res.status(200).json({ message: 'Candidate deleted successfully', deletedCandidate });
  } catch (error: any) {
    console.error('Error deleting candidate:', error);
    if (error.code === 'P2025') {
      // Prisma error code for "Record to delete does not exist."
      res.status(404).json({ error: 'Candidate not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete candidate' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
