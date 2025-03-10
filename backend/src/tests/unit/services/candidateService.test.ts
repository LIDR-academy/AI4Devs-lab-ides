import { CandidateService } from '../../../features/candidates/services/candidateService';
import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../../../utils/AppError';
import { mockDeep, mockReset } from 'jest-mock-extended';

// Mock de paginationUtils
jest.mock('../../../utils/paginationUtils', () => ({
  createPaginatedResponse: jest.fn().mockReturnValue({
    data: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    }
  })
}));

// Mock de PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    candidate: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn()
    },
    user: {
      findUnique: jest.fn()
    },
    candidateSkill: {
      create: jest.fn(),
      deleteMany: jest.fn()
    },
    education: {
      create: jest.fn(),
      deleteMany: jest.fn()
    },
    workExperience: {
      create: jest.fn(),
      deleteMany: jest.fn()
    }
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    Prisma: {
      PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
        code: string;
        meta?: { target: string[] };
        clientVersion: string;
        
        constructor(message: string, { code, meta, clientVersion }: { code: string; meta?: { target: string[] }; clientVersion: string }) {
          super(message);
          this.name = 'PrismaClientKnownRequestError';
          this.code = code;
          this.meta = meta;
          this.clientVersion = clientVersion;
        }
      }
    }
  };
});

// Mock de transactionUtils
jest.mock('../../../utils/transactionUtils', () => ({
  withTransaction: jest.fn().mockImplementation((_, callback) => callback(_)),
}));

