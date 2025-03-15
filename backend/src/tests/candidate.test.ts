import request from 'supertest';
import { app } from '../index';
import prisma from '../index';
import path from 'path';
import fs from 'fs';

// Mock de Prisma para pruebas unitarias
jest.mock('../index', () => {
  const originalModule = jest.requireActual('../index');
  return {
    __esModule: true,
    ...originalModule,
    default: {
      candidate: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      education: {
        create: jest.fn(),
      },
      experience: {
        create: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback({
        candidate: {
          create: jest.fn().mockResolvedValue({
            id: 1,
            firstName: 'Test',
            lastName: 'Candidate',
            email: 'test@example.com',
            phone: '123456789',
            address: 'Test Address',
            cvFilePath: 'uploads/test.pdf',
          }),
        },
        education: {
          create: jest.fn(),
        },
        experience: {
          create: jest.fn(),
        },
      })),
    },
  };
});

// Limpiar mocks después de cada prueba
afterEach(() => {
  jest.clearAllMocks();
});

// Limpiar base de datos y archivos después de todas las pruebas
afterAll(async () => {
  // Limpiar archivos de prueba
  const testUploadsDir = path.join(__dirname, '../../uploads/test');
  if (fs.existsSync(testUploadsDir)) {
    fs.rmSync(testUploadsDir, { recursive: true, force: true });
  }
  
  // Cerrar conexión de Prisma
  await prisma.$disconnect();
});

