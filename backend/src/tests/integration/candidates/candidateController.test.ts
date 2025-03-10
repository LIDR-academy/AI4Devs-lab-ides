import request from 'supertest';
import express from 'express';
import { CandidateController } from '../../../features/candidates/controllers/candidateController';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

// Mock de PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockDeep<PrismaClient>()),
}));

// Mock de CandidateService
jest.mock('../../../features/candidates/services/candidateService', () => {
  return {
    CandidateService: jest.fn().mockImplementation(() => ({
      createCandidate: jest.fn().mockImplementation(async (data) => {
        if (data.email === 'error@example.com') {
          return {
            success: false,
            statusCode: 500,
            error: 'Error interno'
          };
        } else if (data.email === 'duplicate@example.com') {
          return {
            success: false,
            statusCode: 400,
            error: 'Ya existe un candidato con ese email'
          };
        } else {
          return {
            success: true,
            statusCode: 201,
            data: {
              id: 1,
              ...data
            }
          };
        }
      }),
      updateCandidate: jest.fn().mockImplementation(async (id, data) => {
        if (id === 999) {
          return {
            success: false,
            statusCode: 404,
            error: 'Candidato no encontrado'
          };
        } else if (data.email === 'duplicate@example.com') {
          return {
            success: false,
            statusCode: 400,
            error: 'Ya existe un candidato con ese email'
          };
        } else if (id === 500) {
          return {
            success: false,
            statusCode: 500,
            error: 'Error interno'
          };
        } else {
          return {
            success: true,
            statusCode: 200,
            data: {
              id,
              ...data
            }
          };
        }
      }),
      deleteCandidate: jest.fn().mockImplementation(async (id) => {
        if (id === 999) {
          return {
            success: false,
            statusCode: 404,
            error: 'Candidato no encontrado'
          };
        } else if (id === 500) {
          return {
            success: false,
            statusCode: 500,
            error: 'Error interno'
          };
        } else {
          return {
            success: true,
            statusCode: 200,
            data: { message: 'Candidato eliminado correctamente' }
          };
        }
      })
    }))
  };
});

// Mock de middleware de validación
jest.mock('../../../middlewares/zodValidationMiddleware', () => ({
  validateBody: jest.fn().mockImplementation(() => (req: any, res: any, next: any) => {
    // Validación simple para el test
    if (req.body.firstName && req.body.lastName && req.body.email) {
      next();
    } else {
      res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        errors: []
      });
    }
  }),
  validateParams: jest.fn().mockImplementation(() => (req: any, res: any, next: any) => {
    // Validación simple para el test
    const id = parseInt(req.params.id);
    if (!isNaN(id) && id > 0) {
      next();
    } else {
      res.status(400).json({
        success: false,
        error: 'ID inválido',
        errors: []
      });
    }
  }),
  validateQuery: jest.fn().mockImplementation(() => (req: any, res: any, next: any) => {
    // Validación simple para el test
    next();
  })
}));

describe('CandidateController - Integration Tests', () => {
  let app: express.Application;
  let candidateController: CandidateController;

  beforeEach(() => {
    // Crear una nueva aplicación Express para cada test
    app = express();
    app.use(express.json());
    
    // Crear una nueva instancia del controlador
    candidateController = new CandidateController();
    
    // Configurar las rutas
    app.post('/api/candidates', (req, res, next) => {
      // Simular usuario autenticado
      (req as any).user = { id: 1, email: 'recruiter@example.com' };
      next();
    }, CandidateController.validateCreateCandidate, (req, res) => candidateController.createCandidate(req, res));
    
    app.put('/api/candidates/:id', CandidateController.validateCandidateId, CandidateController.validateUpdateCandidate, (req, res) => candidateController.updateCandidate(req, res));
    
    app.delete('/api/candidates/:id', CandidateController.validateCandidateId, (req, res) => candidateController.deleteCandidate(req, res));
  });

  describe('POST /api/candidates', () => {
    it('debería crear un candidato y devolver código 201', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        skills: [{ name: 'JavaScript', level: 'intermediate' }]
      };

      const response = await request(app)
        .post('/api/candidates')
        .send(candidateData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(1);
      expect(response.body.data.firstName).toBe('John');
      expect(response.body.data.lastName).toBe('Doe');
      expect(response.body.data.email).toBe('john.doe@example.com');
    });

    it('debería devolver código 400 si el email ya existe', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'duplicate@example.com',
        phone: '123456789'
      };

      const response = await request(app)
        .post('/api/candidates')
        .send(candidateData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Ya existe un candidato con ese email');
    });

    it('debería devolver código 500 si ocurre un error interno', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'error@example.com',
        phone: '123456789'
      };

      const response = await request(app)
        .post('/api/candidates')
        .send(candidateData)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Error interno');
    });

    it('debería validar que los datos sean correctos', async () => {
      const invalidData = {
        // Falta firstName
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };

      const response = await request(app)
        .post('/api/candidates')
        .send(invalidData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Datos inválidos');
    });
  });

  describe('PUT /api/candidates/:id', () => {
    it('debería actualizar un candidato existente y devolver código 200', async () => {
      const updateData = {
        firstName: 'John Updated',
        lastName: 'Doe Updated',
        email: 'john.updated@example.com',
        skills: [{ name: 'JavaScript', level: 'advanced' }]
      };

      const response = await request(app)
        .put('/api/candidates/1')
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(1);
      expect(response.body.data.firstName).toBe('John Updated');
      expect(response.body.data.lastName).toBe('Doe Updated');
      expect(response.body.data.email).toBe('john.updated@example.com');
    });

    it('debería devolver código 404 si el candidato no existe', async () => {
      const updateData = {
        firstName: 'John Updated',
        lastName: 'Doe Updated',
        email: 'john.updated@example.com'
      };

      const response = await request(app)
        .put('/api/candidates/999')
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Candidato no encontrado');
    });

    it('debería devolver código 400 si el email ya existe', async () => {
      const updateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'duplicate@example.com'
      };

      const response = await request(app)
        .put('/api/candidates/1')
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Ya existe un candidato con ese email');
    });

    it('debería devolver código 500 si ocurre un error interno', async () => {
      const updateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };

      const response = await request(app)
        .put('/api/candidates/500')
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Error interno');
    });

    it('debería validar que el ID sea un número entero positivo', async () => {
      const updateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };

      const response = await request(app)
        .put('/api/candidates/invalid')
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('ID inválido');
    });

    it('debería validar que los datos sean correctos', async () => {
      const invalidData = {
        // Falta firstName
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };

      const response = await request(app)
        .put('/api/candidates/1')
        .send(invalidData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Datos inválidos');
    });
  });

  describe('DELETE /api/candidates/:id', () => {
    it('debería eliminar un candidato existente y devolver código 200', async () => {
      const response = await request(app)
        .delete('/api/candidates/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Candidato eliminado correctamente');
    });

    it('debería devolver código 404 si el candidato no existe', async () => {
      const response = await request(app)
        .delete('/api/candidates/999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Candidato no encontrado');
    });

    it('debería devolver código 500 si ocurre un error interno', async () => {
      const response = await request(app)
        .delete('/api/candidates/500')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Error interno');
    });

    it('debería validar que el ID sea un número entero positivo', async () => {
      const response = await request(app)
        .delete('/api/candidates/invalid')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('ID inválido');
    });
  });
}); 