import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { app } from '../index';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

describe('Candidate Endpoints', () => {
  beforeAll(async () => {
    // Crear directorio de uploads si no existe
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
  });

  beforeEach(async () => {
    // Limpiar la base de datos antes de cada test
    await prisma.document.deleteMany();
    await prisma.education.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.candidate.deleteMany();
  });

  describe('POST /api/candidates', () => {
    it('should create a new candidate successfully', async () => {
      const response = await request(app)
        .post('/api/candidates')
        .send({
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          phone: '+34612345678'
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.firstName).toBe('Juan');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/candidates')
        .send({
          firstName: 'Juan'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle file upload', async () => {
      // Crear un archivo temporal para el test
      const testFilePath = path.join(__dirname, 'test.pdf');
      fs.writeFileSync(testFilePath, 'Test CV content');

      const response = await request(app)
        .post('/api/candidates')
        .field('firstName', 'Juan')
        .field('lastName', 'Pérez')
        .field('email', 'juan.file@example.com')
        .attach('cv', testFilePath);

      // Limpiar archivo temporal
      fs.unlinkSync(testFilePath);

      expect(response.status).toBe(201);
      expect(response.body.data.documents).toHaveLength(1);
    });
  });

  describe('GET /api/candidates', () => {
    it('should return a list of candidates', async () => {
      const response = await request(app).get('/api/candidates');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(0);
    });
  });
}); 