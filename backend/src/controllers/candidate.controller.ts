import { Request, Response, NextFunction } from 'express';
import { CandidateService } from '../services/candidate.service';
import { CreateCandidateDto, CreateDocumentDto } from '../interfaces/candidate.interface';
import { validateEmail, sanitizeInput } from '../utils/validation';
import { Multer } from 'multer';

interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

interface ApiError extends Error {
  status?: number;
}

export class CandidateController {
  private candidateService: CandidateService;

  constructor() {
    this.candidateService = new CandidateService();
  }

  async createCandidate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidateData: CreateCandidateDto = req.body;

      // Validar formato de email
      if (!validateEmail(candidateData.email)) {
        const error: ApiError = new Error('Invalid email format');
        error.status = 400;
        throw error;
      }

      // Sanitizar inputs
      const sanitizedData = {
        ...candidateData,
        firstName: sanitizeInput(candidateData.firstName) || candidateData.firstName,
        lastName: sanitizeInput(candidateData.lastName) || candidateData.lastName,
        address: sanitizeInput(candidateData.address ?? null)
      };

      const candidate = await this.candidateService.createCandidate(sanitizedData);

      res.setHeader('Location', `/api/candidates/${candidate.id}`);
      res.status(201).json(candidate);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unique constraint failed on email')) {
        const apiError: ApiError = new Error('Email already exists');
        apiError.status = 409;
        next(apiError);
      } else {
        next(error);
      }
    }
  }

  async findCandidateByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.params;

      if (!validateEmail(email)) {
        const error: ApiError = new Error('Invalid email format');
        error.status = 400;
        throw error;
      }

      const candidate = await this.candidateService.findCandidateByEmail(email);

      if (!candidate) {
        const error: ApiError = new Error('Candidate not found');
        error.status = 404;
        throw error;
      }

      res.status(200).json(candidate);
    } catch (error) {
      next(error);
    }
  }

  async addDocument(req: RequestWithFile, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const file = req.file;

      if (!file) {
        const error: ApiError = new Error('No file uploaded');
        error.status = 400;
        throw error;
      }

      const documentData: CreateDocumentDto = {
        fileName: file.originalname,
        fileType: file.mimetype === 'application/pdf' ? 'PDF' : 'DOCX',
        fileSize: file.size
      };

      const document = await this.candidateService.addDocument(id, documentData, file);

      res.status(201).json(document);
    } catch (error) {
      if (error instanceof Error && error.message === 'Candidate already has a document') {
        const apiError: ApiError = new Error('Candidate already has a document');
        apiError.status = 409;
        next(apiError);
      } else {
        next(error);
      }
    }
  }

  async submitApplication(req: RequestWithFile, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;
      let applicationData;

      try {
        applicationData = JSON.parse(req.body.data);
      } catch (e) {
        const error: ApiError = new Error('Invalid application data format');
        error.status = 400;
        throw error;
      }

      // Validar email
      if (!validateEmail(applicationData.email)) {
        const error: ApiError = new Error('Invalid email format');
        error.status = 400;
        throw error;
      }

      // Sanitizar datos personales
      const sanitizedData = {
        ...applicationData,
        firstName: sanitizeInput(applicationData.firstName),
        lastName: sanitizeInput(applicationData.lastName),
      };

      // Crear el candidato
      const candidate = await this.candidateService.createCandidate(sanitizedData);

      // Si hay archivo, añadirlo
      if (file) {
        const documentData: CreateDocumentDto = {
          fileName: file.originalname,
          fileType: file.mimetype === 'application/pdf' ? 'PDF' : 'DOCX',
          fileSize: file.size
        };

        await this.candidateService.addDocument(candidate.id, documentData, file);
      }

      res.status(201).json({ success: true, candidateId: candidate.id });
    } catch (error) {
      if (error instanceof Error) {
        const apiError: ApiError = error;
        apiError.status = apiError.status || 500;
        next(apiError);
      } else {
        next(new Error('Unknown error occurred'));
      }
    }
  }
} 