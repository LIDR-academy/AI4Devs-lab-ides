import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import { beforeEach, describe, it, expect } from '@jest/globals';

// Import types to ensure Prisma models are recognized
import '../../types';

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
const prismaMock = mockDeep<PrismaClient>() as MockPrismaClient;

// Add properties for Prisma models
prismaMock.candidate = mockDeep();
prismaMock.Candidate = mockDeep();
prismaMock.candidateDocument = mockDeep();
prismaMock.CandidateDocument = mockDeep();
prismaMock.skill = mockDeep();
prismaMock.user = mockDeep();
prismaMock.language = mockDeep();
prismaMock.workExperience = mockDeep();
prismaMock.education = mockDeep();
prismaMock.document = mockDeep();

// Reset all mocks before each test
beforeEach(() => {
  mockReset(prismaMock);
});

// Add a dummy test to avoid the "Your test suite must contain at least one test" error
describe('PrismaMock', () => {
  it('should be defined', () => {
    expect(prismaMock).toBeDefined();
  });
});

export default prismaMock;