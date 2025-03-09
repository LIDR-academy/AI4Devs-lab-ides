import { CandidateService } from '../../src/application/candidate';
import { ICandidateRepository, Status } from '../../src/domain/candidate';
import { FileService } from '../../src/infrastructure/file.service';

describe('CandidateService', () => {
  let candidateService: CandidateService;
  let mockCandidateRepository: jest.Mocked<ICandidateRepository>;
  let mockFileService: jest.Mocked<FileService>;

  beforeEach(() => {
    // Create mock repository
    mockCandidateRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ICandidateRepository>;

    // Create mock file service
    mockFileService = {
      saveFile: jest.fn(),
      deleteFile: jest.fn(),
    } as unknown as jest.Mocked<FileService>;

    // Create service with mocks
    candidateService = new CandidateService(
      mockCandidateRepository,
      mockFileService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
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
          address: '123 Main St',
          status: Status.PENDING,
          education: [],
          experience: [],
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          address: '456 Oak St',
          status: Status.INTERVIEW,
          education: [],
          experience: [],
        },
      ];

      // Setup mock to return data
      mockCandidateRepository.findAll.mockResolvedValue(mockCandidates);

      // Call service method
      const result = await candidateService.getAllCandidates();

      // Assert repository was called
      expect(mockCandidateRepository.findAll).toHaveBeenCalled();

      // Assert result is correct
      expect(result).toEqual(mockCandidates);
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
        address: '123 Main St',
        status: Status.PENDING,
        education: [],
        experience: [],
      };

      // Setup mock to return data
      mockCandidateRepository.findById.mockResolvedValue(mockCandidate);

      // Call service method
      const result = await candidateService.getCandidateById(1);

      // Assert repository was called with correct ID
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(1);

      // Assert result is correct
      expect(result).toEqual(mockCandidate);
    });

    it('should return null if candidate not found', async () => {
      // Setup mock to return null
      mockCandidateRepository.findById.mockResolvedValue(null);

      // Call service method
      const result = await candidateService.getCandidateById(999);

      // Assert repository was called with correct ID
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(999);

      // Assert result is null
      expect(result).toBeNull();
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
        education: [],
        experience: [],
      };

      const createdCandidate = {
        id: 1,
        ...candidateData,
        status: Status.PENDING,
        cvFilePath: null,
      };

      // Setup mock to return created candidate
      mockCandidateRepository.create.mockResolvedValue(createdCandidate);

      // Call service method
      const result = await candidateService.createCandidate(candidateData);

      // Assert repository was called with correct data
      expect(mockCandidateRepository.create).toHaveBeenCalledWith({
        ...candidateData,
        status: Status.PENDING,
        cvFilePath: null,
      });

      // Assert result is correct
      expect(result).toEqual(createdCandidate);
    });

    it('should create a new candidate with file', async () => {
      // Mock data
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        address: '123 Main St',
        education: [],
        experience: [],
      };

      const mockFile = {
        originalname: 'cv.pdf',
        buffer: Buffer.from('fake pdf content'),
      } as Express.Multer.File;

      const createdCandidate = {
        id: 1,
        ...candidateData,
        status: Status.PENDING,
        cvFilePath: '/uploads/cv.pdf',
      };

      // Setup mocks
      mockFileService.saveFile.mockResolvedValue('/uploads/cv.pdf');
      mockCandidateRepository.create.mockResolvedValue(createdCandidate);

      // Call service method
      const result = await candidateService.createCandidate(
        candidateData,
        mockFile,
      );

      // Assert file service was called
      expect(mockFileService.saveFile).toHaveBeenCalledWith(mockFile);

      // Assert repository was called with correct data
      expect(mockCandidateRepository.create).toHaveBeenCalledWith({
        ...candidateData,
        status: Status.PENDING,
        cvFilePath: '/uploads/cv.pdf',
      });

      // Assert result is correct
      expect(result).toEqual(createdCandidate);
    });
  });

  describe('deleteCandidate', () => {
    it('should delete a candidate', async () => {
      // Mock data
      const mockCandidate = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        address: '123 Main St',
        status: Status.PENDING,
        cvFilePath: null,
        education: [],
        experience: [],
      };

      // Setup mocks
      mockCandidateRepository.findById.mockResolvedValue(mockCandidate);
      mockCandidateRepository.delete.mockResolvedValue();

      // Call service method
      await candidateService.deleteCandidate(1);

      // Assert repository methods were called
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(1);
      expect(mockCandidateRepository.delete).toHaveBeenCalledWith(1);
      expect(mockFileService.deleteFile).not.toHaveBeenCalled();
    });

    it('should delete a candidate and its CV file', async () => {
      // Mock data
      const mockCandidate = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        address: '123 Main St',
        status: Status.PENDING,
        cvFilePath: '/uploads/cv.pdf',
        education: [],
        experience: [],
      };

      // Setup mocks
      mockCandidateRepository.findById.mockResolvedValue(mockCandidate);
      mockCandidateRepository.delete.mockResolvedValue();
      mockFileService.deleteFile.mockResolvedValue();

      // Call service method
      await candidateService.deleteCandidate(1);

      // Assert repository and file service methods were called
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(1);
      expect(mockFileService.deleteFile).toHaveBeenCalledWith(
        '/uploads/cv.pdf',
      );
      expect(mockCandidateRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw error if candidate not found', async () => {
      // Setup mock to return null
      mockCandidateRepository.findById.mockResolvedValue(null);

      // Call service method and expect error
      await expect(candidateService.deleteCandidate(999)).rejects.toThrow(
        'Candidate with ID 999 not found',
      );

      // Assert delete method was not called
      expect(mockCandidateRepository.delete).not.toHaveBeenCalled();
    });
  });
});
