import { PrismaClient } from '@prisma/client';
import { CandidateService } from '../candidate.service';
import { CreateCandidateDto, CreateDocumentDto } from '../../interfaces/candidate.interface';

// Mock PrismaClient
const mockPrismaClient = {
  candidate: {
    create: jest.fn(),
    findUnique: jest.fn()
  },
  education: {
    create: jest.fn()
  },
  workExperience: {
    create: jest.fn()
  },
  document: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn()
  }
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient)
}));

describe('CandidateService', () => {
  let service: CandidateService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CandidateService(mockPrismaClient as unknown as PrismaClient);
  });

  describe('createCandidate', () => {
    const mockCandidateData: CreateCandidateDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+34666555444',
      address: 'Test Address',
      education: [{
        title: 'Computer Science',
        institution: 'Test University',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2022-06-30'),
        description: 'Test description'
      }],
      workExperience: [{
        company: 'Test Company',
        position: 'Developer',
        startDate: new Date('2022-07-01'),
        endDate: new Date('2023-12-31'),
        responsibilities: 'Test responsibilities'
      }]
    };

    it('should create a candidate with education and work experience', async () => {
      const mockResult = {
        id: '123',
        ...mockCandidateData,
        createdAt: new Date(),
        updatedAt: new Date(),
        education: [{ id: '456', ...mockCandidateData.education[0] }],
        workExperience: [{ id: '789', ...mockCandidateData.workExperience[0] }],
        document: null
      };

      mockPrismaClient.candidate.create.mockResolvedValue(mockResult);

      const result = await service.createCandidate(mockCandidateData);

      expect(result).toHaveProperty('id');
      expect(result.firstName).toBe(mockCandidateData.firstName);
      expect(result.education).toHaveLength(1);
      expect(result.workExperience).toHaveLength(1);
    });

    it('should throw error if email already exists', async () => {
      mockPrismaClient.candidate.create.mockRejectedValue(
        new Error('Unique constraint failed on email')
      );

      await expect(service.createCandidate(mockCandidateData))
        .rejects
        .toThrow('Unique constraint failed on email');
    });

    it('should handle null values in optional fields', async () => {
      const candidateData = {
        ...mockCandidateData,
        address: null,
        education: [{
          title: 'Computer Science',
          institution: 'Test University',
          startDate: new Date('2018-09-01'),
          endDate: new Date('2022-06-30'),
          description: null
        }],
        workExperience: [{
          company: 'Test Company',
          position: 'Developer',
          startDate: new Date('2022-07-01'),
          endDate: new Date('2023-12-31'),
          responsibilities: null
        }]
      };

      const mockResult = {
        id: '123',
        ...candidateData,
        createdAt: new Date(),
        updatedAt: new Date(),
        document: null
      };

      mockPrismaClient.candidate.create.mockResolvedValue(mockResult);

      const result = await service.createCandidate(candidateData);

      expect(result.address).toBeNull();
      expect(result.education[0].description).toBeNull();
      expect(result.workExperience[0].responsibilities).toBeNull();
    });

    it('should handle undefined values in optional fields', async () => {
      const candidateData = {
        ...mockCandidateData,
        address: undefined,
        education: [{
          title: 'Computer Science',
          institution: 'Test University',
          startDate: new Date('2018-09-01'),
          endDate: new Date('2022-06-30'),
          description: undefined
        }],
        workExperience: [{
          company: 'Test Company',
          position: 'Developer',
          startDate: new Date('2022-07-01'),
          endDate: new Date('2023-12-31'),
          responsibilities: undefined
        }]
      };

      const mockResult = {
        id: '123',
        ...candidateData,
        address: null,
        education: [{
          ...candidateData.education[0],
          description: null,
          id: '456',
          candidateId: '123',
          createdAt: new Date(),
          updatedAt: new Date()
        }],
        workExperience: [{
          ...candidateData.workExperience[0],
          responsibilities: null,
          id: '789',
          candidateId: '123',
          createdAt: new Date(),
          updatedAt: new Date()
        }],
        createdAt: new Date(),
        updatedAt: new Date(),
        document: null
      };

      mockPrismaClient.candidate.create.mockResolvedValue(mockResult);

      const result = await service.createCandidate(candidateData);

      expect(result.address).toBeNull();
      expect(result.education[0].description).toBeNull();
      expect(result.workExperience[0].responsibilities).toBeNull();
    });
  });

  describe('addEducation', () => {
    const mockEducationData = {
      title: 'Computer Science',
      institution: 'Test University',
      startDate: new Date('2018-09-01'),
      endDate: new Date('2022-06-30'),
      description: 'Test description'
    };

    it('should add education to existing candidate', async () => {
      const mockResult = {
        id: '456',
        candidateId: '123',
        ...mockEducationData
      };

      mockPrismaClient.education.create.mockResolvedValue(mockResult);

      const result = await service.addEducation('123', mockEducationData);

      expect(result).toHaveProperty('id');
      expect(result.title).toBe(mockEducationData.title);
    });
  });

  describe('addWorkExperience', () => {
    const mockWorkExperienceData = {
      company: 'Test Company',
      position: 'Developer',
      startDate: new Date('2022-07-01'),
      endDate: new Date('2023-12-31'),
      responsibilities: 'Test responsibilities'
    };

    it('should add work experience to existing candidate', async () => {
      const mockResult = {
        id: '789',
        candidateId: '123',
        ...mockWorkExperienceData
      };

      mockPrismaClient.workExperience.create.mockResolvedValue(mockResult);

      const result = await service.addWorkExperience('123', mockWorkExperienceData);

      expect(result).toHaveProperty('id');
      expect(result.company).toBe(mockWorkExperienceData.company);
    });
  });

  describe('addDocument', () => {
    const mockDocumentData: CreateDocumentDto = {
      fileName: 'test.pdf',
      fileType: 'PDF',
      fileSize: 1024
    };

    const mockFile = {
      path: 'uploads/documents/test.pdf',
      originalname: 'test.pdf',
      mimetype: 'application/pdf',
      size: 1024
    } as Express.Multer.File;

    it('should add document to candidate if no document exists', async () => {
      mockPrismaClient.document.findUnique.mockResolvedValue(null);
      
      const mockResult = {
        id: '101',
        candidateId: '123',
        ...mockDocumentData,
        filePath: mockFile.path
      };

      mockPrismaClient.document.create.mockResolvedValue(mockResult);

      const result = await service.addDocument('123', mockDocumentData, mockFile);

      expect(result).toHaveProperty('id');
      expect(result.fileName).toBe(mockDocumentData.fileName);
      expect(result.filePath).toBe(mockFile.path);
    });

    it('should throw error if document already exists', async () => {
      const existingDocument = {
        id: '1',
        candidateId: '1',
        fileName: 'existing.pdf',
        fileType: 'PDF',
        fileSize: 1024,
        filePath: '/path/to/file',
        uploadedAt: new Date()
      };

      mockPrismaClient.document.findUnique.mockResolvedValue(existingDocument);
      mockPrismaClient.document.delete.mockResolvedValue(existingDocument);

      await expect(service.addDocument('1', mockDocumentData, mockFile))
        .rejects.toThrow('Candidate already has a document');

      expect(mockPrismaClient.document.delete).toHaveBeenCalledWith({
        where: { candidateId: '1' }
      });
    });

    it('should handle different file types', async () => {
      mockPrismaClient.document.findUnique.mockResolvedValue(null);
      mockPrismaClient.document.create.mockImplementation(({ data }) => ({
        ...data,
        id: '1',
        uploadedAt: new Date()
      }));

      const docxFile = {
        ...mockFile,
        originalname: 'test.docx',
        path: 'uploads/documents/test.docx',
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      } as Express.Multer.File;

      const docxResult = await service.addDocument('1', {
        fileName: 'test.docx',
        fileType: 'DOCX',
        fileSize: 1024
      }, docxFile);

      expect(docxResult.fileType).toBe('DOCX');

      const pdfResult = await service.addDocument('2', {
        fileName: 'test.pdf',
        fileType: 'PDF',
        fileSize: 1024
      }, mockFile);

      expect(pdfResult.fileType).toBe('PDF');
    });
  });

  describe('findCandidateByEmail', () => {
    it('should find candidate by email', async () => {
      const mockResult = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+34666555444',
        address: 'Test Address',
        education: [],
        workExperience: [],
        document: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrismaClient.candidate.findUnique.mockResolvedValue(mockResult);

      const result = await service.findCandidateByEmail('john@example.com');

      expect(result).toHaveProperty('id');
      expect(result?.email).toBe('john@example.com');
    });

    it('should return null if candidate not found', async () => {
      mockPrismaClient.candidate.findUnique.mockResolvedValue(null);

      const result = await service.findCandidateByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('validateDates', () => {
    it('should return true if start date is before end date', async () => {
      const result = await service.validateDates(
        new Date('2023-01-01'),
        new Date('2023-12-31')
      );
      expect(result).toBe(true);
    });

    it('should return true if dates are equal', async () => {
      const date = new Date('2023-01-01');
      const result = await service.validateDates(date, date);
      expect(result).toBe(true);
    });

    it('should return false if start date is after end date', async () => {
      const result = await service.validateDates(
        new Date('2023-12-31'),
        new Date('2023-01-01')
      );
      expect(result).toBe(false);
    });

    it('should return true when dates are equal', async () => {
      const date = new Date('2024-01-01');
      const result = await service.validateDates(date, date);
      expect(result).toBe(true);
    });

    it('should return false when start date is after end date', async () => {
      const startDate = new Date('2024-01-02');
      const endDate = new Date('2024-01-01');
      const result = await service.validateDates(startDate, endDate);
      expect(result).toBe(false);
    });
  });
}); 