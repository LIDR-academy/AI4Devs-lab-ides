import { mockDeep, mockReset } from 'jest-mock-extended';
import { PrismaClient, Education } from '@prisma/client';
import { EducationService } from '../../services/educationService';
import { CreateEducationData } from '../../dtos/educationDto';
import '@types/jest';

// Mock de PrismaClient
jest.mock('../../config/database', () => {
  return {
    __esModule: true,
    default: mockDeep<PrismaClient>()
  };
});

// Importar el mock de prisma
import prisma from '../../config/database';
const mockPrisma = prisma as jest.Mocked<PrismaClient>;

describe('EducationService', () => {
  let educationService: EducationService;

  beforeEach(() => {
    // Reiniciar todos los mocks antes de cada prueba
    mockReset(mockPrisma);
    
    // Crear instancia del servicio
    educationService = new EducationService();
  });

  describe('createEducation', () => {
    it('debería crear un registro de educación con datos válidos', async () => {
      // Arrange
      const educationData: CreateEducationData = {
        candidateId: 1,
        institution: 'Universidad Complutense',
        degree: 'Ingeniería Informática',
        fieldOfStudy: 'Desarrollo de Software',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2022-06-30'),
        description: 'Estudios de ingeniería informática con especialización en desarrollo de software'
      };
      
      const expectedEducation = {
        id: 1,
        ...educationData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Mock de findUnique para que devuelva un candidato
      mockPrisma.candidate.findUnique.mockResolvedValue({
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
      });
      
      // Mock de create para que devuelva el registro de educación creado
      mockPrisma.education.create.mockResolvedValue(expectedEducation as unknown as Education);
      
      // Act
      const result = await educationService.createEducation(educationData);
      
      // Assert
      expect(mockPrisma.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: educationData.candidateId }
      });
      
      expect(mockPrisma.education.create).toHaveBeenCalledWith({
        data: {
          institution: educationData.institution,
          degree: educationData.degree,
          fieldOfStudy: educationData.fieldOfStudy,
          startDate: educationData.startDate,
          endDate: educationData.endDate,
          description: educationData.description,
          candidate: {
            connect: { id: educationData.candidateId }
          }
        }
      });
      
      expect(result).toEqual(expectedEducation);
    });

    it('debería lanzar error si el candidato no existe', async () => {
      // Arrange
      const educationData: CreateEducationData = {
        candidateId: 999, // ID que no existe
        institution: 'Universidad Complutense',
        degree: 'Ingeniería Informática',
        fieldOfStudy: 'Desarrollo de Software',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2022-06-30'),
        description: 'Estudios de ingeniería informática con especialización en desarrollo de software'
      };
      
      // Mock de findUnique para que devuelva null (candidato no existe)
      mockPrisma.candidate.findUnique.mockResolvedValue(null);
      
      // Act & Assert
      await expect(educationService.createEducation(educationData))
        .rejects
        .toThrow('Candidato no encontrado');
      
      expect(mockPrisma.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: educationData.candidateId }
      });
      
      expect(mockPrisma.education.create).not.toHaveBeenCalled();
    });
  });

  describe('getEducationById', () => {
    it('debería obtener un registro de educación por ID', async () => {
      // Arrange
      const educationId = 1;
      const expectedEducation = {
        id: educationId,
        candidateId: 1,
        institution: 'Universidad Complutense',
        degree: 'Ingeniería Informática',
        fieldOfStudy: 'Desarrollo de Software',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2022-06-30'),
        description: 'Estudios de ingeniería informática con especialización en desarrollo de software',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Mock de findUnique para que devuelva el registro de educación
      mockPrisma.education.findUnique.mockResolvedValue(expectedEducation as unknown as Education);
      
      // Act
      const result = await educationService.getEducationById(educationId);
      
      // Assert
      expect(mockPrisma.education.findUnique).toHaveBeenCalledWith({
        where: { id: educationId }
      });
      
      expect(result).toEqual(expectedEducation);
    });

    it('debería devolver null si el registro de educación no existe', async () => {
      // Arrange
      const educationId = 999; // ID que no existe
      
      // Mock de findUnique para que devuelva null
      mockPrisma.education.findUnique.mockResolvedValue(null);
      
      // Act
      const result = await educationService.getEducationById(educationId);
      
      // Assert
      expect(mockPrisma.education.findUnique).toHaveBeenCalledWith({
        where: { id: educationId }
      });
      
      expect(result).toBeNull();
    });
  });

  describe('updateEducation', () => {
    it('debería actualizar un registro de educación con datos válidos', async () => {
      // Arrange
      const educationId = 1;
      const updateData = {
        institution: 'Universidad Complutense de Madrid',
        description: 'Estudios de ingeniería informática con especialización en desarrollo de software y sistemas distribuidos'
      };
      
      const existingEducation = {
        id: educationId,
        candidateId: 1,
        institution: 'Universidad Complutense',
        degree: 'Ingeniería Informática',
        fieldOfStudy: 'Desarrollo de Software',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2022-06-30'),
        description: 'Estudios de ingeniería informática con especialización en desarrollo de software',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const updatedEducation = {
        ...existingEducation,
        institution: 'Universidad Complutense de Madrid',
        description: 'Estudios de ingeniería informática con especialización en desarrollo de software y sistemas distribuidos',
        updatedAt: new Date()
      };
      
      // Mock de findUnique para que devuelva el registro de educación existente
      mockPrisma.education.findUnique.mockResolvedValue(existingEducation as unknown as Education);
      
      // Mock de update para que devuelva el registro de educación actualizado
      mockPrisma.education.update.mockResolvedValue(updatedEducation as unknown as Education);
      
      // Act
      const result = await educationService.updateEducation(educationId, updateData);
      
      // Assert
      expect(mockPrisma.education.findUnique).toHaveBeenCalledWith({
        where: { id: educationId }
      });
      
      expect(mockPrisma.education.update).toHaveBeenCalledWith({
        where: { id: educationId },
        data: updateData
      });
      
      expect(result).toEqual(updatedEducation);
    });

    it('debería lanzar error si el registro de educación no existe', async () => {
      // Arrange
      const educationId = 999; // ID que no existe
      const updateData = {
        institution: 'Universidad Complutense de Madrid'
      };
      
      // Mock de findUnique para que devuelva null
      mockPrisma.education.findUnique.mockResolvedValue(null);
      
      // Act & Assert
      await expect(educationService.updateEducation(educationId, updateData))
        .rejects
        .toThrow('Registro de educación no encontrado');
      
      expect(mockPrisma.education.findUnique).toHaveBeenCalledWith({
        where: { id: educationId }
      });
      
      expect(mockPrisma.education.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteEducation', () => {
    it('debería eliminar un registro de educación', async () => {
      // Arrange
      const educationId = 1;
      const existingEducation = {
        id: educationId,
        candidateId: 1,
        institution: 'Universidad Complutense',
        degree: 'Ingeniería Informática',
        fieldOfStudy: 'Desarrollo de Software',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2022-06-30'),
        description: 'Estudios de ingeniería informática con especialización en desarrollo de software',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Mock de findUnique para que devuelva el registro de educación existente
      mockPrisma.education.findUnique.mockResolvedValue(existingEducation as unknown as Education);
      
      // Mock de delete para que devuelva el registro de educación eliminado
      mockPrisma.education.delete.mockResolvedValue(existingEducation as unknown as Education);
      
      // Act
      const result = await educationService.deleteEducation(educationId);
      
      // Assert
      expect(mockPrisma.education.findUnique).toHaveBeenCalledWith({
        where: { id: educationId }
      });
      
      expect(mockPrisma.education.delete).toHaveBeenCalledWith({
        where: { id: educationId }
      });
      
      expect(result).toEqual(existingEducation);
    });

    it('debería lanzar error si el registro de educación no existe', async () => {
      // Arrange
      const educationId = 999; // ID que no existe
      
      // Mock de findUnique para que devuelva null
      mockPrisma.education.findUnique.mockResolvedValue(null);
      
      // Act & Assert
      await expect(educationService.deleteEducation(educationId))
        .rejects
        .toThrow('Registro de educación no encontrado');
      
      expect(mockPrisma.education.findUnique).toHaveBeenCalledWith({
        where: { id: educationId }
      });
      
      expect(mockPrisma.education.delete).not.toHaveBeenCalled();
    });
  });

  describe('getEducationByCandidateId', () => {
    it('debería obtener todos los registros de educación de un candidato', async () => {
      // Arrange
      const candidateId = 1;
      const expectedEducation = [
        {
          id: 1,
          candidateId,
          institution: 'Universidad Complutense',
          degree: 'Ingeniería Informática',
          fieldOfStudy: 'Desarrollo de Software',
          startDate: new Date('2018-09-01'),
          endDate: new Date('2022-06-30'),
          description: 'Estudios de ingeniería informática con especialización en desarrollo de software',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          candidateId,
          institution: 'Instituto Tecnológico',
          degree: 'Técnico Superior',
          fieldOfStudy: 'Desarrollo de Aplicaciones Web',
          startDate: new Date('2016-09-01'),
          endDate: new Date('2018-06-30'),
          description: 'Formación técnica en desarrollo web',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      // Mock de findMany para que devuelva los registros de educación
      mockPrisma.education.findMany.mockResolvedValue(expectedEducation as unknown as Education[]);
      
      // Act
      const result = await educationService.getEducationByCandidateId(candidateId);
      
      // Assert
      expect(mockPrisma.education.findMany).toHaveBeenCalledWith({
        where: { candidateId },
        orderBy: { startDate: 'desc' }
      });
      
      expect(result).toEqual(expectedEducation);
    });

    it('debería devolver un array vacío si el candidato no tiene registros de educación', async () => {
      // Arrange
      const candidateId = 999; // ID que no tiene registros
      
      // Mock de findMany para que devuelva un array vacío
      mockPrisma.education.findMany.mockResolvedValue([]);
      
      // Act
      const result = await educationService.getEducationByCandidateId(candidateId);
      
      // Assert
      expect(mockPrisma.education.findMany).toHaveBeenCalledWith({
        where: { candidateId },
        orderBy: { startDate: 'desc' }
      });
      
      expect(result).toEqual([]);
    });
  });
}); 