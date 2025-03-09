import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import { beforeEach, describe, it, expect } from '@jest/globals';

// Import types to ensure Prisma models are recognized
import '../types';

// Create a mock Prisma client with proper typing
export type MockPrismaClient = DeepMockProxy<PrismaClient> & {
  candidate: any;
  Candidate: any;
  candidateDocument: any;
  CandidateDocument: any;
  skill: any;
  user: any;
  language: any;
  workExperience: any;
  education: any;
  document: any;
};

// Create deep mock of the Prisma client
const prisma = mockDeep<PrismaClient>() as MockPrismaClient;

// Add properties for Prisma models
prisma.candidate = mockDeep();
prisma.Candidate = mockDeep();
prisma.candidateDocument = mockDeep();
prisma.CandidateDocument = mockDeep();
prisma.skill = mockDeep();
prisma.user = mockDeep();
prisma.language = mockDeep();
prisma.workExperience = mockDeep();
prisma.education = mockDeep();
prisma.document = mockDeep();

// Reset all mocks before each test
beforeEach(() => {
  mockReset(prisma);
});

// Add a dummy test to avoid the "Your test suite must contain at least one test" error
describe('PrismaMock', () => {
  it('should be defined', () => {
    expect(prisma).toBeDefined();
  });
});

export default prisma;