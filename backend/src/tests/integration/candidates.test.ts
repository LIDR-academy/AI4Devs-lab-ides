import request from 'supertest';
import { Express } from 'express';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../infrastructure/database/config/database';
import { createServer } from '../../server';
import { CreateCandidateUseCase } from '../../application/useCases/CreateCandidate';
import { GetCandidatesUseCase } from '../../application/useCases/GetCandidates';
import { PostgresCandidateRepository } from '../../infrastructure/database/repositories/PostgresCandidateRepository';
import { MockFileUploader } from '../../infrastructure/services/__mocks__/MockFileUploader';

describe('Candidates API', () => {
  let app: Express;
  let dataSource: DataSource;
  let createCandidateUseCase: CreateCandidateUseCase;
  let getCandidatesUseCase: GetCandidatesUseCase;
  let candidateRepository: PostgresCandidateRepository;
  let fileUploader: MockFileUploader;

  beforeAll(async () => {
    // Inicializar la base de datos y la aplicación
    dataSource = await AppDataSource.initialize();
    app = await createServer();
    candidateRepository = new PostgresCandidateRepository();
    fileUploader = new MockFileUploader();
    createCandidateUseCase = new CreateCandidateUseCase(candidateRepository, fileUploader);
    getCandidatesUseCase = new GetCandidatesUseCase(candidateRepository);
  });

  beforeEach(async () => {
    // Limpiar la base de datos antes de cada test
    const entities = AppDataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      await repository.clear();
    }
  });

  afterAll(async () => {
    // Cerrar la conexión a la base de datos
    await dataSource.destroy();
  });

  it('should create a new candidate', async () => {
    const candidateData = {
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123456789'
    };

    const response = await request(app)
      .post('/api/candidates')
      .field('candidate', JSON.stringify(candidateData))
      .attach('cv', Buffer.from('fake cv content'), 'cv.pdf');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Candidato creado exitosamente');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('email', candidateData.email);
  });

  it('should fail with invalid email', async () => {
    const candidateData = {
      name: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      phone: '123456789'
    };

    const response = await request(app)
      .post('/api/candidates')
      .field('candidate', JSON.stringify(candidateData));

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should create and retrieve candidates', async () => {
    // Crear un candidato primero
    const candidateData = {
      name: 'John',
      lastName: 'Doe',
      email: 'john.retrieve@example.com',
      phone: '123456789'
    };

    await request(app)
      .post('/api/candidates')
      .field('candidate', JSON.stringify(candidateData));

    // Obtener la lista de candidatos
    const response = await request(app)
      .get('/api/candidates');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body.some((c: any) => c.email === candidateData.email)).toBe(true);
  });
}); 