import request from 'supertest';
import { createServer } from '../server';
import { AppDataSource } from '../infrastructure/database/config/database';

describe('GET /', () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it('responds with Hola LTI!', async () => {
    const app = await createServer();
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hola LTI!');
  });
});
