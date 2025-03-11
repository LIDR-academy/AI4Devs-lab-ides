import { Request, Response } from 'express';
import { candidateService } from '../services/candidateService';
import { Status } from '@prisma/client';
import { upload } from '../middleware/upload';
import {
  CreateCandidateInput,
  UpdateCandidateInput,
} from '../schemas/candidateSchema';

export const candidateController = {
  async getAllCandidates(req: Request, res: Response) {
    try {
      const candidates = await candidateService.getAllCandidates();
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch candidates' });
    }
  },

  async getCandidate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const candidate = await candidateService.getCandidate(id);
      if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }
      res.json(candidate);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch candidate' });
    }
  },

  async createCandidate(req: Request, res: Response) {
    try {
      const candidateData: CreateCandidateInput = req.body;

      if (req.file) {
        candidateData.cvFilePath = req.file.path;
      }

      const candidate = await candidateService.createCandidate(candidateData);
      res.status(201).json(candidate);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create candidate' });
    }
  },

  async updateCandidate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const updateData: UpdateCandidateInput = req.body;
      const candidate = await candidateService.updateCandidate(id, updateData);
      res.json(candidate);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update candidate' });
    }
  },

  async deleteCandidate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await candidateService.deleteCandidate(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete candidate' });
    }
  },

  async getStatistics(req: Request, res: Response) {
    try {
      const stats = await candidateService.getStatistics();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  },

  async downloadCV(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const candidate = await candidateService.getCandidate(id);

      if (!candidate || !candidate.cvFilePath) {
        return res.status(404).json({ error: 'CV not found' });
      }

      res.download(candidate.cvFilePath);
    } catch (error) {
      res.status(500).json({ error: 'Failed to download CV' });
    }
  },
};
