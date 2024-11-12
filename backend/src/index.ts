import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cors from 'cors';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

app.get('/', (req: Request, res: Response) => {
  res.send('Hola LTI!');
});

app.use(express.json());
app.use(cors());

// Middleware to check JWT token
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: jwt.VerifyErrors | null, decoded: any) => {
    if (err) {
      return res.sendStatus(403);
    }
    (req as any).user = decoded;
    next();
  });
};

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
app.post('/api/candidates', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, address, education, workExperience, resume } = req.body;

    // Validate the data (basic example, consider using a library like express-validator for more robust validation)
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save the candidate to the database
    const candidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        education,
        workExperience,
        resume,
      },
    });

    res.status(201).json(candidate);
  } catch (error) {
    console.error('Error adding candidate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});