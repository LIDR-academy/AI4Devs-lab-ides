import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { Candidate } from './types/candidate';

export const app = express();

app.use(express.json());

app.post('/api/candidates', (req, res) => {
  const candidate: Candidate = {
    id: uuidv4(),
    ...req.body
  };

  // For now, just return the created candidate
  // We'll add database persistence in the next iteration
  res.status(201).json(candidate);
});