describe('Candidate Controller - Unit Tests', () => {
  // Datos de prueba
  const validCandidateData: {
    firstName?: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    education: string;
    experience: string;
  } = {
    firstName: 'Test',
    lastName: 'Candidate',
    email: 'test@example.com',
    phone: '123456789',
    address: 'Test Address',
    education: JSON.stringify([
      {
        institution: 'Test University',
        degree: 'Computer Science',
        fieldOfStudy: 'Software Engineering',
        startDate: '2018-01-01',
        endDate: '2022-01-01',
      },
    ]),
    experience: JSON.stringify([
      {
        company: 'Test Company',
        position: 'Software Developer',
        description: 'Developing software',
        startDate: '2022-02-01',
        endDate: '2023-02-01',
      },
    ]),
  };

  // Prueba: Validación de datos - Falta el nombre
  test('should return 400 if firstName is missing', async () => {
    // Preparar datos sin firstName
    const invalidData = { ...validCandidateData };
    if (invalidData.hasOwnProperty('firstName')) {
      delete invalidData.firstName;
    }

    // Crear un archivo de prueba
    const testFilePath = path.join(__dirname, 'test-cv.pdf');
    fs.writeFileSync(testFilePath, 'Test PDF content');

    // Enviar solicitud
    const response = await request(app)
      .post('/api/candidates')
      .field('lastName', invalidData.lastName)
      .field('email', invalidData.email)
      .field('phone', invalidData.phone)
      .field('address', invalidData.address)
      .field('education', invalidData.education)
      .field('experience', invalidData.experience)
      .attach('cv', testFilePath);

    // Limpiar archivo de prueba
    fs.unlinkSync(testFilePath);

    // Verificar respuesta
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('inválidos');
  });

  // Prueba: Validación de datos - Email inválido
  test('should return 400 if email is invalid', async () => {
    // Crear un archivo de prueba
    const testFilePath = path.join(__dirname, 'test-cv.pdf');
    fs.writeFileSync(testFilePath, 'Test PDF content');

    // Enviar solicitud con email inválido
    const response = await request(app)
      .post('/api/candidates')
      .field('firstName', validCandidateData.firstName || '')
      .field('lastName', validCandidateData.lastName)
      .field('email', 'invalid-email')
      .field('phone', validCandidateData.phone)
      .field('address', validCandidateData.address)
      .field('education', validCandidateData.education)
      .field('experience', validCandidateData.experience)
      .attach('cv', testFilePath);

    // Limpiar archivo de prueba
    fs.unlinkSync(testFilePath);

    // Verificar respuesta
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('inválidos');
  });

  // Prueba: Validación de datos - Falta el CV
  test('should return 400 if CV file is missing', async () => {
    // Enviar solicitud sin archivo
    const response = await request(app)
      .post('/api/candidates')
      .field('firstName', validCandidateData.firstName || '')
      .field('lastName', validCandidateData.lastName)
      .field('email', validCandidateData.email)
      .field('phone', validCandidateData.phone)
      .field('address', validCandidateData.address)
      .field('education', validCandidateData.education)
      .field('experience', validCandidateData.experience);

    // Verificar respuesta
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('CV');
  });

  // Prueba: Email duplicado
  test('should return 400 if email already exists', async () => {
    // Mock para simular que el email ya existe
    (prisma.candidate.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 1,
      email: validCandidateData.email,
    });

    // Crear un archivo de prueba
    const testFilePath = path.join(__dirname, 'test-cv.pdf');
    fs.writeFileSync(testFilePath, 'Test PDF content');

    // Enviar solicitud
    const response = await request(app)
      .post('/api/candidates')
      .field('firstName', validCandidateData.firstName || '')
      .field('lastName', validCandidateData.lastName)
      .field('email', validCandidateData.email)
      .field('phone', validCandidateData.phone)
      .field('address', validCandidateData.address)
      .field('education', validCandidateData.education)
      .field('experience', validCandidateData.experience)
      .attach('cv', testFilePath);

    // Limpiar archivo de prueba
    fs.unlinkSync(testFilePath);

    // Verificar respuesta
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Ya existe');
  });

  // Prueba: Creación exitosa
  test('should create a candidate successfully', async () => {
    // Mock para simular que el email no existe
    (prisma.candidate.findUnique as jest.Mock).mockResolvedValueOnce(null);

    // Crear un archivo de prueba
    const testFilePath = path.join(__dirname, 'test-cv.pdf');
    fs.writeFileSync(testFilePath, 'Test PDF content');

    // Enviar solicitud
    const response = await request(app)
      .post('/api/candidates')
      .field('firstName', validCandidateData.firstName || '')
      .field('lastName', validCandidateData.lastName)
      .field('email', validCandidateData.email)
      .field('phone', validCandidateData.phone)
      .field('address', validCandidateData.address)
      .field('education', validCandidateData.education)
      .field('experience', validCandidateData.experience)
      .attach('cv', testFilePath);

    // Limpiar archivo de prueba
    fs.unlinkSync(testFilePath);

    // Verificar respuesta
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('exitosamente');
    expect(response.body.id).toBe(1);
  });
});

// Pruebas de integración (requieren base de datos real)
describe('Candidate API - Integration Tests', () => {
  const candidates = JSON.parse(fs.readFileSync(path.join(__dirname, 'dummy.json'), 'utf-8')).candidates;

  afterAll(async () => {
    // Aquí puedes limpiar la base de datos si es necesario
  });

  candidates.forEach((candidate: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    education: any; // Puedes definir un tipo más específico si lo deseas
    experience: any; // Puedes definir un tipo más específico si lo deseas
    cvFile: string;
  }) => {
    test(`should create candidate: ${candidate.firstName} ${candidate.lastName}`, async () => {
      // Crear un archivo de prueba para el CV
      const testFilePath = path.join(__dirname, 'test-cv.pdf');
      fs.writeFileSync(testFilePath, 'Test PDF content');

      const response = await request(app)
        .post('/api/candidates')
        .field('firstName', candidate.firstName)
        .field('lastName', candidate.lastName)
        .field('email', candidate.email)
        .field('phone', candidate.phone)
        .field('address', candidate.address)
        .field('education', JSON.stringify(candidate.education))
        .field('experience', JSON.stringify(candidate.experience))
        .attach('cv', testFilePath);

      // Limpiar archivo de prueba
      fs.unlinkSync(testFilePath);

      // Verificar respuesta
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.text).toBe('API del Sistema de Seguimiento de Talento');
    });
  });
}); 