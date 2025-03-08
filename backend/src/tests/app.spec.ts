import request from 'supertest';
import { app } from '../index';

// Mock di @prisma/client
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    })),
    Status: {
      PENDING: 'PENDING',
      VALUATED: 'VALUATED',
      DISCARDED: 'DISCARDED',
    },
  };
});

describe('Express App', () => {
  it('should return 200 for the root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('LTI Candidate Management System API');
  });

  it('should return 404 for non-existent routes', async () => {
    const response = await request(app).get('/non-existent-route');
    expect(response.status).toBe(404);
  });
});
