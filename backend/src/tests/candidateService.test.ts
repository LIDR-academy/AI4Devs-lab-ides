import { candidateService } from '../services/candidateService';
import prisma from '../index';
import { CandidateCreateInput } from '../types/candidate';

// Mock de Prisma
jest.mock('../index', () => ({
  $queryRaw: jest.fn(),
  $executeRaw: jest.fn(),
}));

describe('Candidate Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCandidate', () => {
    it('debería crear un candidato correctamente', async () => {
      // Configurar el mock para que no encuentre un candidato existente
      (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([]);
      
      // Configurar el mock para la inserción
      (prisma.$executeRaw as jest.Mock).mockResolvedValueOnce(1);
      
      // Configurar el mock para que devuelva un candidato creado
      const mockCandidate = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '666777888',
        address: 'Calle Falsa 123',
        education: [{ institution: 'Universidad', degree: 'Ingeniería', fieldOfStudy: 'Informática', startDate: '2015-01-01', endDate: '2020-01-01' }],
        experience: [{ company: 'Empresa', position: 'Desarrollador', startDate: '2020-01-01', endDate: '2023-01-01' }],
        cvPath: '/uploads/cv-123.pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([mockCandidate]);
      
      // Datos de entrada
      const candidateData: CandidateCreateInput = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '666777888',
        address: 'Calle Falsa 123',
        education: [{ institution: 'Universidad', degree: 'Ingeniería', fieldOfStudy: 'Informática', startDate: '2015-01-01', endDate: '2020-01-01' }],
        experience: [{ company: 'Empresa', position: 'Desarrollador', startDate: '2020-01-01', endDate: '2023-01-01' }],
        cv: { path: '/uploads/cv-123.pdf' } as Express.Multer.File
      };
      
      // Ejecutar el servicio
      const result = await candidateService.createCandidate(candidateData);
      
      // Verificar que se llamó a los métodos correctos
      expect(prisma.$queryRaw).toHaveBeenCalledTimes(2);
      expect(prisma.$executeRaw).toHaveBeenCalledTimes(1);
      
      // Verificar el resultado
      expect(result).toEqual(mockCandidate);
    });

    it('debería lanzar un error si el candidato ya existe', async () => {
      // Configurar el mock para que encuentre un candidato existente
      (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([{
        id: 1,
        email: 'juan@example.com'
      }]);
      
      // Datos de entrada
      const candidateData: CandidateCreateInput = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '666777888',
        address: 'Calle Falsa 123',
        education: [{ institution: 'Universidad', degree: 'Ingeniería', fieldOfStudy: 'Informática', startDate: '2015-01-01', endDate: '2020-01-01' }],
        experience: [{ company: 'Empresa', position: 'Desarrollador', startDate: '2020-01-01', endDate: '2023-01-01' }],
      };
      
      // Ejecutar el servicio y verificar que lanza un error
      await expect(candidateService.createCandidate(candidateData)).rejects.toThrow('Ya existe un candidato con este correo electrónico');
      
      // Verificar que se llamó a queryRaw pero no a executeRaw
      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
      expect(prisma.$executeRaw).not.toHaveBeenCalled();
    });
  });

  describe('getCandidates', () => {
    it('debería obtener todos los candidatos', async () => {
      // Configurar el mock para que devuelva una lista de candidatos
      const mockCandidates = [
        {
          id: 1,
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com',
          phone: '666777888',
          address: 'Calle Falsa 123',
          education: [{ institution: 'Universidad', degree: 'Ingeniería', fieldOfStudy: 'Informática', startDate: '2015-01-01', endDate: '2020-01-01' }],
          experience: [{ company: 'Empresa', position: 'Desarrollador', startDate: '2020-01-01', endDate: '2023-01-01' }],
          cvPath: '/uploads/cv-123.pdf',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce(mockCandidates);
      
      // Ejecutar el servicio
      const result = await candidateService.getCandidates();
      
      // Verificar que se llamó al método correcto
      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
      
      // Verificar el resultado
      expect(result).toEqual(mockCandidates);
    });
  });

  describe('getCandidateById', () => {
    it('debería obtener un candidato por ID', async () => {
      // Configurar el mock para que devuelva un candidato
      const mockCandidate = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '666777888',
        address: 'Calle Falsa 123',
        education: [{ institution: 'Universidad', degree: 'Ingeniería', fieldOfStudy: 'Informática', startDate: '2015-01-01', endDate: '2020-01-01' }],
        experience: [{ company: 'Empresa', position: 'Desarrollador', startDate: '2020-01-01', endDate: '2023-01-01' }],
        cvPath: '/uploads/cv-123.pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([mockCandidate]);
      
      // Ejecutar el servicio
      const result = await candidateService.getCandidateById(1);
      
      // Verificar que se llamó al método correcto
      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
      
      // Verificar el resultado
      expect(result).toEqual(mockCandidate);
    });

    it('debería lanzar un error si el candidato no existe', async () => {
      // Configurar el mock para que no encuentre un candidato
      (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([]);
      
      // Ejecutar el servicio y verificar que lanza un error
      await expect(candidateService.getCandidateById(999)).rejects.toThrow('Candidato no encontrado');
      
      // Verificar que se llamó al método correcto
      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
    });
  });
}); 