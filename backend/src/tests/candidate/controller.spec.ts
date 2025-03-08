import { Request, Response } from 'express';
import { CandidateService } from '../../application/candidate';
import { Candidate, Status } from '../../domain/candidate';
import { CandidateController } from '../../presentation/candidate';

// Mock CandidateService
const mockCandidateService = {
  getAllCandidates: jest.fn(),
  getCandidateById: jest.fn(),
  createCandidate: jest.fn(),
  updateCandidate: jest.fn(),
  deleteCandidate: jest.fn(),
  getStatistics: jest.fn(),
  getEducationSuggestions: jest.fn(),
  getExperienceSuggestions: jest.fn(),
  getCvFilePath: jest.fn(),
};

// Mock objects
const mockCandidate1 = new Candidate({
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  address: '123 Main St',
  education: "Bachelor's Degree",
  experience: '5 years',
  status: Status.PENDING,
  cvFilePath: '/uploads/cv-1.pdf',
});

const mockCandidate2 = new Candidate({
  id: 2,
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@example.com',
  address: '456 Oak Ave',
  education: "Master's Degree",
  experience: '3 years',
  status: Status.VALUATED,
  cvFilePath: '/uploads/cv-2.pdf',
});

// Mock request and response
function mockRequestResponse() {
  const req = {} as Request;
  const res = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    download: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
  } as unknown as Response;
  return { req, res };
}

