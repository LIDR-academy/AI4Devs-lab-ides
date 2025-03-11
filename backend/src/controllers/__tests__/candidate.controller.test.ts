import { Request, Response } from 'express';
import { CandidateController } from '../candidate.controller';
import { CandidateService } from '../../services/candidate.service';
import { CreateCandidateDto, ICandidate } from '../../interfaces/candidate.interface';
import * as validationUtils from '../../utils/validation';

// Extender Request para incluir file de Multer
interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

// Mock CandidateService
jest.mock('../../services/candidate.service');

// Mock de las funciones de validación
jest.mock('../../utils/validation');
const mockValidationUtils = validationUtils as jest.Mocked<typeof validationUtils>;

describe('CandidateController', () => {
  let controller: CandidateController;
  let candidateService: jest.Mocked<CandidateService>;
  let mockRequest: Partial<RequestWithFile>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  const validCandidateData: CreateCandidateDto = {
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

  beforeEach(() => {
    // Limpiar todos los mocks
    jest.clearAllMocks();
    
    // Configurar mocks de validación
    mockValidationUtils.validateEmail.mockImplementation((email: string) => {
      return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
    });
    mockValidationUtils.sanitizeInput.mockImplementation((input: string | null): string | null => {
      if (input === null || input === undefined) return input;
      if (input === '<script>alert("xss")</script>John') return 'John';
      if (input === '<p>Doe</p>') return 'Doe';
      if (input === '<img src="x" onerror="alert(1)">Test Address') return 'Test Address';
      return input;
    });
    
    // Crear una nueva instancia mockeada del servicio
    candidateService = {
      createCandidate: jest.fn(),
      findCandidateByEmail: jest.fn(),
      addDocument: jest.fn(),
      addEducation: jest.fn(),
      addWorkExperience: jest.fn(),
      validateDates: jest.fn()
    } as unknown as jest.Mocked<CandidateService>;

    // Crear el controller con el servicio mockeado
    controller = new CandidateController(candidateService);
    
    // Configurar los mocks de response y next
    mockNext = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis()
    };
  });

  describe('createCandidate', () => {
    beforeEach(() => {
      mockRequest = {
        body: validCandidateData
      };
    });

    it('should create a candidate and return 201 status', async () => {
      const mockCreatedCandidate: ICandidate = {
        id: '123',
        firstName: validCandidateData.firstName,
        lastName: validCandidateData.lastName,
        email: validCandidateData.email,
        phone: validCandidateData.phone,
        address: validCandidateData.address ?? null,
        education: validCandidateData.education.map(edu => ({
          ...edu,
          id: '1',
          candidateId: '123',
          description: edu.description ?? null,
          createdAt: new Date(),
          updatedAt: new Date()
        })),
        workExperience: validCandidateData.workExperience.map(exp => ({
          ...exp,
          id: '1',
          candidateId: '123',
          responsibilities: exp.responsibilities ?? null,
          createdAt: new Date(),
          updatedAt: new Date()
        })),
        document: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      candidateService.createCandidate.mockResolvedValue(mockCreatedCandidate);

      await controller.createCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(candidateService.createCandidate).toHaveBeenCalledWith({
        ...validCandidateData,
        firstName: mockValidationUtils.sanitizeInput(validCandidateData.firstName) || validCandidateData.firstName,
        lastName: mockValidationUtils.sanitizeInput(validCandidateData.lastName) || validCandidateData.lastName,
        address: mockValidationUtils.sanitizeInput(validCandidateData.address ?? null)
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedCandidate);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Location',
        `/api/candidates/${mockCreatedCandidate.id}`
      );
    });

    it('should validate email format', async () => {
      mockRequest.body = {
        ...validCandidateData,
        email: 'invalid-email'
      };

      await controller.createCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 400,
          message: 'Invalid email format'
        })
      );
      expect(candidateService.createCandidate).not.toHaveBeenCalled();
    });

    it('should sanitize input data', async () => {
      const requestData = {
        ...validCandidateData,
        firstName: '<script>alert("xss")</script>John',
        lastName: '<p>Doe</p>',
        address: '<img src="x" onerror="alert(1)">Test Address'
      };

      mockRequest.body = requestData;

      const expectedSanitizedData = {
        ...validCandidateData,
        firstName: 'John',
        lastName: 'Doe',
        address: 'Test Address'
      };

      await controller.createCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verificar que sanitizeInput fue llamado con los valores correctos
      expect(mockValidationUtils.sanitizeInput).toHaveBeenCalledWith('<script>alert("xss")</script>John');
      expect(mockValidationUtils.sanitizeInput).toHaveBeenCalledWith('<p>Doe</p>');
      expect(mockValidationUtils.sanitizeInput).toHaveBeenCalledWith('<img src="x" onerror="alert(1)">Test Address');

      // Verificar que createCandidate fue llamado con los datos sanitizados
      expect(candidateService.createCandidate).toHaveBeenCalledWith(expectedSanitizedData);
    });

    it('should handle null values in sanitization', async () => {
      const requestData = {
        ...validCandidateData,
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

      mockRequest.body = requestData;

      await controller.createCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(candidateService.createCandidate).toHaveBeenCalledWith({
        ...requestData,
        firstName: mockValidationUtils.sanitizeInput(requestData.firstName),
        lastName: mockValidationUtils.sanitizeInput(requestData.lastName),
        address: mockValidationUtils.sanitizeInput(requestData.address)
      });
    });

    it('should handle undefined values in sanitization', async () => {
      const requestData = {
        ...validCandidateData,
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

      mockRequest.body = requestData;

      await controller.createCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(candidateService.createCandidate).toHaveBeenCalledWith({
        ...requestData,
        firstName: mockValidationUtils.sanitizeInput(requestData.firstName),
        lastName: mockValidationUtils.sanitizeInput(requestData.lastName),
        address: mockValidationUtils.sanitizeInput(requestData.address ?? null)
      });
    });

    it('should handle empty string in sanitization', async () => {
      const requestData = {
        ...validCandidateData,
        address: ''
      };

      mockRequest.body = requestData;

      await controller.createCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(candidateService.createCandidate).toHaveBeenCalledWith(requestData);
    });

    it('should handle duplicate email error', async () => {
      candidateService.createCandidate.mockRejectedValue(
        new Error('Unique constraint failed on email')
      );

      await controller.createCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 409,
          message: 'Email already exists'
        })
      );
    });
  });

  describe('findCandidateByEmail', () => {
    beforeEach(() => {
      mockRequest = {
        params: { email: 'john@example.com' }
      };
    });

    it('should return candidate if found', async () => {
      const mockCandidate: ICandidate = {
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

      candidateService.findCandidateByEmail.mockResolvedValue(mockCandidate);

      await controller.findCandidateByEmail(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCandidate);
    });

    it('should return 404 if candidate not found', async () => {
      candidateService.findCandidateByEmail.mockResolvedValue(null);

      await controller.findCandidateByEmail(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 404,
          message: 'Candidate not found'
        })
      );
    });

    it('should validate email parameter', async () => {
      mockRequest.params = { email: 'invalid-email' };

      await controller.findCandidateByEmail(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 400,
          message: 'Invalid email format'
        })
      );
    });
  });

  describe('addDocument', () => {
    const mockFile = {
      originalname: 'test.pdf',
      mimetype: 'application/pdf',
      size: 1024 * 1024, // 1MB
      path: 'uploads/documents/test.pdf'
    } as Express.Multer.File;

    beforeEach(() => {
      mockRequest = {
        params: { id: '123' },
        file: mockFile
      };
    });

    it('should add document to candidate', async () => {
      const mockDocument = {
        id: '456',
        candidateId: '123',
        fileName: 'test.pdf',
        fileType: 'PDF' as const,
        fileSize: 1024 * 1024,
        filePath: 'uploads/documents/test.pdf',
        uploadedAt: new Date()
      };

      candidateService.addDocument.mockResolvedValue(mockDocument);

      await controller.addDocument(
        mockRequest as RequestWithFile,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockDocument);
    });

    it('should handle missing file', async () => {
      mockRequest.file = undefined;

      await controller.addDocument(
        mockRequest as RequestWithFile,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 400,
          message: 'No file uploaded'
        })
      );
    });

    it('should handle duplicate document error', async () => {
      candidateService.addDocument.mockRejectedValue(
        new Error('Candidate already has a document')
      );

      await controller.addDocument(
        mockRequest as RequestWithFile,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 409,
          message: 'Candidate already has a document'
        })
      );
    });

    it('should handle unexpected errors', async () => {
      const unexpectedError = new Error('Unexpected error');
      candidateService.addDocument.mockRejectedValue(unexpectedError);

      await controller.addDocument(
        mockRequest as RequestWithFile,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(unexpectedError);
    });
  });

  describe('error handling', () => {
    it('should handle unexpected errors in createCandidate', async () => {
      const unexpectedError = new Error('Database connection failed');
      candidateService.createCandidate.mockRejectedValue(unexpectedError);

      // Asegurarnos de que tenemos un cuerpo de solicitud válido
      mockRequest = {
        body: validCandidateData
      };

      await controller.createCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(unexpectedError);
    });

    it('should handle unexpected errors in findCandidateByEmail', async () => {
      const unexpectedError = new Error('Database query failed');
      candidateService.findCandidateByEmail.mockRejectedValue(unexpectedError);

      // Asegurarnos de que tenemos un email válido
      mockRequest = {
        params: { email: 'valid@example.com' }
      };

      await controller.findCandidateByEmail(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(unexpectedError);
    });
  });
}); 