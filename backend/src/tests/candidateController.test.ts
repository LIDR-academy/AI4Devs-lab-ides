import { Request, Response } from 'express';
import { CandidateController } from '../controllers/candidateController';
import { CandidateService } from '../services/candidateService';

// Mock de CandidateService
jest.mock('../services/candidateService');

describe('CandidateController', () => {
  let candidateController: CandidateController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    // Reiniciar todos los mocks antes de cada prueba
    jest.clearAllMocks();
    
    // Crear instancia del controlador
    candidateController = new CandidateController();
    
    // Mock de request, response y next
    mockRequest = {
      body: {},
      params: {},
      file: undefined
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
  });

  describe('createCandidate', () => {
    it('debería crear un candidato con datos válidos', async () => {
      // Arrange
      const mockCandidate = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '+34612345678',
        address: 'Calle Principal 123',
        education: 'Ingeniería Informática',
        workExperience: '5 años como desarrollador',
        cvUrl: 'http://localhost:3010/uploads/cv/123456789.pdf',
        cvFileName: 'cv_juan.pdf',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockRequest.body = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '+34612345678',
        address: 'Calle Principal 123',
        education: 'Ingeniería Informática',
        workExperience: '5 años como desarrollador'
      };
      
      mockRequest.file = {
        fieldname: 'cv',
        originalname: 'cv_juan.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        destination: 'uploads/cv',
        filename: '123456789.pdf',
        path: 'uploads/cv/123456789.pdf',
        size: 12345
      } as Express.Multer.File;
      
      // Mock del servicio
      (CandidateService.prototype.createCandidate as jest.Mock).mockResolvedValue(mockCandidate);
      
      // Act
      await candidateController.createCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(CandidateService.prototype.createCandidate).toHaveBeenCalledWith(
        mockRequest,
        mockRequest.body
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockCandidate
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('debería validar campos obligatorios', async () => {
      // Arrange
      mockRequest.body = {
        // Sin firstName, lastName ni email
        phone: '+34612345678'
      };
      
      // Act
      await candidateController.createCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(CandidateService.prototype.createCandidate).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: expect.stringContaining('obligatorio'),
          details: expect.any(Object)
        }
      });
    });

    it('debería validar formato de email', async () => {
      // Arrange
      mockRequest.body = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juanperez@com' // Email inválido
      };
      
      // Act
      await candidateController.createCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(CandidateService.prototype.createCandidate).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: expect.stringContaining('email'),
          details: expect.any(Object)
        }
      });
    });

    it('debería manejar errores del servicio', async () => {
      // Arrange
      mockRequest.body = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com'
      };
      
      const mockError = new Error('Email duplicado');
      (mockError as any).code = 'DUPLICATE_EMAIL';
      (mockError as any).statusCode = 400;
      
      // Mock del servicio para lanzar error
      (CandidateService.prototype.createCandidate as jest.Mock).mockRejectedValue(mockError);
      
      // Act
      await candidateController.createCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(CandidateService.prototype.createCandidate).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getAllCandidates', () => {
    it('debería obtener todos los candidatos', async () => {
      // Arrange
      const mockCandidates = [
        {
          id: 1,
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          firstName: 'María',
          lastName: 'García',
          email: 'maria.garcia@example.com',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      // Mock del servicio
      (CandidateService.prototype.getAllCandidates as jest.Mock).mockResolvedValue(mockCandidates);
      
      // Act
      await candidateController.getAllCandidates(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(CandidateService.prototype.getAllCandidates).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockCandidates
      });
    });

    it('debería manejar errores al obtener candidatos', async () => {
      // Arrange
      const mockError = new Error('Error al obtener candidatos');
      
      // Mock del servicio para lanzar error
      (CandidateService.prototype.getAllCandidates as jest.Mock).mockRejectedValue(mockError);
      
      // Act
      await candidateController.getAllCandidates(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(CandidateService.prototype.getAllCandidates).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getCandidateById', () => {
    it('debería obtener un candidato por ID', async () => {
      // Arrange
      const mockCandidate = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockRequest.params = { id: '1' };
      
      // Mock del servicio
      (CandidateService.prototype.getCandidateById as jest.Mock).mockResolvedValue(mockCandidate);
      
      // Act
      await candidateController.getCandidateById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(CandidateService.prototype.getCandidateById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockCandidate
      });
    });

    it('debería validar formato de ID', async () => {
      // Arrange
      mockRequest.params = { id: 'abc' }; // ID no numérico
      
      // Act
      await candidateController.getCandidateById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(CandidateService.prototype.getCandidateById).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: expect.stringContaining('ID')
        }
      });
    });

    it('debería manejar errores al obtener candidato por ID', async () => {
      // Arrange
      mockRequest.params = { id: '999' }; // ID que no existe
      
      const mockError = new Error('Candidato no encontrado');
      (mockError as any).code = 'CANDIDATE_NOT_FOUND';
      (mockError as any).statusCode = 404;
      
      // Mock del servicio para lanzar error
      (CandidateService.prototype.getCandidateById as jest.Mock).mockRejectedValue(mockError);
      
      // Act
      await candidateController.getCandidateById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(CandidateService.prototype.getCandidateById).toHaveBeenCalledWith(999);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  // Pruebas para updateCandidate y deleteCandidate seguirían un patrón similar
}); 