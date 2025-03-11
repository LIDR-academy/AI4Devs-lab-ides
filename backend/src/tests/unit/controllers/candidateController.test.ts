import { Request, Response } from 'express';
import { CandidateController } from '../../../../src/features/candidates/controllers/candidateController';
import { CandidateService } from '../../../../src/features/candidates/services/candidateService';

describe('searchSkills', () => {
  let candidateController: CandidateController;
  let candidateService: CandidateService;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn().mockReturnThis();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
    req = {
      query: { query: 'jav' }
    };
    
    res = {
      status: statusMock,
      json: jsonMock
    };
    
    candidateController = new CandidateController();
    candidateService = (candidateController as any).candidateService;
  });

  it('should return skills matching the query', async () => {
    // Arrange
    const mockSkills = ['Java', 'JavaScript', 'Java Spring'];
    jest.spyOn(candidateService, 'searchSkills').mockResolvedValue({
      success: true,
      data: mockSkills,
      statusCode: 200
    });

    // Act
    await candidateController.searchSkills(req as Request, res as Response);

    // Assert
    expect(candidateService.searchSkills).toHaveBeenCalledWith('jav');
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      data: mockSkills
    });
  });

  it('should handle empty query parameter', async () => {
    // Arrange
    req.query = { query: '' };
    jest.spyOn(candidateService, 'searchSkills').mockResolvedValue({
      success: true,
      data: [],
      statusCode: 200
    });

    // Act
    await candidateController.searchSkills(req as Request, res as Response);

    // Assert
    expect(candidateService.searchSkills).toHaveBeenCalledWith('');
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      data: []
    });
  });

  it('should handle service errors', async () => {
    // Arrange
    jest.spyOn(candidateService, 'searchSkills').mockResolvedValue({
      success: false,
      error: 'Error al buscar habilidades',
      statusCode: 500
    });

    // Act
    await candidateController.searchSkills(req as Request, res as Response);

    // Assert
    expect(candidateService.searchSkills).toHaveBeenCalledWith('jav');
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: 'Error al buscar habilidades'
    });
  });

  it('should handle unexpected errors', async () => {
    // Arrange
    const mockError = new Error('Unexpected error');
    jest.spyOn(candidateService, 'searchSkills').mockRejectedValue(mockError);

    // Act
    await candidateController.searchSkills(req as Request, res as Response);

    // Assert
    expect(candidateService.searchSkills).toHaveBeenCalledWith('jav');
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: 'Error interno del servidor'
    });
  });
}); 