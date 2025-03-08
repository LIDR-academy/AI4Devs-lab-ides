import { PrismaClient } from '@prisma/client';
import { Candidate, Status } from '../../domain/candidate';
import { CandidateRepository } from '../../infrastructure/candidate';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    candidate: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

describe('CandidateRepository', () => {
  let prisma: PrismaClient;
  let candidateRepository: CandidateRepository;

  beforeEach(() => {
    prisma = new PrismaClient();
    candidateRepository = new CandidateRepository(prisma);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all candidates', async () => {
      // Arrange
      const mockPrismaCandidates = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: null,
          address: '123 Main St',
          education: "Bachelor's Degree",
          experience: '5 years',
          cvFilePath: '/uploads/cv-1.pdf',
          status: 'PENDING',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          phone: '+1234567890',
          address: '456 Oak Ave',
          education: "Master's Degree",
          experience: '3 years',
          cvFilePath: '/uploads/cv-2.pdf',
          status: 'VALUATED',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prisma.candidate.findMany as jest.Mock).mockResolvedValue(
        mockPrismaCandidates,
      );

      // Act
      const result = await candidateRepository.findAll();

      // Assert
      expect(prisma.candidate.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Candidate);
      expect(result[0].id).toBe(1);
      expect(result[0].firstName).toBe('John');
      expect(result[0].status).toBe(Status.PENDING);
      expect(result[1]).toBeInstanceOf(Candidate);
      expect(result[1].id).toBe(2);
      expect(result[1].firstName).toBe('Jane');
      expect(result[1].status).toBe(Status.VALUATED);
    });
  });

  describe('findById', () => {
    it('should return a candidate by ID', async () => {
      // Arrange
      const mockPrismaCandidate = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: null,
        address: '123 Main St',
        education: "Bachelor's Degree",
        experience: '5 years',
        cvFilePath: '/uploads/cv-1.pdf',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.candidate.findUnique as jest.Mock).mockResolvedValue(
        mockPrismaCandidate,
      );

      // Act
      const result = await candidateRepository.findById(1);

      // Assert
      expect(prisma.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBeInstanceOf(Candidate);
      expect(result?.id).toBe(1);
      expect(result?.firstName).toBe('John');
      expect(result?.status).toBe(Status.PENDING);
    });

    it('should return null if candidate not found', async () => {
      // Arrange
      (prisma.candidate.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await candidateRepository.findById(999);

      // Assert
      expect(prisma.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new candidate', async () => {
      // Arrange
      const newCandidateData = {
        firstName: 'New',
        lastName: 'User',
        email: 'new@example.com',
        address: '789 Pine St',
        education: 'PhD',
        experience: '10 years',
        status: Status.PENDING,
      };

      const mockCreatedCandidate = {
        id: 3,
        ...newCandidateData,
        phone: null,
        cvFilePath: null,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.candidate.create as jest.Mock).mockResolvedValue(
        mockCreatedCandidate,
      );

      // Act
      const result = await candidateRepository.create(newCandidateData);

      // Assert
      expect(prisma.candidate.create).toHaveBeenCalledWith({
        data: expect.objectContaining(newCandidateData),
      });
      expect(result).toBeInstanceOf(Candidate);
      expect(result.id).toBe(3);
      expect(result.firstName).toBe('New');
      expect(result.lastName).toBe('User');
      expect(result.status).toBe(Status.PENDING);
    });
  });

  describe('update', () => {
    it('should update an existing candidate', async () => {
      // Arrange
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        status: Status.VALUATED,
      };

      const mockUpdatedCandidate = {
        id: 1,
        firstName: 'Updated',
        lastName: 'Name',
        email: 'john@example.com',
        phone: null,
        address: '123 Main St',
        education: "Bachelor's Degree",
        experience: '5 years',
        cvFilePath: '/uploads/cv-1.pdf',
        status: 'VALUATED',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.candidate.update as jest.Mock).mockResolvedValue(
        mockUpdatedCandidate,
      );

      // Act
      const result = await candidateRepository.update(1, updateData);

      // Assert
      expect(prisma.candidate.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          firstName: 'Updated',
          lastName: 'Name',
          status: 'VALUATED',
        }),
      });
      expect(result).toBeInstanceOf(Candidate);
      expect(result.id).toBe(1);
      expect(result.firstName).toBe('Updated');
      expect(result.lastName).toBe('Name');
      expect(result.status).toBe(Status.VALUATED);
    });
  });

  describe('delete', () => {
    it('should delete a candidate by ID', async () => {
      // Arrange
      (prisma.candidate.delete as jest.Mock).mockResolvedValue(undefined);

      // Act
      await candidateRepository.delete(1);

      // Assert
      expect(prisma.candidate.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('getStatistics', () => {
    it('should return candidate statistics', async () => {
      // Arrange
      (prisma.candidate.count as jest.Mock).mockImplementation((params) => {
        if (!params) return 10; // total
        if (params.where.status === 'PENDING') return 5; // pending
        if (params.where.status === 'VALUATED') return 3; // valuated
        if (params.where.status === 'DISCARDED') return 2; // discarded
        return 0;
      });

      // Act
      const result = await candidateRepository.getStatistics();

      // Assert
      expect(prisma.candidate.count).toHaveBeenCalledTimes(4);
      expect(result).toEqual({
        total: 10,
        pending: 5,
        valuated: 3,
        discarded: 2,
      });
    });
  });

  describe('findEducationValues', () => {
    it('should return distinct education values', async () => {
      // Arrange
      const mockEducationValues = [
        { education: "Bachelor's Degree" },
        { education: "Master's Degree" },
        { education: 'PhD' },
      ];

      (prisma.candidate.findMany as jest.Mock).mockResolvedValue(
        mockEducationValues,
      );

      // Act
      const result = await candidateRepository.findEducationValues();

      // Assert
      expect(prisma.candidate.findMany).toHaveBeenCalledWith({
        select: { education: true },
        distinct: ['education'],
      });
      expect(result).toEqual(["Bachelor's Degree", "Master's Degree", 'PhD']);
    });
  });

  describe('findExperienceValues', () => {
    it('should return distinct experience values', async () => {
      // Arrange
      const mockExperienceValues = [
        { experience: '1 year' },
        { experience: '3 years' },
        { experience: '5 years' },
      ];

      (prisma.candidate.findMany as jest.Mock).mockResolvedValue(
        mockExperienceValues,
      );

      // Act
      const result = await candidateRepository.findExperienceValues();

      // Assert
      expect(prisma.candidate.findMany).toHaveBeenCalledWith({
        select: { experience: true },
        distinct: ['experience'],
      });
      expect(result).toEqual(['1 year', '3 years', '5 years']);
    });
  });
});
