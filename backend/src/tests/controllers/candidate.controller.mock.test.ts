import { Request, Response } from 'express';
import { createCandidate, getCandidates } from '../../controllers/candidate.controller';
import prisma from '../prisma.mock';
import { describe, it, expect, jest } from '@jest/globals';

// Import types to ensure Prisma models are recognized
import '../../types';

// Mock Express response
const mockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  } as unknown as Response;
  return res;
};

describe('Candidate Controller', () => {
  // Sample data
  const sampleCandidate = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    address: '123 Main St',
    linkedinProfile: 'https://linkedin.com/in/johndoe',
    desiredSalary: '80000',
    skills: ['JavaScript', 'TypeScript', 'Node.js']
  };

  const mockCreatedCandidate = {
    id: 1,
    ...sampleCandidate,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  };

  describe('createCandidate', () => {
    it('should create a candidate and return 201 status', async () => {
      // Arrange
      const req = {
        body: sampleCandidate
      } as Request;
      const res = mockResponse();

      // Mock the Prisma client methods
      prisma.candidate.findUnique.mockResolvedValueOnce(null);
      prisma.candidate.create.mockResolvedValueOnce(mockCreatedCandidate);

      // Act
      await createCandidate(req, res);

      // Assert
      expect(prisma.candidate.findUnique).toHaveBeenCalledWith({
        where: { email: sampleCandidate.email }
      });
      expect(prisma.candidate.create).toHaveBeenCalledWith(expect.anything());
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockCreatedCandidate
        })
      );
    });

    it('should return 409 when trying to create a candidate with existing email', async () => {
      // Arrange
      const req = {
        body: sampleCandidate
      } as Request;
      const res = mockResponse();

      // Mock the Prisma client methods
      prisma.candidate.findUnique.mockResolvedValueOnce(mockCreatedCandidate);

      // Act
      await createCandidate(req, res);

      // Assert
      expect(prisma.candidate.findUnique).toHaveBeenCalledWith({
        where: { email: sampleCandidate.email }
      });
      expect(prisma.candidate.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.any(String)
        })
      );
    });
  });

  describe('getCandidates', () => {
    it('should get all candidates and return 200 status', async () => {
      // Arrange
      const req = {} as Request;
      const res = mockResponse();

      // Mock the Prisma client method
      prisma.candidate.findMany.mockResolvedValueOnce([mockCreatedCandidate]);

      // Act
      await getCandidates(req, res);

      // Assert
      expect(prisma.candidate.findMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: [mockCreatedCandidate]
        })
      );
    });
  });
});