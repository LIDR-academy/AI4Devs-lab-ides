import {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  extractTokenFromRequest,
} from '../../utils/authUtils';
import { config } from '../../config/config';

describe('Auth Utils', () => {
  describe('hashPassword', () => {
    it('debería generar un hash diferente a la contraseña original', async () => {
      const password = 'testpassword';
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('debería generar hashes diferentes para la misma contraseña', async () => {
      const password = 'testpassword';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('debería verificar correctamente una contraseña válida', async () => {
      const password = 'testpassword';
      const hash = await hashPassword(password);
      const isValid = await comparePassword(password, hash);

      expect(isValid).toBe(true);
    });

    it('debería rechazar una contraseña inválida', async () => {
      const password = 'testpassword';
      const wrongPassword = 'wrongpassword';
      const hash = await hashPassword(password);
      const isValid = await comparePassword(wrongPassword, hash);

      expect(isValid).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('debería generar un token JWT válido', () => {
      const payload = {
        id: 1,
        email: 'test@example.com',
        role: 'recruiter',
      };
      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // Formato JWT: header.payload.signature
    });
  });

  describe('verifyToken', () => {
    it('debería verificar correctamente un token válido', () => {
      const payload = {
        id: 1,
        email: 'test@example.com',
        role: 'recruiter',
      };
      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.id).toBe(payload.id);
      expect(decoded?.email).toBe(payload.email);
      expect(decoded?.role).toBe(payload.role);
    });

    it('debería rechazar un token inválido', () => {
      const decoded = verifyToken('invalid.token.here');

      expect(decoded).toBeNull();
    });
  });

  describe('extractTokenFromRequest', () => {
    it('debería extraer el token de las cookies', () => {
      const token = 'valid.token.here';
      const req = {
        cookies: {
          [config.jwt.cookieName]: token,
        },
        headers: {},
      };
      const extractedToken = extractTokenFromRequest(req);

      expect(extractedToken).toBe(token);
    });

    it('debería extraer el token del header de autorización', () => {
      const token = 'valid.token.here';
      const req = {
        cookies: {},
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const extractedToken = extractTokenFromRequest(req);

      expect(extractedToken).toBe(token);
    });

    it('debería devolver null si no hay token', () => {
      const req = {
        cookies: {},
        headers: {},
      };
      const extractedToken = extractTokenFromRequest(req);

      expect(extractedToken).toBeNull();
    });

    it('debería priorizar el token de las cookies sobre el header', () => {
      const cookieToken = 'cookie.token.here';
      const headerToken = 'header.token.here';
      const req = {
        cookies: {
          [config.jwt.cookieName]: cookieToken,
        },
        headers: {
          authorization: `Bearer ${headerToken}`,
        },
      };
      const extractedToken = extractTokenFromRequest(req);

      expect(extractedToken).toBe(cookieToken);
    });
  });
}); 