describe('CandidateController', () => {
  let candidateController: CandidateController;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    candidateController = new CandidateController(
      mockCandidateService as unknown as CandidateService,
    );
    const mocks = mockRequestResponse();
    req = mocks.req;
    res = mocks.res;

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('getAllCandidates', () => {
    it('should return all candidates', async () => {
      // Arrange
      const candidates = [mockCandidate1, mockCandidate2];
      mockCandidateService.getAllCandidates.mockResolvedValue(candidates);

      // Act
      await candidateController.getAllCandidates(req, res);

      // Assert
      expect(mockCandidateService.getAllCandidates).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(candidates);
    });

    it('should handle errors', async () => {
      // Arrange
      const error = new Error('Database error');
      mockCandidateService.getAllCandidates.mockRejectedValue(error);

      // Act
      await candidateController.getAllCandidates(req, res);

      // Assert
      expect(mockCandidateService.getAllCandidates).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve candidates',
      });
    });
  });

  describe('getCandidateById', () => {
    it('should return a candidate by ID', async () => {
      // Arrange
      req.params = { id: '1' };
      mockCandidateService.getCandidateById.mockResolvedValue(mockCandidate1);

      // Act
      await candidateController.getCandidateById(req, res);

      // Assert
      expect(mockCandidateService.getCandidateById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockCandidate1);
    });

    it('should return 404 if candidate not found', async () => {
      // Arrange
      req.params = { id: '999' };
      mockCandidateService.getCandidateById.mockResolvedValue(null);

      // Act
      await candidateController.getCandidateById(req, res);

      // Assert
      expect(mockCandidateService.getCandidateById).toHaveBeenCalledWith(999);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Candidate not found' });
    });

    it('should handle errors', async () => {
      // Arrange
      req.params = { id: '1' };
      const error = new Error('Database error');
      mockCandidateService.getCandidateById.mockRejectedValue(error);

      // Act
      await candidateController.getCandidateById(req, res);

      // Assert
      expect(mockCandidateService.getCandidateById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve candidate',
      });
    });
  });

  describe('createCandidate', () => {
    it('should create a candidate successfully', async () => {
      // Arrange
      req.body = {
        firstName: 'New',
        lastName: 'User',
        email: 'new@example.com',
        address: '789 Pine St',
        education: 'PhD',
        experience: '10 years',
        status: Status.PENDING,
      };
      req.file = { originalname: 'cv.pdf' } as Express.Multer.File;

      const newCandidate = new Candidate({
        id: 3,
        ...req.body,
        cvFilePath: '/uploads/cv-3.pdf',
      });

      mockCandidateService.createCandidate.mockResolvedValue(newCandidate);

      // Act
      await candidateController.createCandidate(req, res);

      // Assert
      expect(mockCandidateService.createCandidate).toHaveBeenCalledWith(
        req.body,
        req.file,
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newCandidate);
    });

    it('should handle validation errors', async () => {
      // Arrange
      req.body = {
        firstName: 'New',
        // missing required fields
      };

      const zodError = new Error('Validation error');
      zodError.name = 'ZodError';
      (zodError as any).errors = [{ path: ['email'], message: 'Required' }];

      mockCandidateService.createCandidate.mockRejectedValue(zodError);

      // Act
      await candidateController.createCandidate(req, res);

      // Assert
      expect(mockCandidateService.createCandidate).toHaveBeenCalledWith(
        req.body,
        undefined,
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation error',
        details: (zodError as any).errors,
      });
    });

    it('should handle other errors', async () => {
      // Arrange
      req.body = {
        firstName: 'New',
        lastName: 'User',
        email: 'new@example.com',
        address: '789 Pine St',
        education: 'PhD',
        experience: '10 years',
      };

      const error = new Error('Database error');
      mockCandidateService.createCandidate.mockRejectedValue(error);

      // Act
      await candidateController.createCandidate(req, res);

      // Assert
      expect(mockCandidateService.createCandidate).toHaveBeenCalledWith(
        req.body,
        undefined,
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to create candidate',
      });
    });
  });

  describe('updateCandidate', () => {
    it('should update a candidate successfully', async () => {
      // Arrange
      req.params = { id: '1' };
      req.body = {
        firstName: 'Updated',
        lastName: 'Name',
        status: Status.VALUATED,
      };
      req.file = { originalname: 'new-cv.pdf' } as Express.Multer.File;

      const updatedCandidate = new Candidate({
        id: 1,
        firstName: 'Updated',
        lastName: 'Name',
        email: 'john@example.com',
        address: '123 Main St',
        education: "Bachelor's Degree",
        experience: '5 years',
        status: Status.VALUATED,
        cvFilePath: '/uploads/new-cv.pdf',
      });

      mockCandidateService.updateCandidate.mockResolvedValue(updatedCandidate);

      // Act
      await candidateController.updateCandidate(req, res);

      // Assert
      expect(mockCandidateService.updateCandidate).toHaveBeenCalledWith(
        1,
        req.body,
        req.file,
      );
      expect(res.json).toHaveBeenCalledWith(updatedCandidate);
    });

    it('should handle validation errors', async () => {
      // Arrange
      req.params = { id: '1' };
      req.body = {
        email: 'invalid-email', // Invalid email format
      };

      const zodError = new Error('Validation error');
      zodError.name = 'ZodError';
      (zodError as any).errors = [
        { path: ['email'], message: 'Invalid email format' },
      ];

      mockCandidateService.updateCandidate.mockRejectedValue(zodError);

      // Act
      await candidateController.updateCandidate(req, res);

      // Assert
      expect(mockCandidateService.updateCandidate).toHaveBeenCalledWith(
        1,
        req.body,
        undefined,
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation error',
        details: (zodError as any).errors,
      });
    });

    it('should handle not found errors', async () => {
      // Arrange
      req.params = { id: '999' };
      req.body = {
        firstName: 'Updated',
      };

      const error = new Error('Candidate with ID 999 not found');
      mockCandidateService.updateCandidate.mockRejectedValue(error);

      // Act
      await candidateController.updateCandidate(req, res);

      // Assert
      expect(mockCandidateService.updateCandidate).toHaveBeenCalledWith(
        999,
        req.body,
        undefined,
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Candidate with ID 999 not found',
      });
    });

    it('should handle other errors', async () => {
      // Arrange
      req.params = { id: '1' };
      req.body = {
        firstName: 'Updated',
      };

      const error = new Error('Database error');
      mockCandidateService.updateCandidate.mockRejectedValue(error);

      // Act
      await candidateController.updateCandidate(req, res);

      // Assert
      expect(mockCandidateService.updateCandidate).toHaveBeenCalledWith(
        1,
        req.body,
        undefined,
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to update candidate',
      });
    });
  });

  describe('deleteCandidate', () => {
    it('should delete a candidate successfully', async () => {
      // Arrange
      req.params = { id: '1' };
      mockCandidateService.deleteCandidate.mockResolvedValue(undefined);

      // Act
      await candidateController.deleteCandidate(req, res);

      // Assert
      expect(mockCandidateService.deleteCandidate).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it('should handle not found errors', async () => {
      // Arrange
      req.params = { id: '999' };
      const error = new Error('Candidate with ID 999 not found');
      mockCandidateService.deleteCandidate.mockRejectedValue(error);

      // Act
      await candidateController.deleteCandidate(req, res);

      // Assert
      expect(mockCandidateService.deleteCandidate).toHaveBeenCalledWith(999);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Candidate with ID 999 not found',
      });
    });

    it('should handle other errors', async () => {
      // Arrange
      req.params = { id: '1' };
      const error = new Error('Database error');
      mockCandidateService.deleteCandidate.mockRejectedValue(error);

      // Act
      await candidateController.deleteCandidate(req, res);

      // Assert
      expect(mockCandidateService.deleteCandidate).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to delete candidate',
      });
    });
  });

  describe('downloadCv', () => {
    it('should download a candidate CV', async () => {
      // Arrange
      req.params = { id: '1' };
      mockCandidateService.getCandidateById.mockResolvedValue(mockCandidate1);
      mockCandidateService.getCvFilePath.mockReturnValue(
        '/full/path/to/cv-1.pdf',
      );

      // Act
      await candidateController.downloadCv(req, res);

      // Assert
      expect(mockCandidateService.getCandidateById).toHaveBeenCalledWith(1);
      expect(mockCandidateService.getCvFilePath).toHaveBeenCalledWith(
        '/uploads/cv-1.pdf',
      );
      expect(res.download).toHaveBeenCalledWith(
        '/full/path/to/cv-1.pdf',
        'CV_John_Doe.pdf',
      );
    });

    it('should return 404 if candidate not found', async () => {
      // Arrange
      req.params = { id: '999' };
      mockCandidateService.getCandidateById.mockResolvedValue(null);

      // Act
      await candidateController.downloadCv(req, res);

      // Assert
      expect(mockCandidateService.getCandidateById).toHaveBeenCalledWith(999);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Candidate not found' });
    });

    it('should return 404 if CV not found for candidate', async () => {
      // Arrange
      req.params = { id: '1' };
      const candidateWithoutCv = new Candidate({
        ...mockCandidate1,
        cvFilePath: null,
      });
      mockCandidateService.getCandidateById.mockResolvedValue(
        candidateWithoutCv,
      );

      // Act
      await candidateController.downloadCv(req, res);

      // Assert
      expect(mockCandidateService.getCandidateById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'CV not found for this candidate',
      });
    });

    it('should handle errors', async () => {
      // Arrange
      req.params = { id: '1' };
      const error = new Error('File system error');
      mockCandidateService.getCandidateById.mockRejectedValue(error);

      // Act
      await candidateController.downloadCv(req, res);

      // Assert
      expect(mockCandidateService.getCandidateById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to download CV' });
    });
  });

  describe('getStatistics', () => {
    it('should return candidate statistics', async () => {
      // Arrange
      const statistics = {
        total: 10,
        pending: 5,
        valuated: 3,
        discarded: 2,
      };
      mockCandidateService.getStatistics.mockResolvedValue(statistics);

      // Act
      await candidateController.getStatistics(req, res);

      // Assert
      expect(mockCandidateService.getStatistics).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(statistics);
    });

    it('should handle errors', async () => {
      // Arrange
      const error = new Error('Database error');
      mockCandidateService.getStatistics.mockRejectedValue(error);

      // Act
      await candidateController.getStatistics(req, res);

      // Assert
      expect(mockCandidateService.getStatistics).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve statistics',
      });
    });
  });

  describe('getEducationSuggestions', () => {
    it('should return education suggestions', async () => {
      // Arrange
      const suggestions = ["Bachelor's Degree", "Master's Degree", 'PhD'];
      mockCandidateService.getEducationSuggestions.mockResolvedValue(
        suggestions,
      );

      // Act
      await candidateController.getEducationSuggestions(req, res);

      // Assert
      expect(mockCandidateService.getEducationSuggestions).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(suggestions);
    });

    it('should handle errors', async () => {
      // Arrange
      const error = new Error('Database error');
      mockCandidateService.getEducationSuggestions.mockRejectedValue(error);

      // Act
      await candidateController.getEducationSuggestions(req, res);

      // Assert
      expect(mockCandidateService.getEducationSuggestions).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve education suggestions',
      });
    });
  });

  describe('getExperienceSuggestions', () => {
    it('should return experience suggestions', async () => {
      // Arrange
      const suggestions = ['1 year', '3 years', '5 years'];
      mockCandidateService.getExperienceSuggestions.mockResolvedValue(
        suggestions,
      );

      // Act
      await candidateController.getExperienceSuggestions(req, res);

      // Assert
      expect(mockCandidateService.getExperienceSuggestions).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(suggestions);
    });

    it('should handle errors', async () => {
      // Arrange
      const error = new Error('Database error');
      mockCandidateService.getExperienceSuggestions.mockRejectedValue(error);

      // Act
      await candidateController.getExperienceSuggestions(req, res);

      // Assert
      expect(mockCandidateService.getExperienceSuggestions).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve experience suggestions',
      });
    });
  });
});
