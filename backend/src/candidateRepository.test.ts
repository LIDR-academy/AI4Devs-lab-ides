import { PrismaClient } from '@prisma/client';
import { createCandidate } from './candidateRepository';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Connect to the test database
  await prisma.$connect();
});

afterAll(async () => {
  // Disconnect from the test database
  await prisma.$disconnect();
});

describe('Candidate Model', () => {
  it('should create a new candidate', async () => {
    const candidateData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
      education: {},
      work_experience: {},
      cv_url: 'http://example.com/cv.pdf',
    };

    const candidate = await createCandidate(candidateData);

    expect(candidate).toHaveProperty('id');
    expect(candidate.first_name).toBe('John');
    expect(candidate.email).toBe('john.doe@example.com');
  });

  // Add more tests for other CRUD operations
});