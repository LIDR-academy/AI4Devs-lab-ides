import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';
import { createTestUser, createTestCandidate, cleanupDatabase } from '../../testUtils';

describe('Skills Search API', () => {
  let prisma: PrismaClient;
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    prisma = new PrismaClient();
    
    // Create test user and get auth token
    const userData = await createTestUser();
    userId = userData.userId;
    authToken = userData.token;
    
    // Create test candidates with skills
    await createTestCandidate({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
      recruiterId: userId,
      skills: [
        { name: 'JavaScript' },
        { name: 'React' },
        { name: 'Node.js' }
      ]
    });
    
    await createTestCandidate({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '987654321',
      recruiterId: userId,
      skills: [
        { name: 'JavaScript' }, // Duplicate skill
        { name: 'Java' },
        { name: 'Spring Boot' }
      ]
    });
    
    await createTestCandidate({
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      phone: '555555555',
      recruiterId: userId,
      skills: [
        { name: 'JavaScript' }, // Another duplicate
        { name: 'Java' }, // Another duplicate
        { name: 'Python' }
      ]
    });
  });

  afterAll(async () => {
    await cleanupDatabase();
    await prisma.$disconnect();
  });

  it('should return unique skills matching the query', async () => {
    const response = await request(app)
      .get('/api/candidates/skills/search?query=jav')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    // Should return unique skills (JavaScript, Java)
    expect(response.body.data).toContain('JavaScript');
    expect(response.body.data).toContain('Java');
    
    // Should not contain duplicates
    const uniqueSkills = new Set(response.body.data);
    expect(uniqueSkills.size).toBe(response.body.data.length);
    
    // Should not return more than 5 results
    expect(response.body.data.length).toBeLessThanOrEqual(5);
  });

  it('should return empty array for non-matching query', async () => {
    const response = await request(app)
      .get('/api/candidates/skills/search?query=nonexistent')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual([]);
  });

  it('should return error for empty query', async () => {
    const response = await request(app)
      .get('/api/candidates/skills/search?query=')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('should require authentication', async () => {
    const response = await request(app)
      .get('/api/candidates/skills/search?query=jav');
    
    expect(response.status).toBe(401);
  });
}); 