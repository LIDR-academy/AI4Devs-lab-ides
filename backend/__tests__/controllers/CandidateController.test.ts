import { Request, Response } from 'express';
import { CandidateService } from '../../src/application/candidate';
import { CandidateController } from '../../src/presentation/candidate/controller';

// Mock the CandidateService
jest.mock('../../src/application/candidate', () => {
  return {
    CandidateService: jest.fn().mockImplementation(() => ({
      getAllCandidates: jest.fn(),
      getCandidateById: jest.fn(),
      createCandidate: jest.fn(),
      updateCandidate: jest.fn(),
      deleteCandidate: jest.fn(),
    })),
  };
});

describe('CandidateController', () => {
  let candidateController: CandidateController;
  let mockCandidateService: jest.Mocked<CandidateService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonSpy: jest.Mock;
  let statusSpy: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock service
    mockCandidateService = new CandidateService(
      null,
      null,
    ) as jest.Mocked<CandidateService>;

    // Create controller with mock service
    candidateController = new CandidateController(mockCandidateService);

    // Setup request and response mocks
    jsonSpy = jest.fn();
    statusSpy = jest.fn().mockReturnValue({ json: jsonSpy });

    mockRequest = {};
    mockResponse = {
      json: jsonSpy,
      status: statusSpy,
    };
  });

  describe('getAllCandidates', () => {
    it('should return all candidates', async () => {
      // Mock data
      const mockCandidates = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
        },
      ];

      // Setup mock service to return data
      mockCandidateService.getAllCandidates.mockResolvedValue(mockCandidates);

      // Call controller method
      await candidateController.getAllCandidates(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert service was called
      expect(mockCandidateService.getAllCandidates).toHaveBeenCalled();

      // Assert response was correct
      expect(jsonSpy).toHaveBeenCalledWith(mockCandidates);
      expect(statusSpy).not.toHaveBeenCalled();
    });

    it('should handle errors when getting all candidates', async () => {
      // Setup mock service to throw error
      const error = new Error('Database error');
      mockCandidateService.getAllCandidates.mockRejectedValue(error);

      // Call controller method
      await candidateController.getAllCandidates(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert error handling
      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Failed to retrieve candidates',
      });
    });
  });

  describe('getCandidateById', () => {
    it('should return a candidate by id', async () => {
      // Mock data
      const mockCandidate = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };
      mockRequest.params = { id: '1' };

      // Setup mock service to return data
      mockCandidateService.getCandidateById.mockResolvedValue(mockCandidate);

      // Call controller method
      await candidateController.getCandidateById(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert service was called with correct ID
      expect(mockCandidateService.getCandidateById).toHaveBeenCalledWith(1);

      // Assert response was correct
      expect(jsonSpy).toHaveBeenCalledWith(mockCandidate);
    });

    it('should return 404 if candidate is not found', async () => {
      mockRequest.params = { id: '999' };

      // Setup mock service to return null (not found)
      mockCandidateService.getCandidateById.mockResolvedValue(null);

      // Call controller method
      await candidateController.getCandidateById(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert error handling
      expect(statusSpy).toHaveBeenCalledWith(404);
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'Candidate not found' });
    });
  });

  describe('createCandidate', () => {
    it('should create a new candidate', async () => {
      // Mock data
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        address: '123 Main St',
      };

      const createdCandidate = {
        id: 1,
        ...candidateData,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockRequest.body = candidateData;

      // Setup mock service to return created candidate
      mockCandidateService.createCandidate.mockResolvedValue(createdCandidate);

      // Call controller method
      await candidateController.createCandidate(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert service was called with correct data
      expect(mockCandidateService.createCandidate).toHaveBeenCalledWith(
        candidateData,
        undefined,
      );

      // Assert response was correct
      expect(statusSpy).toHaveBeenCalledWith(201);
      expect(jsonSpy).toHaveBeenCalledWith(createdCandidate);
    });
  });

  describe('deleteCandidate', () => {
    it('should delete a candidate', async () => {
      mockRequest.params = { id: '1' };

      // Call controller method
      await candidateController.deleteCandidate(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert service was called with correct ID
      expect(mockCandidateService.deleteCandidate).toHaveBeenCalledWith(1);

      // Assert response was correct
      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Candidate deleted successfully',
      });
    });
  });
});
