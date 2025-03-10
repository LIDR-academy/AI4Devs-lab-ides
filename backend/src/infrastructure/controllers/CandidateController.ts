import { Request, Response } from 'express';
import { CreateCandidateUseCase } from '../../application/use-cases/candidate/CreateCandidateUseCase';
import { GetAllCandidatesUseCase } from '../../application/use-cases/candidate/GetAllCandidatesUseCase';
import { body, validationResult } from 'express-validator';

export class CandidateController {
  private createCandidateUseCase: CreateCandidateUseCase;
  private getAllCandidatesUseCase: GetAllCandidatesUseCase;

  constructor(
    createCandidateUseCase: CreateCandidateUseCase,
    getAllCandidatesUseCase: GetAllCandidatesUseCase
  ) {
    this.createCandidateUseCase = createCandidateUseCase;
    this.getAllCandidatesUseCase = getAllCandidatesUseCase;
  }

  createCandidateValidationRules() {
    return [
      body('firstName').notEmpty().withMessage('First name is required'),
      body('lastName').notEmpty().withMessage('Last name is required'),
      body('email').isEmail().withMessage('Email is invalid'),
      body('phone').notEmpty().withMessage('Phone number is required'),
      body('address').notEmpty().withMessage('Address is required'),
      body('education').notEmpty().withMessage('Education is required'),
      body('experience').notEmpty().withMessage('Experience is required')
    ];
  }

  async createCandidate(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, phone, address, education, experience } = req.body;
    const cvFilePath = req.file ? req.file.filename : '';

    try {
      const candidate = await this.createCandidateUseCase.execute({
        firstName,
        lastName,
        email,
        phone,
        address,
        education,
        experience,
        cvFilePath
      });

      res.status(201).json({
        ...candidate,
        cvUrl: cvFilePath ? `/cv/${cvFilePath}` : null
      });
    } catch (error: any) {
      console.error('Error adding candidate:', error);
      
      if (error.code === 'P2002') {
        return res.status(409).json({ message: 'A candidate with this email already exists.' });
      }
      
      res.status(500).json({ message: 'Error adding candidate', error: error.message });
    }
  }

  async getAllCandidates(req: Request, res: Response) {
    try {
      const candidates = await this.getAllCandidatesUseCase.execute();
      res.json(candidates);
    } catch (error: any) {
      console.error('Error fetching candidates:', error);
      res.status(500).json({ message: 'Error fetching candidates', error: error.message });
    }
  }
} 