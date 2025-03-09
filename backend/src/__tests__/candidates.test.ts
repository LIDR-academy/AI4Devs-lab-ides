import request from 'supertest';
import { app } from '../app';
import { prisma } from './setup';

beforeEach(async () => {
  await prisma.candidate.deleteMany();
});

afterAll(async () => {
  await prisma.candidate.deleteMany();
  await prisma.$disconnect();
});

describe('POST /api/candidates', () => {
  it('should create a new candidate with valid data', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1234567890',
      currentLocation: 'New York, USA',
      yearsExperience: 5,
      educationLevel: 'Bachelor\'s'
    };

    const response = await request(app)
      .post('/api/candidates')
      .send(candidateData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.firstName).toBe(candidateData.firstName);
    expect(response.body.email).toBe(candidateData.email);
  });

  it('should persist the candidate in the database', async () => {
    const candidateData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '+1987654321',
      currentLocation: 'London, UK',
      yearsExperience: 3,
      educationLevel: 'Master\'s'
    };

    const response = await request(app)
      .post('/api/candidates')
      .send(candidateData);

    // Verify the response
    expect(response.status).toBe(201);
    
    // Verify database persistence
    const savedCandidate = await prisma.candidate.findUnique({
      where: { id: response.body.id }
    });
    
    expect(savedCandidate).not.toBeNull();
    expect(savedCandidate?.email).toBe(candidateData.email);
    expect(savedCandidate?.firstName).toBe(candidateData.firstName);
  });

  it('should not allow duplicate emails', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.duplicate@example.com',
      phoneNumber: '+1234567890',
      currentLocation: 'Paris, FR',
      yearsExperience: 5,
      educationLevel: 'Bachelor\'s'
    };

    // Create first candidate
    await request(app)
      .post('/api/candidates')
      .send(candidateData);

    // Try to create second candidate with same email
    const response = await request(app)
      .post('/api/candidates')
      .send(candidateData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toMatch(/email.*already exists/i);
  });

  it('should validate required fields', async () => {
    const invalidData = {
      firstName: '',
      lastName: 'Doe',
      email: 'invalid-email',
      phoneNumber: '123', // invalid format
      currentLocation: '',
      yearsExperience: -1, // invalid negative number
      educationLevel: 'Invalid Degree'
    };

    const response = await request(app)
      .post('/api/candidates')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'firstName', message: expect.any(String) }),
        expect.objectContaining({ field: 'email', message: expect.any(String) }),
        expect.objectContaining({ field: 'phoneNumber', message: expect.any(String) }),
        expect.objectContaining({ field: 'currentLocation', message: expect.any(String) }),
        expect.objectContaining({ field: 'yearsExperience', message: expect.any(String) }),
        expect.objectContaining({ field: 'educationLevel', message: expect.any(String) })
      ])
    );
  });
});
