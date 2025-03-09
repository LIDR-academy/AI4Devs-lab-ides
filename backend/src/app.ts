import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validateCandidate } from './middleware/validateCandidate';

const prisma = new PrismaClient();
export const app = express();

app.use(express.json());

app.post('/api/candidates', validateCandidate, async (req, res) => {
  try {
    const candidate = await prisma.candidate.create({
      data: {
        ...req.body
      }
    });
    res.status(201).json(candidate);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'A candidate with this email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});
