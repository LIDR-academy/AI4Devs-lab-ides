import { Request, Response } from 'express';
import { authenticate, authorize } from '../../features/auth/middlewares/authMiddleware';
import { AuthRequest } from '../../features/auth/types';
import { generateToken } from '../../features/auth/utils/authUtils';

describe('Auth Middleware', () => {
  describe('authenticate', () => {
    it('debería autenticar correctamente con un token válido', () => {
      // Crear un token válido
      const token = generateToken({
        id: 1,
        email: 'test@example.com',
        role: 'recruiter',
      });

      // Mock de req, res y next
      const req = {
        cookies: {
          auth_token: token,
        },
        headers: {},
      } as unknown as AuthRequest;
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      
      const next = jest.fn();

      // Llamar al middleware
      authenticate(req, res, next);

      // Verificar que next fue llamado
      expect(next).toHaveBeenCalled();
      
      // Verificar que se añadió la información del usuario al request
      expect(req.user).toBeDefined();
      expect(req.user?.id).toBe(1);
      expect(req.user?.email).toBe('test@example.com');
      expect(req.user?.role).toBe('recruiter');
    });

    it('debería rechazar la autenticación sin token', () => {
      // Mock de req, res y next
      const req = {
        cookies: {},
        headers: {},
      } as unknown as AuthRequest;
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      
      const next = jest.fn();

      // Llamar al middleware
      authenticate(req, res, next);

      // Verificar que next no fue llamado
      expect(next).not.toHaveBeenCalled();
      
      // Verificar que se devolvió un error
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'No se proporcionó token de autenticación',
        code: 'UNAUTHORIZED'
      });
    });

    it('debería autenticar con token en el header de autorización', () => {
      // Crear un token válido
      const token = generateToken({
        id: 1,
        email: 'test@example.com',
        role: 'recruiter',
      });

      // Mock de req, res y next
      const req = {
        cookies: {},
        headers: {
          authorization: `Bearer ${token}`,
        },
      } as unknown as AuthRequest;
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      
      const next = jest.fn();

      // Llamar al middleware
      authenticate(req, res, next);

      // Verificar que next fue llamado
      expect(next).toHaveBeenCalled();
      
      // Verificar que se añadió la información del usuario al request
      expect(req.user).toBeDefined();
      expect(req.user?.id).toBe(1);
      expect(req.user?.email).toBe('test@example.com');
      expect(req.user?.role).toBe('recruiter');
    });
  });

  describe('authorize', () => {
    it('debería autorizar a un usuario con el rol correcto', () => {
      // Mock de req, res y next
      const req = {
        user: {
          id: 1,
          email: 'test@example.com',
          role: 'recruiter',
        },
      } as unknown as AuthRequest;
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      
      const next = jest.fn();

      // Crear middleware de autorización
      const authMiddleware = authorize(['recruiter', 'admin']);

      // Llamar al middleware
      authMiddleware(req, res, next);

      // Verificar que next fue llamado
      expect(next).toHaveBeenCalled();
    });

    it('debería rechazar a un usuario sin autenticación', () => {
      // Mock de req, res y next
      const req = {} as unknown as AuthRequest;
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      
      const next = jest.fn();

      // Crear middleware de autorización
      const authMiddleware = authorize(['recruiter', 'admin']);

      // Llamar al middleware
      authMiddleware(req, res, next);

      // Verificar que next no fue llamado
      expect(next).not.toHaveBeenCalled();
      
      // Verificar que se devolvió un error
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'No autenticado',
        code: 'UNAUTHORIZED'
      });
    });

    it('debería rechazar a un usuario con un rol incorrecto', () => {
      // Mock de req, res y next
      const req = {
        user: {
          id: 1,
          email: 'test@example.com',
          role: 'user',
        },
      } as unknown as AuthRequest;
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      
      const next = jest.fn();

      // Crear middleware de autorización
      const authMiddleware = authorize(['recruiter', 'admin']);

      // Llamar al middleware
      authMiddleware(req, res, next);

      // Verificar que next no fue llamado
      expect(next).not.toHaveBeenCalled();
      
      // Verificar que se devolvió un error
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'No autorizado para acceder a este recurso',
        code: 'FORBIDDEN'
      });
    });
  });
}); 