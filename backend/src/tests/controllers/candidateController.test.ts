import { Request, Response, NextFunction } from 'express';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { CandidateController } from '../../controllers/candidateController';
import { CandidateService } from '../../services/candidateService';
import { FileUploadService } from '../../services/fileUploadService';
import { ValidationError } from '../../utils/errors';
import '@types/jest';

// Mock de los servicios
jest.mock('../../services/candidateService');
jest.mock('../../services/fileUploadService');

describe('CandidateController', () => {
  let candidateController: CandidateController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  let mockCandidateService: jest.Mocked<CandidateService>;
  let mockFileUploadService: jest.Mocked<FileUploadService>;

  beforeEach(() => {
    // Reiniciar todos los mocks antes de cada prueba
    jest.clearAllMocks();
    
    // Crear mocks de los servicios
    mockCandidateService = new CandidateService() as jest.Mocked<CandidateService>;
    mockFileUploadService = new FileUploadService() as jest.Mocked<FileUploadService>;
    
    // Crear instancia del controlador con los servicios mockeados
    candidateController = new CandidateController();
    (candidateController as any).candidateService = mockCandidateService;
    (candidateController as any).fileUploadService = mockFileUploadService;
    
    // Mock de request, response y next
    mockRequest = {
      body: {},
      params: {},
      files: {}
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
        cvUrl: 'http://localhost:3010/uploads/cv/123456789.pdf',
        cvFileName: 'cv_juan.pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockRequest.body = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '+34612345678',
        address: 'Calle Principal 123'
      };
      
      mockRequest.files = {
        cv: {
          name: 'cv_juan.pdf',
          mimetype: 'application/pdf',
          size: 12345,
          mv: jest.fn().mockResolvedValue(undefined)
        }
      };
      
      // Mock del servicio
      mockCandidateService.createCandidate.mockResolvedValue(mockCandidate);
      
      // Act
      await candidateController.createCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockCandidateService.createCandidate).toHaveBeenCalledWith(
        mockRequest.body,
        mockRequest.files.cv
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Candidato creado exitosamente',
        data: mockCandidate
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('debería manejar errores de validación', async () => {
      // Arrange
      mockRequest.body = {
        // Sin firstName, lastName ni email
        phone: '+34612345678'
      };
      
      // Mock del servicio para lanzar error de validación
      const validationError = new ValidationError('Nombre, apellido, email y teléfono son obligatorios');
      mockCandidateService.createCandidate.mockRejectedValue(validationError);
      
      // Act
      await candidateController.createCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockCandidateService.createCandidate).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Nombre, apellido, email y teléfono son obligatorios'
      });
    });

    it('debería manejar errores de email duplicado', async () => {
      // Arrange
      mockRequest.body = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '+34612345678'
      };
      
      // Mock del servicio para lanzar error de email duplicado
      const validationError = new ValidationError('Ya existe un candidato con ese email');
      mockCandidateService.createCandidate.mockRejectedValue(validationError);
      
      // Act
      await candidateController.createCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockCandidateService.createCandidate).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Ya existe un candidato con ese email'
      });
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
          phone: '+34612345678',
          address: 'Calle Principal 123',
          cvUrl: 'http://localhost:3010/uploads/cv/123456789.pdf',
          cvFileName: 'cv_juan.pdf',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          firstName: 'María',
          lastName: 'García',
          email: 'maria.garcia@example.com',
          phone: '+34612345679',
          address: 'Calle Secundaria 456',
          cvUrl: 'http://localhost:3010/uploads/cv/987654321.pdf',
          cvFileName: 'cv_maria.pdf',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      // Mock del servicio
      mockCandidateService.getAllCandidates.mockResolvedValue(mockCandidates);
      
      // Act
      await candidateController.getAllCandidates(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockCandidateService.getAllCandidates).toHaveBeenCalled();
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
      mockCandidateService.getAllCandidates.mockRejectedValue(mockError);
      
      // Act
      await candidateController.getAllCandidates(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockCandidateService.getAllCandidates).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener candidatos'
      });
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
        phone: '+34612345678',
        address: 'Calle Principal 123',
        cvUrl: 'http://localhost:3010/uploads/cv/123456789.pdf',
        cvFileName: 'cv_juan.pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockRequest.params = { id: '1' };
      
      // Mock del servicio
      mockCandidateService.getCandidateById.mockResolvedValue(mockCandidate);
      
      // Act
      await candidateController.getCandidateById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockCandidateService.getCandidateById).toHaveBeenCalledWith(1);
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
      expect(mockCandidateService.getCandidateById).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'ID de candidato inválido'
      });
    });

    it('debería manejar candidato no encontrado', async () => {
      // Arrange
      mockRequest.params = { id: '999' }; // ID que no existe
      
      // Mock del servicio para devolver null
      mockCandidateService.getCandidateById.mockResolvedValue(null);
      
      // Act
      await candidateController.getCandidateById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockCandidateService.getCandidateById).toHaveBeenCalledWith(999);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Candidato no encontrado'
      });
    });
  });

  describe('updateCandidate', () => {
    it('debería actualizar un candidato con datos válidos', async () => {
      // Arrange
      const mockCandidate = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez Actualizado',
        email: 'juan.perez@example.com',
        phone: '+34612345678',
        address: 'Calle Principal 123 Actualizada',
        cvUrl: 'http://localhost:3010/uploads/cv/123456789.pdf',
        cvFileName: 'cv_juan.pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockRequest.params = { id: '1' };
      mockRequest.body = {
        lastName: 'Pérez Actualizado',
        address: 'Calle Principal 123 Actualizada'
      };
      
      // Mock del servicio
      mockCandidateService.updateCandidate.mockResolvedValue(mockCandidate);
      
      // Act
      await candidateController.updateCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockCandidateService.updateCandidate).toHaveBeenCalledWith(1, mockRequest.body, undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Candidato actualizado exitosamente',
        data: mockCandidate
      });
    });

    it('debería validar formato de ID', async () => {
      // Arrange
      mockRequest.params = { id: 'abc' }; // ID no numérico
      
      // Act
      await candidateController.updateCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockCandidateService.updateCandidate).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'ID de candidato inválido'
      });
    });

    it('debería manejar candidato no encontrado', async () => {
      // Arrange
      mockRequest.params = { id: '999' }; // ID que no existe
      mockRequest.body = {
        lastName: 'Pérez Actualizado'
      };
      
      // Mock del servicio para devolver null
      mockCandidateService.updateCandidate.mockResolvedValue(null);
      
      // Act
      await candidateController.updateCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockCandidateService.updateCandidate).toHaveBeenCalledWith(999, mockRequest.body, undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Candidato no encontrado'
      });
    });
  });

  describe('deleteCandidate', () => {
    it('debería eliminar un candidato', async () => {
      // Arrange
      const mockCandidate = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '+34612345678',
        address: 'Calle Principal 123',
        cvUrl: 'http://localhost:3010/uploads/cv/123456789.pdf',
        cvFileName: 'cv_juan.pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockRequest.params = { id: '1' };
      
      // Mock del servicio
      mockCandidateService.deleteCandidate.mockResolvedValue(mockCandidate);
      
      // Act
      await candidateController.deleteCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockCandidateService.deleteCandidate).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Candidato eliminado exitosamente'
      });
    });

    it('debería validar formato de ID', async () => {
      // Arrange
      mockRequest.params = { id: 'abc' }; // ID no numérico
      
      // Act
      await candidateController.deleteCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockCandidateService.deleteCandidate).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'ID de candidato inválido'
      });
    });

    it('debería manejar errores al eliminar candidato', async () => {
      // Arrange
      mockRequest.params = { id: '1' };
      
      // Mock del servicio para lanzar error
      const mockError = new Error('Error al eliminar candidato');
      mockCandidateService.deleteCandidate.mockRejectedValue(mockError);
      
      // Act
      await candidateController.deleteCandidate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      // Assert
      expect(mockCandidateService.deleteCandidate).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al eliminar candidato'
      });
    });
  });
}); 