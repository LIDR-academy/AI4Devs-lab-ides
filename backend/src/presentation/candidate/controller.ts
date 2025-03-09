import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { CandidateService } from '../../application/candidate';

export class CandidateController {
  constructor(private candidateService: CandidateService) {}

  getAllCandidates = async (req: Request, res: Response): Promise<void> => {
    try {
      const candidates = await this.candidateService.getAllCandidates();
      res.json(candidates);
    } catch (error) {
      console.error('Error getting candidates:', error);
      res.status(500).json({ error: 'Failed to retrieve candidates' });
    }
  };

  getCandidateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const candidate = await this.candidateService.getCandidateById(id);

      if (!candidate) {
        res.status(404).json({ error: 'Candidate not found' });
        return;
      }

      res.json(candidate);
    } catch (error) {
      console.error('Error getting candidate:', error);
      res.status(500).json({ error: 'Failed to retrieve candidate' });
    }
  };

  createCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
      const candidateData = req.body;
      const file = req.file;

      // Check if client tried to set a status other than PENDING
      if (candidateData.status && candidateData.status !== 'PENDING') {
        console.warn(
          `Client attempted to set status to ${candidateData.status}. Forcing to PENDING.`,
        );
        // Remove the status to let the service use the default
        delete candidateData.status;
      }

      const candidate = await this.candidateService.createCandidate(
        candidateData,
        file,
      );

      res.status(201).json(candidate);
    } catch (error) {
      console.error('Error creating candidate:', error);

      if (
        error instanceof ZodError ||
        (error instanceof Error && error.name === 'ZodError')
      ) {
        res.status(400).json({
          error: 'Validation error',
          details:
            error instanceof ZodError ? error.errors : (error as any).errors,
        });
        return;
      }

      res.status(500).json({ error: 'Failed to create candidate' });
    }
  };

  updateCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const candidateData = req.body;
      const file = req.file;

      const candidate = await this.candidateService.updateCandidate(
        id,
        candidateData,
        file,
      );

      res.json(candidate);
    } catch (error) {
      console.error('Error updating candidate:', error);

      if (
        error instanceof ZodError ||
        (error instanceof Error && error.name === 'ZodError')
      ) {
        res.status(400).json({
          error: 'Validation error',
          details:
            error instanceof ZodError ? error.errors : (error as any).errors,
        });
        return;
      }

      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Failed to update candidate' });
    }
  };

  deleteCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      await this.candidateService.deleteCandidate(id);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting candidate:', error);

      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Failed to delete candidate' });
    }
  };

  downloadCv = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const candidate = await this.candidateService.getCandidateById(id);

      if (!candidate) {
        res.status(404).json({ error: 'Candidate not found' });
        return;
      }

      if (!candidate.cvFilePath) {
        res.status(404).json({ error: 'CV not found for this candidate' });
        return;
      }

      const filePath = this.candidateService.getCvFilePath(
        candidate.cvFilePath,
      );
      res.download(
        filePath,
        `CV_${candidate.firstName}_${candidate.lastName}.pdf`,
      );
    } catch (error) {
      console.error('Error downloading CV:', error);
      res.status(500).json({ error: 'Failed to download CV' });
    }
  };

  /**
   * Get statistics about candidates
   */
  getStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const statistics = await this.candidateService.getStatistics();
      res.status(200).json(statistics);
    } catch (error: any) {
      console.error('Error retrieving statistics:', error);
      res.status(500).json({ error: 'Failed to retrieve statistics' });
    }
  };

  /**
   * Get education suggestions based on existing candidates
   */
  getEducationSuggestions = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const suggestions = await this.candidateService.getEducationSuggestions();
      res.status(200).json(suggestions);
    } catch (error: any) {
      console.error('Error retrieving education suggestions:', error);
      res
        .status(500)
        .json({ error: 'Failed to retrieve education suggestions' });
    }
  };

  /**
   * Get experience suggestions based on existing candidates
   */
  getExperienceSuggestions = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const suggestions =
        await this.candidateService.getExperienceSuggestions();
      res.status(200).json(suggestions);
    } catch (error: any) {
      console.error('Error retrieving experience suggestions:', error);
      res
        .status(500)
        .json({ error: 'Failed to retrieve experience suggestions' });
    }
  };
}
