import { GetCandidatesUseCase } from '../GetCandidates';
import { CandidateRepository } from '../../../domain/repositories/CandidateRepository';
import { Candidate } from '../../../domain/entities/Candidate';

describe('GetCandidatesUseCase', () => {
  let mockCandidateRepository: jest.Mocked<CandidateRepository>;
  let getCandidatesUseCase: GetCandidatesUseCase;

  beforeEach(() => {
    mockCandidateRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
    };

    getCandidatesUseCase = new GetCandidatesUseCase(mockCandidateRepository);
  });

  it('should return all candidates successfully', async () => {
    // Arrange
    const mockCandidates = [
      new Candidate({
        id: 1,
        name: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      }),
      new Candidate({
        id: 2,
        name: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com'
      })
    ];

    mockCandidateRepository.findAll.mockResolvedValue(mockCandidates);

    // Act
    const result = await getCandidatesUseCase.execute();

    // Assert
    expect(result.isOk()).toBe(true);
    expect(result.getValue()).toEqual(mockCandidates);
    expect(mockCandidateRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return failure when repository throws error', async () => {
    // Arrange
    const dbError = new Error('Database error');
    mockCandidateRepository.findAll.mockRejectedValue(dbError);

    // Act
    const result = await getCandidatesUseCase.execute();

    // Assert
    expect(result.isOk()).toBe(false);
    const error = result.getError() as { message: string; details: string };
    expect(error).toEqual({
      message: 'Error al obtener los candidatos',
      details: 'Database error'
    });
    expect(mockCandidateRepository.findAll).toHaveBeenCalledTimes(1);
  });
}); 