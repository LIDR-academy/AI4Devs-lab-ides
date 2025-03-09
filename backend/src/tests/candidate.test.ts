import { Request, Response, NextFunction } from 'express';

jest.mock('../middleware/validationMiddleware', () => ({
  validateCandidate: (req: Request, res: Response, next: NextFunction) =>
    next(),
}));

jest.mock('../prisma', () => {
  return {
    __esModule: true,
    default: {
      candidate: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    },
  };
});

import { app } from '../index';
import path from 'path';
import fs from 'fs';
import request from 'supertest';

// Import the mocked prisma from the separate module
import prisma from '../prisma';
const mockCreate = prisma.candidate.create as jest.Mock;
const mockFindMany = prisma.candidate.findMany as jest.Mock;

// Helper to create a temporary file
const createTempFile = () => {
  const tempDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  const filePath = path.join(tempDir, 'test-resume.pdf');
  fs.writeFileSync(filePath, 'Test content');
  return filePath;
};

describe('Candidate API', () => {
  const mockCandidate = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    address: '123 Main St',
    resumeUrl: '/resumes/test-resume.pdf',
    createdAt: new Date(),
    updatedAt: new Date(),
    education: 'BS in Computer Science',
    experience: 'Software Engineer',
  };

  beforeEach(() => {
    mockCreate.mockReset();
    mockFindMany.mockReset();
  });

  describe('POST /api/candidates', () => {
    test('should create a new candidate', async () => {
      mockCreate.mockResolvedValue(mockCandidate);
      const tempFilePath = createTempFile();

      const response = await request(app)
        .post('/api/candidates')
        .field('firstName', 'John')
        .field('lastName', 'Doe')
        .field('email', 'john.doe@example.com')
        .field('phone', '+1234567890')
        .field('address', '123 Main St')
        .field('education', 'BS in Computer Science')
        .field('experience', 'Software Engineer')
        .attach('resume', tempFilePath);

      expect(mockCreate).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);

      fs.unlinkSync(tempFilePath);
    });
  });

  describe('GET /api/candidates', () => {
    test('should return all candidates', async () => {
      mockFindMany.mockResolvedValue([mockCandidate]);
      const response = await request(app).get('/api/candidates');

      expect(mockFindMany).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
