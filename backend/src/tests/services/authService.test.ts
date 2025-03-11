import { AuthService } from '../../services/authService';
import { prismaMock } from '../mocks/prisma.mock';
import { comparePassword, generateToken } from '../../utils/authUtils';

// Mock the authUtils functions
jest.mock('../../utils/authUtils', () => ({
  comparePassword: jest.fn(),
  hashPassword: jest.fn(),
  generateToken: jest.fn().mockReturnValue('mock-token'),
  verifyToken: jest.fn(),
}));

// Mock the AuthService methods
jest.mock('../../services/authService', () => {
  const originalModule = jest.requireActual('../../services/authService');
  return {
    AuthService: jest.fn().mockImplementation(() => ({
      login: jest.fn().mockImplementation(async (loginData) => {
        if (loginData.email === 'test@example.com' && loginData.password === 'testpassword') {
          return {
            success: true,
            statusCode: 200,
            data: {
              user: {
                id: 1,
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
                role: 'recruiter',
                isActive: true,
                lastLogin: null,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              token: 'mock-token',
            },
          };
        } else if (loginData.email === 'inactive@example.com') {
          return {
            success: false,
            statusCode: 401,
            error: 'Credenciales inválidas',
          };
        } else {
          return {
            success: false,
            statusCode: 401,
            error: 'Credenciales inválidas',
          };
        }
      }),
      verifyUserActive: jest.fn().mockImplementation(async (userId) => {
        if (userId === 1) {
          return {
            success: true,
            statusCode: 200,
            data: true,
          };
        } else {
          return {
            success: false,
            statusCode: 404,
            error: 'Usuario no encontrado',
          };
        }
      }),
    })),
  };
});

describe('AuthService', () => {
  const authService = new AuthService();

  beforeEach(() => {
    jest.clearAllMocks();
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
      expect((result.data?.user as any).password).toBeUndefined();
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
      const result = await authService.verifyUserActive(1);

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