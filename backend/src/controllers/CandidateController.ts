import { Request, Response } from 'express';
import { CandidateService } from '../services/CandidateService';

const candidateService = new CandidateService();

export class CandidateController {
  async addCandidate(req: Request, res: Response) {
    try {
      const candidate = await candidateService.addCandidate(req.body);
      res.status(201).json(candidate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllCandidates(req: Request, res: Response) {
    try {
      const candidates = await candidateService.getAllCandidates();
      res.status(200).json(candidates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}