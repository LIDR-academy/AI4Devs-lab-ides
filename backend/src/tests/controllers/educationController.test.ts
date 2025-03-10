import { Request, Response, NextFunction } from 'express';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { EducationController } from '../../controllers/educationController';
import { EducationService } from '../../services/educationService';

// Importaciones de Jest
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Configuración de mocks
const mockEducationService = mockDeep<EducationService>();
const mockRequest = {
  params: {},
  body: {}
} as unknown as Request;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
} as unknown as Response;
const mockNext = jest.fn() as NextFunction;

// Instancia del controlador con el servicio mockeado
let educationController: EducationController;

beforeEach(() => {
  mockReset(mockEducationService);
  // Resetear request y response
  mockRequest.params = {};
  mockRequest.body = {};
  jest.clearAllMocks();
  
  educationController = new EducationController();
  // Reemplazar el servicio real por el mock
  (educationController as any).educationService = mockEducationService;
});

describe('EducationController', () => {
  describe('createEducation', () => {
    it('debe crear un registro de educación y devolver 201', async () => {
      // Datos de prueba
      const educationData = {
        candidateId: 1,
        institution: 'Universidad Test',
        degree: 'Ingeniería',
        fieldOfStudy: 'Informática',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
        description: 'Descripción de prueba'
      };

      // Configurar el mock de la solicitud
      mockRequest.body = educationData;

      // Configurar el mock del servicio
      mockEducationService.createEducation.mockResolvedValue({
        id: 1,
        ...educationData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Ejecutar el método del controlador
      await educationController.createEducation(mockRequest, mockResponse, mockNext);

      // Verificar que se llamó al servicio con los datos correctos
      expect(mockEducationService.createEducation).toHaveBeenCalledWith(educationData);

      // Verificar la respuesta
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Educación creada exitosamente',
        data: expect.objectContaining({ id: 1 })
      });
    });

    it('debe devolver 400 si faltan campos requeridos', async () => {
      // Datos incompletos
      const educationData = {
        candidateId: 1,
        institution: 'Universidad Test',
        // Falta degree y fieldOfStudy
        startDate: new Date('2020-01-01')
      };

      // Configurar el mock de la solicitud
      mockRequest.body = educationData;

      // Ejecutar el método del controlador
      await educationController.createEducation(mockRequest, mockResponse, mockNext);

      // Verificar la respuesta de error
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Campos obligatorios faltantes'
      });
    });
  });

  describe('getEducationById', () => {
    it('debe obtener un registro de educación por ID y devolver 200', async () => {
      // Datos de prueba
      const educationId = '1';
      const educationData = {
        id: 1,
        institution: 'Universidad Test',
        degree: 'Ingeniería',
        fieldOfStudy: 'Informática',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
        description: 'Descripción de prueba',
        candidateId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Configurar el mock de la solicitud
      mockRequest.params = { id: educationId };

      // Configurar el mock del servicio
      mockEducationService.getEducationById.mockResolvedValue(educationData);

      // Ejecutar el método del controlador
      await educationController.getEducationById(mockRequest, mockResponse, mockNext);

      // Verificar que se llamó al servicio con el ID correcto
      expect(mockEducationService.getEducationById).toHaveBeenCalledWith(1);

      // Verificar la respuesta
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: educationData
      });
    });

    it('debe devolver 404 si no se encuentra el registro', async () => {
      // Configurar el mock de la solicitud
      mockRequest.params = { id: '999' };

      // Configurar el mock del servicio para devolver null
      mockEducationService.getEducationById.mockResolvedValue(null);

      // Ejecutar el método del controlador
      await educationController.getEducationById(mockRequest, mockResponse, mockNext);

      // Verificar la respuesta de error
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Registro de educación no encontrado'
      });
    });
  });
}); 