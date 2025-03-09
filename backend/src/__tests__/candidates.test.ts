import request from 'supertest';
import { app } from '../app';

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
});
