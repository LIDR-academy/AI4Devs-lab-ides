import { mockDeep, mockReset } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { CandidateService } from '../../services/candidateService';
import { CandidateRepository } from '../../repositories/candidateRepository';
import { EducationService } from '../../services/educationService';
import { WorkExperienceService } from '../../services/workExperienceService';
import { AutocompleteService } from '../../services/autocompleteService';
import { ValidationError } from '../../utils/errors';
import { UploadedFile } from 'express-fileupload';
import * as fs from 'fs';
import path from 'path';
import '@types/jest';

// Mock de los módulos externos
jest.mock('../../repositories/candidateRepository');
jest.mock('../../services/educationService');
jest.mock('../../services/workExperienceService');
jest.mock('../../services/autocompleteService');
jest.mock('fs');
jest.mock('path');

describe('CandidateService', () => {
  let candidateService: CandidateService;
  let mockCandidateRepository: jest.Mocked<CandidateRepository>;
  let mockEducationService: jest.Mocked<EducationService>;
  let mockWorkExperienceService: jest.Mocked<WorkExperienceService>;
  let mockAutocompleteService: jest.Mocked<AutocompleteService>;
  let mockFile: jest.Mocked<UploadedFile>;

  beforeEach(() => {
    // Reiniciar todos los mocks antes de cada prueba
    jest.clearAllMocks();
    
    // Crear mocks
    mockCandidateRepository = new CandidateRepository() as jest.Mocked<CandidateRepository>;
    mockEducationService = new EducationService() as jest.Mocked<EducationService>;
    mockWorkExperienceService = new WorkExperienceService() as jest.Mocked<WorkExperienceService>;
    mockAutocompleteService = new AutocompleteService() as jest.Mocked<AutocompleteService>;
    
    // Crear instancia del servicio con los mocks
    candidateService = new CandidateService();
    (candidateService as any).candidateRepository = mockCandidateRepository;
    (candidateService as any).educationService = mockEducationService;
    (candidateService as any).workExperienceService = mockWorkExperienceService;
    (candidateService as any).autocompleteService = mockAutocompleteService;
    
    // Mock de archivo
    mockFile = {
      name: 'cv_test.pdf',
      mimetype: 'application/pdf',
      size: 12345,
      mv: jest.fn().mockResolvedValue(undefined)
    } as unknown as jest.Mocked<UploadedFile>;
    
    // Mock de fs.existsSync
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    
    // Mock de path.join
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
  });

  describe('createCandidate', () => {
    it('debería crear un candidato con datos válidos', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '+34612345678',
        address: 'Calle Principal 123',
        cvUrl: '',
        cvFileName: ''
      };
      
      const expectedCandidate = {
        id: 1,
        ...candidateData,
        cvUrl: '/uploads/123456789_cv_test.pdf',
        cvFileName: 'cv_test.pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Mock de findByEmail para que devuelva null (no existe el email)
      mockCandidateRepository.findByEmail.mockResolvedValue(null);
      
      // Mock de create para que devuelva el candidato creado
      mockCandidateRepository.create.mockResolvedValue(expectedCandidate);
      
      // Act
      const result = await candidateService.createCandidate(candidateData, mockFile);
      
      // Assert
      expect(mockCandidateRepository.findByEmail).toHaveBeenCalledWith(candidateData.email);
      expect(mockFile.mv).toHaveBeenCalled();
      expect(mockCandidateRepository.create).toHaveBeenCalled();
      expect(result).toEqual(expectedCandidate);
    });

    it('debería validar campos obligatorios', async () => {
      // Arrange
      const invalidData = {
        firstName: 'Juan',
        // Sin lastName, email ni phone
        address: 'Calle Principal 123',
        cvUrl: '',
        cvFileName: ''
      };
      
      // Act & Assert
      await expect(candidateService.createCandidate(invalidData, mockFile))
        .rejects
        .toThrow(ValidationError);
      
      expect(mockCandidateRepository.create).not.toHaveBeenCalled();
    });

    it('debería validar formato de email', async () => {
      // Arrange
      const invalidData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@com', // Email inválido
        phone: '+34612345678',
        address: 'Calle Principal 123',
        cvUrl: '',
        cvFileName: ''
      };
      
      // Act & Assert
      await expect(candidateService.createCandidate(invalidData, mockFile))
        .rejects
        .toThrow(ValidationError);
      
      expect(mockCandidateRepository.create).not.toHaveBeenCalled();
    });

    it('debería verificar email duplicado', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '+34612345678',
        address: 'Calle Principal 123',
        cvUrl: '',
        cvFileName: ''
      };
      
      // Mock de findByEmail para que devuelva un candidato (email duplicado)
      mockCandidateRepository.findByEmail.mockResolvedValue({
        id: 2,
        ...candidateData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Act & Assert
      await expect(candidateService.createCandidate(candidateData, mockFile))
        .rejects
        .toThrow(ValidationError);
      
      expect(mockCandidateRepository.findByEmail).toHaveBeenCalledWith(candidateData.email);
      expect(mockCandidateRepository.create).not.toHaveBeenCalled();
    });

    it('debería requerir un archivo CV', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '+34612345678',
        address: 'Calle Principal 123',
        cvUrl: '',
        cvFileName: ''
      };
      
      // Mock de findByEmail para que devuelva null (no existe el email)
      mockCandidateRepository.findByEmail.mockResolvedValue(null);
      
      // Act & Assert
      await expect(candidateService.createCandidate(candidateData, undefined))
        .rejects
        .toThrow(ValidationError);
      
      expect(mockCandidateRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getAllCandidates', () => {
    it('debería obtener todos los candidatos', async () => {
      // Arrange
      const expectedCandidates = [
        {
          id: 1,
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          phone: '+34612345678',
          address: 'Calle Principal 123',
          cvUrl: '/uploads/123456789_cv_juan.pdf',
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
          cvUrl: '/uploads/987654321_cv_maria.pdf',
          cvFileName: 'cv_maria.pdf',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      // Mock de findAll para que devuelva los candidatos
      mockCandidateRepository.findAll.mockResolvedValue(expectedCandidates);
      
      // Act
      const result = await candidateService.getAllCandidates();
      
      // Assert
      expect(mockCandidateRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedCandidates);
    });
  });

  describe('getCandidateById', () => {
    it('debería obtener un candidato por ID', async () => {
      // Arrange
      const expectedCandidate = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '+34612345678',
        address: 'Calle Principal 123',
        cvUrl: '/uploads/123456789_cv_juan.pdf',
        cvFileName: 'cv_juan.pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Mock de findById para que devuelva el candidato
      mockCandidateRepository.findById.mockResolvedValue(expectedCandidate);
      
      // Act
      const result = await candidateService.getCandidateById(1);
      
      // Assert
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedCandidate);
    });

    it('debería devolver null si el candidato no existe', async () => {
      // Arrange
      // Mock de findById para que devuelva null
      mockCandidateRepository.findById.mockResolvedValue(null);
      
      // Act
      const result = await candidateService.getCandidateById(999);
      
      // Assert
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('updateCandidate', () => {
    it('debería actualizar un candidato con datos válidos', async () => {
      // Arrange
      const candidateId = 1;
      const updateData = {
        lastName: 'Pérez Actualizado',
        address: 'Calle Principal 123 Actualizada'
      };
      
      const existingCandidate = {
        id: candidateId,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '+34612345678',
        address: 'Calle Principal 123',
        cvUrl: '/uploads/123456789_cv_juan.pdf',
        cvFileName: 'cv_juan.pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const updatedCandidate = {
        ...existingCandidate,
        lastName: 'Pérez Actualizado',
        address: 'Calle Principal 123 Actualizada',
        updatedAt: new Date()
      };
      
      // Mock de findById para que devuelva el candidato existente
      mockCandidateRepository.findById.mockResolvedValue(existingCandidate);
      
      // Mock de update para que devuelva el candidato actualizado
      mockCandidateRepository.update.mockResolvedValue(updatedCandidate);
      
      // Act
      const result = await candidateService.updateCandidate(candidateId, updateData);
      
      // Assert
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(candidateId);
      expect(mockCandidateRepository.update).toHaveBeenCalledWith(candidateId, updateData);
      expect(result).toEqual(updatedCandidate);
    });

    it('debería devolver null si el candidato no existe', async () => {
      // Arrange
      const candidateId = 999;
      const updateData = {
        lastName: 'Pérez Actualizado'
      };
      
      // Mock de findById para que devuelva null
      mockCandidateRepository.findById.mockResolvedValue(null);
      
      // Act
      const result = await candidateService.updateCandidate(candidateId, updateData);
      
      // Assert
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(candidateId);
      expect(mockCandidateRepository.update).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('debería validar formato de email si se proporciona', async () => {
      // Arrange
      const candidateId = 1;
      const updateData = {
        email: 'juan.perez@com' // Email inválido
      };
      
      const existingCandidate = {
        id: candidateId,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '+34612345678',
        address: 'Calle Principal 123',
        cvUrl: '/uploads/123456789_cv_juan.pdf',
        cvFileName: 'cv_juan.pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Mock de findById para que devuelva el candidato existente
      mockCandidateRepository.findById.mockResolvedValue(existingCandidate);
      
      // Act & Assert
      await expect(candidateService.updateCandidate(candidateId, updateData))
        .rejects
        .toThrow(ValidationError);
      
      expect(mockCandidateRepository.update).not.toHaveBeenCalled();
    });

    it('debería verificar email duplicado si se proporciona', async () => {
      // Arrange
      const candidateId = 1;
      const updateData = {
        email: 'maria.garcia@example.com' // Email de otro candidato
      };
      
      const existingCandidate = {
        id: candidateId,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '+34612345678',
        address: 'Calle Principal 123',
        cvUrl: '/uploads/123456789_cv_juan.pdf',
        cvFileName: 'cv_juan.pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const duplicateCandidate = {
        id: 2,
        firstName: 'María',
        lastName: 'García',
        email: 'maria.garcia@example.com',
        phone: '+34612345679',
        address: 'Calle Secundaria 456',
        cvUrl: '/uploads/987654321_cv_maria.pdf',
        cvFileName: 'cv_maria.pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Mock de findById para que devuelva el candidato existente
      mockCandidateRepository.findById.mockResolvedValue(existingCandidate);
      
      // Mock de findByEmail para que devuelva otro candidato (email duplicado)
      mockCandidateRepository.findByEmail.mockResolvedValue(duplicateCandidate);
      
      // Act & Assert
      await expect(candidateService.updateCandidate(candidateId, updateData))
        .rejects
        .toThrow(ValidationError);
      
      expect(mockCandidateRepository.findByEmail).toHaveBeenCalledWith(updateData.email);
      expect(mockCandidateRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteCandidate', () => {
    it('debería eliminar un candidato', async () => {
      // Arrange
      const candidateId = 1;
      const existingCandidate = {
        id: candidateId,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '+34612345678',
        address: 'Calle Principal 123',
        cvUrl: '/uploads/123456789_cv_juan.pdf',
        cvFileName: 'cv_juan.pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Mock de findById para que devuelva el candidato existente
      mockCandidateRepository.findById.mockResolvedValue(existingCandidate);
      
      // Mock de delete para que devuelva el candidato eliminado
      mockCandidateRepository.delete.mockResolvedValue(existingCandidate);
      
      // Act
      const result = await candidateService.deleteCandidate(candidateId);
      
      // Assert
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(candidateId);
      expect(mockCandidateRepository.delete).toHaveBeenCalledWith(candidateId);
      expect(result).toEqual(existingCandidate);
    });

    it('debería lanzar error si el candidato no existe', async () => {
      // Arrange
      const candidateId = 999;
      
      // Mock de findById para que devuelva null
      mockCandidateRepository.findById.mockResolvedValue(null);
      
      // Act & Assert
      await expect(candidateService.deleteCandidate(candidateId))
        .rejects
        .toThrow('Candidato no encontrado');
      
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(candidateId);
      expect(mockCandidateRepository.delete).not.toHaveBeenCalled();
    });
  });
}); 