describe('CandidateService', () => {
  let candidateService: CandidateService;
  let prismaClientMock: any;

  beforeEach(() => {
    // Resetear todos los mocks antes de cada test
    jest.clearAllMocks();
    
    // Crear una nueva instancia del servicio para cada test
    candidateService = new CandidateService();
    
    // Obtener el mock de PrismaClient
    prismaClientMock = (candidateService as any).prisma;
  });

  describe('createCandidate', () => {
    it('debería crear un candidato correctamente', async () => {
      // Datos de prueba
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        recruiterId: 1,
        skills: [{ name: 'JavaScript', level: 'intermediate' }]
      };

      // Mock de respuestas de Prisma
      prismaClientMock.user.findUnique.mockResolvedValue({ id: 1, name: 'Recruiter' });
      prismaClientMock.candidate.create.mockResolvedValue({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        recruiterId: 1
      });
      prismaClientMock.candidate.findUnique.mockResolvedValue({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        recruiterId: 1,
        skills: [{ id: 1, name: 'JavaScript', candidateId: 1 }],
        education: [],
        experience: [],
        documents: []
      });
      prismaClientMock.candidateSkill.create.mockResolvedValue({
        id: 1,
        name: 'JavaScript',
        candidateId: 1
      });

      // Ejecutar la función a probar
      const result = await candidateService.createCandidate(candidateData);

      // Verificar que se llamaron los métodos correctos de Prisma
      expect(prismaClientMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(prismaClientMock.candidate.create).toHaveBeenCalled();
      expect(prismaClientMock.candidateSkill.create).toHaveBeenCalledWith({
        data: {
          name: 'JavaScript',
          candidateId: 1
        }
      });
      expect(prismaClientMock.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          education: true,
          experience: true,
          documents: true,
          skills: true,
        }
      });

      // Verificar el resultado
      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(201);
      expect(result.data).toBeDefined();
    });

    it('debería manejar el error cuando el reclutador no existe', async () => {
      // Datos de prueba
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        recruiterId: 999, // ID que no existe
        skills: [{ name: 'JavaScript', level: 'intermediate' }]
      };

      // Mock de respuestas de Prisma
      prismaClientMock.user.findUnique.mockResolvedValue(null); // El reclutador no existe

      // Ejecutar la función a probar
      const result = await candidateService.createCandidate(candidateData);

      // Verificar que se llamaron los métodos correctos de Prisma
      expect(prismaClientMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 999 }
      });
      expect(prismaClientMock.candidate.create).not.toHaveBeenCalled();

      // Verificar el resultado
      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(404);
      expect(result.error).toBe('Reclutador no encontrado');
    });

    it('debería manejar el error cuando el email ya existe', async () => {
      // Datos de prueba
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        phone: '123456789',
        recruiterId: 1,
        skills: [{ name: 'JavaScript', level: 'intermediate' }]
      };

      // Mock de respuestas de Prisma
      prismaClientMock.user.findUnique.mockResolvedValue({ id: 1, name: 'Recruiter' });
      
      // Crear un error de Prisma para simular un email duplicado
      const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint failed on the fields: (`email`)', {
        code: 'P2002',
        meta: { target: ['email'] },
        clientVersion: '5.0.0'
      });
      
      prismaClientMock.candidate.create.mockRejectedValue(prismaError);

      // Ejecutar la función a probar
      const result = await candidateService.createCandidate(candidateData);

      // Verificar que se llamaron los métodos correctos de Prisma
      expect(prismaClientMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(prismaClientMock.candidate.create).toHaveBeenCalled();

      // Verificar el resultado
      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(400);
      expect(result.error).toBe('Ya existe un candidato con ese email');
    });
  });

  describe('updateCandidate', () => {
    it('debería actualizar un candidato existente correctamente', async () => {
      // Datos de prueba
      const candidateId = 1;
      const updateData = {
        firstName: 'John Updated',
        lastName: 'Doe Updated',
        email: 'john.updated@example.com',
        skills: [{ name: 'JavaScript', level: 'advanced' as 'advanced' }, { name: 'TypeScript', level: 'intermediate' as 'intermediate' }]
      };

      // Mock de respuestas de Prisma
      prismaClientMock.candidate.findUnique.mockResolvedValueOnce({
        id: candidateId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      });
      
      // Mock para la transacción
      const mockTransaction = {
        candidate: {
          findUnique: jest.fn().mockResolvedValue({
            id: candidateId,
            firstName: 'John Updated',
            lastName: 'Doe Updated',
            email: 'john.updated@example.com',
            skills: [
              { id: 1, name: 'JavaScript', level: 'advanced', candidateId },
              { id: 2, name: 'TypeScript', level: 'intermediate', candidateId }
            ],
            education: [],
            experience: [],
            documents: []
          }),
          update: jest.fn().mockResolvedValue({
            id: candidateId,
            firstName: 'John Updated',
            lastName: 'Doe Updated',
            email: 'john.updated@example.com'
          })
        },
        candidateSkill: {
          deleteMany: jest.fn(),
          create: jest.fn()
        }
      };
      
      // Mock de withTransaction para usar nuestro mock de transacción
      const withTransactionMock = jest.requireMock('../../../utils/transactionUtils').withTransaction;
      withTransactionMock.mockImplementation((_: any, callback: any) => callback(mockTransaction));

      // Ejecutar la función a probar
      const result = await candidateService.updateCandidate(candidateId, updateData);

      // Verificar que se llamaron los métodos correctos de Prisma
      expect(prismaClientMock.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: candidateId }
      });
      
      // Verificar que se llamaron los métodos correctos en la transacción
      expect(mockTransaction.candidate.update).toHaveBeenCalled();
      expect(mockTransaction.candidateSkill.deleteMany).toHaveBeenCalledWith({
        where: { candidateId }
      });

      // Verificar el resultado
      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data).toBeDefined();
      expect(result.data.firstName).toBe('John Updated');
      expect(result.data.lastName).toBe('Doe Updated');
      expect(result.data.email).toBe('john.updated@example.com');
    });

    it('debería devolver error 404 si el candidato no existe', async () => {
      // Datos de prueba
      const candidateId = 999;
      const updateData = {
        firstName: 'John Updated',
        lastName: 'Doe Updated'
      };

      // Mock de respuestas de Prisma
      prismaClientMock.candidate.findUnique.mockResolvedValue(null);

      // Ejecutar la función a probar
      const result = await candidateService.updateCandidate(candidateId, updateData);

      // Verificar que se llamaron los métodos correctos de Prisma
      expect(prismaClientMock.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: candidateId }
      });
      
      expect(prismaClientMock.candidate.update).not.toHaveBeenCalled();

      // Verificar el resultado
      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(404);
      expect(result.error).toBe('Candidato no encontrado');
    });

    it('debería manejar errores de email duplicado', async () => {
      // Datos de prueba
      const candidateId = 1;
      const updateData = {
        firstName: 'John Updated',
        lastName: 'Doe Updated',
        email: 'existing@example.com',
        skills: [{ name: 'JavaScript', level: 'advanced' as 'advanced' }]
      };

      // Mock de respuestas de Prisma
      prismaClientMock.candidate.findUnique.mockResolvedValue({
        id: candidateId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      });
      
      // Crear un error de Prisma para simular un email duplicado
      const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint failed on the fields: (`email`)', {
        code: 'P2002',
        meta: { target: ['email'] },
        clientVersion: '5.0.0'
      });
      
      // Mock para la transacción
      const mockTransaction = {
        candidate: {
          update: jest.fn().mockRejectedValue(prismaError),
          findUnique: jest.fn()
        },
        candidateSkill: {
          deleteMany: jest.fn()
        }
      };
      
      // Mock de withTransaction para usar nuestro mock de transacción
      const withTransactionMock = jest.requireMock('../../../utils/transactionUtils').withTransaction;
      withTransactionMock.mockImplementation((_: any, callback: any) => callback(mockTransaction));

      // Ejecutar la función a probar
      const result = await candidateService.updateCandidate(candidateId, updateData);

      // Verificar que se llamaron los métodos correctos de Prisma
      expect(prismaClientMock.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: candidateId }
      });
      
      // Verificar que se llamaron los métodos correctos en la transacción
      expect(mockTransaction.candidate.update).toHaveBeenCalled();

      // Verificar el resultado
      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(500);
      expect(result.error).toBe('Error al actualizar el candidato');
    });

    it('debería manejar errores internos', async () => {
      // Datos de prueba
      const candidateId = 1;
      const updateData = {
        firstName: 'John Updated',
        lastName: 'Doe Updated',
        email: 'john.updated@example.com'
      };

      // Mock de respuestas de Prisma
      prismaClientMock.candidate.findUnique.mockResolvedValue({
        id: candidateId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      });
      
      // Mock para la transacción
      const mockTransaction = {
        candidate: {
          update: jest.fn().mockRejectedValue(new Error('Database error')),
          findUnique: jest.fn()
        },
        candidateSkill: {
          deleteMany: jest.fn()
        }
      };
      
      // Mock de withTransaction para usar nuestro mock de transacción
      const withTransactionMock = jest.requireMock('../../../utils/transactionUtils').withTransaction;
      withTransactionMock.mockImplementation((_: any, callback: any) => callback(mockTransaction));

      // Ejecutar la función a probar
      const result = await candidateService.updateCandidate(candidateId, updateData);

      // Verificar que se llamaron los métodos correctos de Prisma
      expect(prismaClientMock.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: candidateId }
      });
      
      // Verificar que se llamaron los métodos correctos en la transacción
      expect(mockTransaction.candidate.update).toHaveBeenCalled();

      // Verificar el resultado
      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(500);
      expect(result.error).toBe('Error al actualizar el candidato');
    });
  });

  describe('deleteCandidate', () => {
    it('debería eliminar un candidato existente y devolver éxito', async () => {
      // Datos de prueba
      const candidateId = 1;
      
      // Mock de respuestas de Prisma
      prismaClientMock.candidate.findUnique.mockResolvedValue({
        id: candidateId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      });
      
      // Mock para la transacción
      const mockTransaction = {
        candidate: {
          delete: jest.fn().mockResolvedValue({
            id: candidateId,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
          })
        }
      };
      
      // Mock de withTransaction para usar nuestro mock de transacción
      const withTransactionMock = jest.requireMock('../../../utils/transactionUtils').withTransaction;
      withTransactionMock.mockImplementation((_: any, callback: any) => callback(mockTransaction));

      // Ejecutar la función a probar
      const result = await candidateService.deleteCandidate(candidateId);

      // Verificar que se llamaron los métodos correctos de Prisma
      expect(prismaClientMock.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: candidateId }
      });
      
      // Verificar que se llamaron los métodos correctos en la transacción
      expect(mockTransaction.candidate.delete).toHaveBeenCalledWith({
        where: { id: candidateId }
      });

      // Verificar el resultado
      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data).toBeNull();
    });

    it('debería devolver error 404 si el candidato no existe', async () => {
      // Mock de respuestas de Prisma
      prismaClientMock.candidate.findUnique.mockResolvedValue(null);

      // Ejecutar la función a probar
      const result = await candidateService.deleteCandidate(999);

      // Verificar que se llamaron los métodos correctos de Prisma
      expect(prismaClientMock.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 999 }
      });
      expect(prismaClientMock.candidate.delete).not.toHaveBeenCalled();

      // Verificar el resultado
      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(404);
      expect(result.error).toBe('Candidato no encontrado');
    });

    it('debería manejar errores de base de datos y devolver error 500', async () => {
      // Mock de respuestas de Prisma
      prismaClientMock.candidate.findUnique.mockResolvedValue({ id: 1, name: 'Test Candidate' });
      
      // Mock para la transacción
      const mockTransaction = {
        candidate: {
          delete: jest.fn().mockRejectedValue(new Error('Database error'))
        }
      };
      
      // Mock de withTransaction para usar nuestro mock de transacción
      const withTransactionMock = jest.requireMock('../../../utils/transactionUtils').withTransaction;
      withTransactionMock.mockImplementation((_: any, callback: any) => callback(mockTransaction));

      // Ejecutar la función a probar
      const result = await candidateService.deleteCandidate(1);

      // Verificar que se llamaron los métodos correctos de Prisma
      expect(prismaClientMock.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      
      // Verificar que se llamaron los métodos correctos en la transacción
      expect(mockTransaction.candidate.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });

      // Verificar el resultado
      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(500);
      expect(result.error).toBe('Error al eliminar el candidato');
    });
  });

  describe('getCandidateById', () => {
    it('debería obtener un candidato por ID correctamente', async () => {
      // Mock de respuesta de Prisma
      const mockCandidate = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        recruiterId: 1,
        skills: [
          { id: 1, name: 'JavaScript', candidateId: 1 },
          { id: 2, name: 'React', candidateId: 1 }
        ],
        education: [
          { id: 1, institution: 'University', degree: 'Computer Science', candidateId: 1 }
        ],
        experience: [
          { id: 1, company: 'Tech Co', position: 'Developer', candidateId: 1 }
        ],
        documents: []
      };

      prismaClientMock.candidate.findUnique.mockResolvedValue(mockCandidate);

      // Llamar al método
      const result = await candidateService.getCandidateById(1);

      // Verificar que se llamó al método de Prisma correctamente
      expect(prismaClientMock.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          education: true,
          experience: true,
          documents: true,
          skills: true,
        }
      });

      // Verificar el resultado
      expect(result).toEqual({
        success: true,
        statusCode: 200,
        data: {
          ...mockCandidate,
          skills: ['JavaScript', 'React']
        }
      });
    });

    it('debería devolver un error si el candidato no existe', async () => {
      // Mock de respuesta de Prisma (candidato no encontrado)
      prismaClientMock.candidate.findUnique.mockResolvedValue(null);

      // Llamar al método
      const result = await candidateService.getCandidateById(999);

      // Verificar que se llamó al método de Prisma correctamente
      expect(prismaClientMock.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
        include: {
          education: true,
          experience: true,
          documents: true,
          skills: true,
        }
      });

      // Verificar el resultado
      expect(result).toEqual({
        success: false,
        statusCode: 404,
        error: 'Candidato no encontrado'
      });
    });

    it('debería manejar errores internos', async () => {
      // Mock de error de Prisma
      prismaClientMock.candidate.findUnique.mockRejectedValue(new Error('Database error'));

      // Llamar al método
      const result = await candidateService.getCandidateById(1);

      // Verificar que se llamó al método de Prisma correctamente
      expect(prismaClientMock.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          education: true,
          experience: true,
          documents: true,
          skills: true,
        }
      });

      // Verificar el resultado
      expect(result).toEqual({
        success: false,
        statusCode: 500,
        error: 'Error al obtener el candidato'
      });
    });
  });

  describe('getAllCandidates', () => {
    beforeEach(() => {
      // Importar el módulo real después del mock
      const { createPaginatedResponse } = require('../../../utils/paginationUtils');
      (createPaginatedResponse as jest.Mock).mockClear();
      (createPaginatedResponse as jest.Mock).mockReturnValue({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        }
      });
    });

    it('debería obtener todos los candidatos sin filtros', async () => {
      // Mock de datos
      const mockCandidates = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '123456789',
          status: 'active',
          recruiterId: 1
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '987654321',
          status: 'active',
          recruiterId: 1
        }
      ];

      // Mock de respuestas de Prisma
      prismaClientMock.candidate.findMany.mockResolvedValue(mockCandidates);
      prismaClientMock.candidate.count.mockResolvedValue(2);

      // Parámetros de búsqueda y paginación
      const searchParams = {};
      const pagination = { page: 1, limit: 10, skip: 0 };

      // Llamar al método
      const result = await candidateService.getAllCandidates(searchParams, pagination);

      // Verificar que se llamaron los métodos de Prisma correctamente
      expect(prismaClientMock.candidate.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          education: true,
          experience: true,
          documents: true,
        }
      });

      expect(prismaClientMock.candidate.count).toHaveBeenCalledWith({ where: {} });

      // Verificar el resultado
      expect(result).toEqual({
        success: true,
        statusCode: 200,
        data: {
          data: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          }
        }
      });
    });

    it('debería filtrar candidatos por query', async () => {
      // Mock de datos
      const mockCandidates = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '123456789',
          status: 'active',
          recruiterId: 1
        }
      ];

      // Mock de respuestas de Prisma
      prismaClientMock.candidate.findMany.mockResolvedValue(mockCandidates);
      prismaClientMock.candidate.count.mockResolvedValue(1);

      // Parámetros de búsqueda y paginación
      const searchParams = { query: 'john' };
      const pagination = { page: 1, limit: 10, skip: 0 };

      // Llamar al método
      const result = await candidateService.getAllCandidates(searchParams, pagination);

      // Verificar que se llamaron los métodos de Prisma correctamente
      expect(prismaClientMock.candidate.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { firstName: { contains: 'john', mode: 'insensitive' } },
            { lastName: { contains: 'john', mode: 'insensitive' } },
            { email: { contains: 'john', mode: 'insensitive' } },
          ]
        },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          education: true,
          experience: true,
          documents: true,
        }
      });

      // Verificar el resultado
      expect(result).toEqual({
        success: true,
        statusCode: 200,
        data: {
          data: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          }
        }
      });
    });

    it('debería filtrar candidatos por status', async () => {
      // Mock de datos
      const mockCandidates = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '123456789',
          status: 'active',
          recruiterId: 1
        }
      ];

      // Mock de respuestas de Prisma
      prismaClientMock.candidate.findMany.mockResolvedValue(mockCandidates);
      prismaClientMock.candidate.count.mockResolvedValue(1);

      // Parámetros de búsqueda y paginación
      const searchParams = { status: 'active' };
      const pagination = { page: 1, limit: 10, skip: 0 };

      // Llamar al método
      const result = await candidateService.getAllCandidates(searchParams, pagination);

      // Verificar que se llamaron los métodos de Prisma correctamente
      expect(prismaClientMock.candidate.findMany).toHaveBeenCalledWith({
        where: { status: 'active' },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          education: true,
          experience: true,
          documents: true,
        }
      });

      // Verificar el resultado
      expect(result).toEqual({
        success: true,
        statusCode: 200,
        data: {
          data: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          }
        }
      });
    });

    it('debería ordenar candidatos según los parámetros', async () => {
      // Mock de datos
      const mockCandidates = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '123456789',
          status: 'active',
          recruiterId: 1
        }
      ];

      // Mock de respuestas de Prisma
      prismaClientMock.candidate.findMany.mockResolvedValue(mockCandidates);
      prismaClientMock.candidate.count.mockResolvedValue(1);

      // Parámetros de búsqueda y paginación
      const searchParams = { sortBy: 'firstName', sortOrder: 'asc' };
      const pagination = { page: 1, limit: 10, skip: 0 };

      // Llamar al método
      const result = await candidateService.getAllCandidates(searchParams, pagination);

      // Verificar que se llamaron los métodos de Prisma correctamente
      expect(prismaClientMock.candidate.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { firstName: 'asc' },
        include: {
          education: true,
          experience: true,
          documents: true,
        }
      });

      // Verificar el resultado
      expect(result).toEqual({
        success: true,
        statusCode: 200,
        data: {
          data: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          }
        }
      });
    });

    it('debería manejar errores internos', async () => {
      // Mock de error de Prisma
      prismaClientMock.candidate.findMany.mockRejectedValue(new Error('Database error'));

      // Parámetros de búsqueda y paginación
      const searchParams = {};
      const pagination = { page: 1, limit: 10, skip: 0 };

      // Llamar al método
      const result = await candidateService.getAllCandidates(searchParams, pagination);

      // Verificar el resultado
      expect(result).toEqual({
        success: false,
        statusCode: 500,
        error: 'Error al obtener los candidatos'
      });
    });

    it('debería manejar errores de tipo AppError', async () => {
      // Mock de error de tipo AppError
      const appError = new AppError('Error personalizado', 400);
      prismaClientMock.candidate.findMany.mockRejectedValue(appError);

      // Parámetros de búsqueda y paginación
      const searchParams = {};
      const pagination = { page: 1, limit: 10, skip: 0 };

      // Llamar al método
      const result = await candidateService.getAllCandidates(searchParams, pagination);

      // Verificar el resultado
      expect(result).toEqual({
        success: false,
        statusCode: 400,
        error: 'Error personalizado'
      });
    });
  });
}); 