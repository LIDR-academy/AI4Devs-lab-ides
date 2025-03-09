import { AuthService } from '../../services/authService';
import { setupTestDB, teardownTestDB } from '../setup';
import { PrismaClient } from '@prisma/client';

describe('AuthService', () => {
  const authService = new AuthService();
  const prisma = new PrismaClient();

  // Configurar la base de datos antes de todos los tests
  beforeAll(async () => {
    await setupTestDB();
  });

  // Limpiar la base de datos después de todos los tests
  afterAll(async () => {
    await teardownTestDB();
  });

  describe('login', () => {
    it('debería iniciar sesión correctamente con credenciales válidas', async () => {
      const result = await authService.login({
        email: 'test@example.com',
        password: 'testpassword',
      });

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data).toBeDefined();
      expect(result.data?.user).toBeDefined();
      expect(result.data?.token).toBeDefined();
      expect(result.data?.user.email).toBe('test@example.com');
      expect(result.data?.user.role).toBe('recruiter');
      // Verificar que no se devuelve la contraseña
      expect((result.data?.user as any).passwordHash).toBeUndefined();
    });

    it('debería rechazar el inicio de sesión con email incorrecto', async () => {
      const result = await authService.login({
        email: 'nonexistent@example.com',
        password: 'testpassword',
      });

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(401);
      expect(result.error).toBe('Credenciales inválidas');
    });

    it('debería rechazar el inicio de sesión con contraseña incorrecta', async () => {
      const result = await authService.login({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(401);
      expect(result.error).toBe('Credenciales inválidas');
    });

    it('debería rechazar el inicio de sesión para un usuario inactivo', async () => {
      const result = await authService.login({
        email: 'inactive@example.com',
        password: 'inactivepassword',
      });

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(401);
      expect(result.error).toBe('Credenciales inválidas');
    });
  });

  describe('verifyUserActive', () => {
    it('debería verificar correctamente un usuario activo', async () => {
      // Primero obtenemos el ID del usuario de prueba
      const user = await prisma.user.findUnique({
        where: { email: 'test@example.com' },
      });
      
      const userId = user?.id;
      
      if (!userId) {
        // Si no se encuentra el usuario, omitir el test
        console.log('Usuario de prueba no encontrado, omitiendo test');
        return;
      }

      const result = await authService.verifyUserActive(userId);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data).toBe(true);
    });

    it('debería rechazar un usuario inexistente', async () => {
      const result = await authService.verifyUserActive(9999);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(404);
      expect(result.error).toBe('Usuario no encontrado');
    });
  });
}); 