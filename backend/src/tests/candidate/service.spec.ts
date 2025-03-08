import { CandidateService } from '../../application/candidate';
import {
  Candidate,
  ICandidateRepository,
  Status,
} from '../../domain/candidate';
import { FileService } from '../../infrastructure/file.service';

// Mock del repository
const mockCandidateRepository: jest.Mocked<ICandidateRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getStatistics: jest.fn(),
  findEducationValues: jest.fn(),
  findExperienceValues: jest.fn(),
};

// Mock del file service
const mockFileService: jest.Mocked<FileService> = {
  saveFile: jest.fn(),
  deleteFile: jest.fn(),
  getFilePath: jest.fn(),
  validateFileType: jest.fn(),
  generateSecureFilename: jest.fn(),
};

describe('CandidateService', () => {
  let candidateService: CandidateService;

  beforeEach(() => {
    candidateService = new CandidateService(
      mockCandidateRepository,
      mockFileService as any,
    );
    jest.clearAllMocks();
  });

  describe('getAllCandidates', () => {
    it('should return all candidates', async () => {
      // Arrange
      const mockCandidates = [
        new Candidate({
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          address: '123 Main St',
          education: "Bachelor's Degree",
          experience: '5 years',
          status: Status.PENDING,
        }),
        new Candidate({
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          address: '456 Oak Ave',
          education: "Master's Degree",
          experience: '3 years',
          status: Status.VALUATED,
        }),
      ];

      mockCandidateRepository.findAll.mockResolvedValue(mockCandidates);

      // Act
      const result = await candidateService.getAllCandidates();

      // Assert
      expect(mockCandidateRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockCandidates);
    });
  });

  describe('getCandidateById', () => {
    it('should return a candidate by ID', async () => {
      // Arrange
      const mockCandidate = new Candidate({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        address: '123 Main St',
        education: "Bachelor's Degree",
        experience: '5 years',
        status: Status.PENDING,
      });

      mockCandidateRepository.findById.mockResolvedValue(mockCandidate);

      // Act
      const result = await candidateService.getCandidateById(1);

      // Assert
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCandidate);
    });

    it('should return null if candidate not found', async () => {
      // Arrange
      mockCandidateRepository.findById.mockResolvedValue(null);

      // Act
      const result = await candidateService.getCandidateById(999);

      // Assert
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('createCandidate', () => {
    it('should create a candidate without file', async () => {
      // Arrange
      const candidateData = {
        firstName: 'New',
        lastName: 'User',
        email: 'new@example.com',
        address: '789 Pine St',
        education: 'PhD',
        experience: '10 years',
        status: Status.PENDING,
      };

      const createdCandidate = new Candidate({
        id: 3,
        ...candidateData,
        cvFilePath: null,
      });

      mockCandidateRepository.create.mockResolvedValue(createdCandidate);

      // Act
      const result = await candidateService.createCandidate(candidateData);

      // Assert
      expect(mockCandidateRepository.create).toHaveBeenCalledWith({
        ...candidateData,
        cvFilePath: null,
      });
      expect(result).toEqual(createdCandidate);
    });

    it('should create a candidate with file', async () => {
      // Arrange
      const candidateData = {
        firstName: 'New',
        lastName: 'User',
        email: 'new@example.com',
        address: '789 Pine St',
        education: 'PhD',
        experience: '10 years',
        status: Status.PENDING,
      };

      const mockFile = {
        originalname: 'cv.pdf',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const filePath = '/uploads/secure-cv.pdf';
      mockFileService.saveFile.mockResolvedValue(filePath);

      const createdCandidate = new Candidate({
        id: 3,
        ...candidateData,
        cvFilePath: filePath,
      });

      mockCandidateRepository.create.mockResolvedValue(createdCandidate);

      // Act
      const result = await candidateService.createCandidate(
        candidateData,
        mockFile,
      );

      // Assert
      expect(mockFileService.saveFile).toHaveBeenCalledWith(mockFile);
      expect(mockCandidateRepository.create).toHaveBeenCalledWith({
        ...candidateData,
        cvFilePath: filePath,
      });
      expect(result).toEqual(createdCandidate);
    });
  });

  describe('updateCandidate', () => {
    it('should throw error if candidate not found', async () => {
      // Arrange
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      mockCandidateRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        candidateService.updateCandidate(999, updateData),
      ).rejects.toThrow('Candidate with ID 999 not found');
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(999);
    });

    it('should update a candidate without file', async () => {
      // Arrange
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        status: Status.VALUATED,
      };

      const existingCandidate = new Candidate({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        address: '123 Main St',
        education: "Bachelor's Degree",
        experience: '5 years',
        status: Status.PENDING,
        cvFilePath: '/uploads/existing-cv.pdf',
      });

      const updatedCandidate = new Candidate({
        ...existingCandidate,
        firstName: 'Updated',
        lastName: 'Name',
        status: Status.VALUATED,
      });

      mockCandidateRepository.findById.mockResolvedValue(existingCandidate);
      mockCandidateRepository.update.mockResolvedValue(updatedCandidate);

      // Act
      const result = await candidateService.updateCandidate(1, updateData);

      // Assert
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(1);
      expect(mockCandidateRepository.update).toHaveBeenCalledWith(1, {
        ...updateData,
        cvFilePath: '/uploads/existing-cv.pdf',
      });
      expect(result).toEqual(updatedCandidate);
    });

    it('should update a candidate with new file', async () => {
      // Arrange
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const existingCandidate = new Candidate({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        address: '123 Main St',
        education: "Bachelor's Degree",
        experience: '5 years',
        status: Status.PENDING,
        cvFilePath: '/uploads/old-cv.pdf',
      });

      const mockFile = {
        originalname: 'new-cv.pdf',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const newFilePath = '/uploads/new-secure-cv.pdf';
      mockFileService.saveFile.mockResolvedValue(newFilePath);

      const updatedCandidate = new Candidate({
        ...existingCandidate,
        firstName: 'Updated',
        lastName: 'Name',
        cvFilePath: newFilePath,
      });

      mockCandidateRepository.findById.mockResolvedValue(existingCandidate);
      mockCandidateRepository.update.mockResolvedValue(updatedCandidate);

      // Act
      const result = await candidateService.updateCandidate(
        1,
        updateData,
        mockFile,
      );

      // Assert
      expect(mockFileService.deleteFile).toHaveBeenCalledWith(
        '/uploads/old-cv.pdf',
      );
      expect(mockFileService.saveFile).toHaveBeenCalledWith(mockFile);
      expect(mockCandidateRepository.update).toHaveBeenCalledWith(1, {
        ...updateData,
        cvFilePath: newFilePath,
      });
      expect(result).toEqual(updatedCandidate);
    });
  });

  describe('deleteCandidate', () => {
    it('should throw error if candidate not found', async () => {
      // Arrange
      mockCandidateRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(candidateService.deleteCandidate(999)).rejects.toThrow(
        'Candidate with ID 999 not found',
      );
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(999);
    });

    it('should delete a candidate without CV file', async () => {
      // Arrange
      const candidate = new Candidate({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        address: '123 Main St',
        education: "Bachelor's Degree",
        experience: '5 years',
        status: Status.PENDING,
        cvFilePath: null,
      });

      mockCandidateRepository.findById.mockResolvedValue(candidate);

      // Act
      await candidateService.deleteCandidate(1);

      // Assert
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(1);
      expect(mockFileService.deleteFile).not.toHaveBeenCalled();
      expect(mockCandidateRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should delete a candidate with CV file', async () => {
      // Arrange
      const candidate = new Candidate({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        address: '123 Main St',
        education: "Bachelor's Degree",
        experience: '5 years',
        status: Status.PENDING,
        cvFilePath: '/uploads/cv.pdf',
      });

      mockCandidateRepository.findById.mockResolvedValue(candidate);

      // Act
      await candidateService.deleteCandidate(1);

      // Assert
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(1);
      expect(mockFileService.deleteFile).toHaveBeenCalledWith(
        '/uploads/cv.pdf',
      );
      expect(mockCandidateRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('getStatistics', () => {
    it('should return candidate statistics', async () => {
      // Arrange
      const mockStatistics = {
        total: 10,
        pending: 5,
        valuated: 3,
        discarded: 2,
      };

      mockCandidateRepository.getStatistics.mockResolvedValue(mockStatistics);

      // Act
      const result = await candidateService.getStatistics();

      // Assert
      expect(mockCandidateRepository.getStatistics).toHaveBeenCalled();
      expect(result).toEqual(mockStatistics);
    });
  });

  describe('getEducationSuggestions', () => {
    it('should return education suggestions', async () => {
      // Arrange
      const mockEducationValues = [
        "Bachelor's Degree",
        "Master's Degree",
        'PhD',
      ];
      mockCandidateRepository.findEducationValues.mockResolvedValue(
        mockEducationValues,
      );

      // Act
      const result = await candidateService.getEducationSuggestions();

      // Assert
      expect(mockCandidateRepository.findEducationValues).toHaveBeenCalled();
      expect(result).toEqual(mockEducationValues);
    });
  });

  describe('getExperienceSuggestions', () => {
    it('should return experience suggestions', async () => {
      // Arrange
      const mockExperienceValues = ['1 year', '3 years', '5 years'];
      mockCandidateRepository.findExperienceValues.mockResolvedValue(
        mockExperienceValues,
      );

      // Act
      const result = await candidateService.getExperienceSuggestions();

      // Assert
      expect(mockCandidateRepository.findExperienceValues).toHaveBeenCalled();
      expect(result).toEqual(mockExperienceValues);
    });
  });

  describe('getCvFilePath', () => {
    it('should return the file path for a given filename', () => {
      // Arrange
      const filename = 'cv-123.pdf';
      const expectedPath = '/uploads/cv-123.pdf';
      mockFileService.getFilePath.mockReturnValue(expectedPath);

      // Act
      const result = candidateService.getCvFilePath(filename);

      // Assert
      expect(mockFileService.getFilePath).toHaveBeenCalledWith(filename);
      expect(result).toEqual(expectedPath);
    });
  });
});
