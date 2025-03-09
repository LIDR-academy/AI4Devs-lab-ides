import { Request, Response } from 'express';
import { CandidateController } from '../CandidateController';
import { CreateCandidateUseCase } from '../../../application/useCases/CreateCandidate';
import { GetCandidatesUseCase } from '../../../application/useCases/GetCandidates';
import { Result } from '../../../domain/shared/Result';
import { Candidate } from '../../../domain/entities/Candidate';

describe('CandidateController', () => {
  let mockCreateCandidateUseCase: jest.Mocked<CreateCandidateUseCase>;
  let mockGetCandidatesUseCase: jest.Mocked<GetCandidatesUseCase>;
  let candidateController: CandidateController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockCreateCandidateUseCase = {
      execute: jest.fn(),
    } as any;

    mockGetCandidatesUseCase = {
      execute: jest.fn(),
    } as any;

    candidateController = new CandidateController(
      mockCreateCandidateUseCase,
      mockGetCandidatesUseCase
    );

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
  });

  describe('getCandidates', () => {
    it('should return candidates successfully', async () => {
      // Arrange
      const mockCandidates = [
        new Candidate({
          id: 1,
          name: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        })
      ];

      mockGetCandidatesUseCase.execute.mockResolvedValue(
        Result.ok(mockCandidates)
      );

      // Act
      await candidateController['getCandidates'](
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCandidates);
    });

    it('should handle errors when getting candidates fails', async () => {
      // Arrange
      mockGetCandidatesUseCase.execute.mockResolvedValue(
        Result.fail({
          message: 'Error getting candidates',
          details: 'Database error'
        })
      );

      // Act
      await candidateController['getCandidates'](
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error getting candidates'
      });
    });

    it('should handle unexpected errors', async () => {
      // Arrange
      mockGetCandidatesUseCase.execute.mockRejectedValue(
        new Error('Unexpected error')
      );

      // Act
      await candidateController['getCandidates'](
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error interno del servidor al obtener los candidatos'
      });
    });
  });
}); 