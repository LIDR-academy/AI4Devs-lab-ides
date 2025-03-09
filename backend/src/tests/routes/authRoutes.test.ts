import request from 'supertest';
import { app } from '../../index';
import { setupTestDB, teardownTestDB } from '../setup';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../features/auth/utils/authUtils';

describe('Auth Routes', () => {
  const prisma = new PrismaClient();

  // Configurar la base de datos antes de todos los tests
  beforeAll(async () => {
    await setupTestDB();
    
    // Asegurarse de que los usuarios de prueba existen
    try {
      // Verificar si el usuario de prueba ya existe
      const testUser = await prisma.user.findUnique({
        where: { email: 'test@example.com' },
      });
      
      if (!testUser) {
        // Crear usuario de prueba si no existe
        const passwordHash = await hashPassword('testpassword');
        await prisma.user.create({
          data: {
            email: 'test@example.com',
            name: 'Test User',
            role: 'recruiter',
            passwordHash,
            isActive: true,
          },
        });
      }
    } catch (error) {
      console.error('Error al crear usuario de prueba:', error);
    }
  });

  // Limpiar la base de datos después de todos los tests
  afterAll(async () => {
    await teardownTestDB();
  });

  describe('POST /api/auth/login', () => {
    it('debería iniciar sesión correctamente con credenciales válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.user.role).toBe('recruiter');
      
      // Verificar que se establece la cookie de autenticación
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('auth_token=');
    });

    it('debería rechazar el inicio de sesión con email incorrecto', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'testpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Credenciales inválidas');
    });

    it('debería rechazar el inicio de sesión con contraseña incorrecta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Credenciales inválidas');
    });

    it('debería rechazar el inicio de sesión con datos de entrada inválidos', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'short',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('debería cerrar sesión correctamente', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Sesión cerrada correctamente');
      
      // Verificar que se elimina la cookie de autenticación
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('auth_token=;');
    });
  });
}); 