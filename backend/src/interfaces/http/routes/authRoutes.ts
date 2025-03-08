import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthController } from '../controllers/AuthController';
import { RegisterUserUseCase } from '../../../application/use-cases/auth/RegisterUserUseCase';
import { LoginUserUseCase } from '../../../application/use-cases/auth/LoginUserUseCase';
import { RefreshTokenUseCase } from '../../../application/use-cases/auth/RefreshTokenUseCase';
import { PrismaUserRepository } from '../../../infrastructure/persistence/PrismaUserRepository';
import { validateRegister, validateLogin } from '../middleware/validationMiddleware';
import { sanitizeInputs } from '../middleware/sanitizationMiddleware';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { Role } from '../../../domain/models/User';
import cookieParser from 'cookie-parser';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiter para evitar ataques de fuerza bruta
const loginRateLimiter = new RateLimiterMemory({
  points: 5, // 5 intentos
  duration: 60 * 15, // por 15 minutos
});

const loginRateLimiterMiddleware = async (req: any, res: any, next: any) => {
  try {
    const key = req.ip;
    await loginRateLimiter.consume(key);
    next();
  } catch (error) {
    res.status(429).json({
      success: false,
      message: 'Demasiados intentos de inicio de sesión. Intente nuevamente más tarde.'
    });
  }
};

export const authRouter = (prismaClient: PrismaClient): Router => {
  const router = Router();
  
  // Añadimos middleware para procesar cookies
  router.use(cookieParser());

  // Configuración de JWT
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

  // Repositorios
  const userRepository = new PrismaUserRepository(prismaClient);

  // Casos de uso
  const registerUserUseCase = new RegisterUserUseCase(userRepository);
  const loginUserUseCase = new LoginUserUseCase(
    userRepository,
    JWT_SECRET,
    JWT_REFRESH_SECRET
  );
  const refreshTokenUseCase = new RefreshTokenUseCase(
    userRepository,
    JWT_SECRET
  );

  // Controlador
  const authController = new AuthController(
    registerUserUseCase,
    loginUserUseCase,
    refreshTokenUseCase
  );

  // Rutas públicas
  router.post('/register', sanitizeInputs, validateRegister, authController.register);
  router.post('/login', sanitizeInputs, validateLogin, loginRateLimiterMiddleware, authController.login);
  router.post('/refresh-token', sanitizeInputs, authController.refreshToken);
  router.post('/logout', authController.logout);

  // Rutas protegidas (requieren autenticación)
  // Esta ruta es solo para comprobar la autenticación
  router.get(
    '/me',
    authenticate(userRepository, JWT_SECRET),
    (req, res) => {
      res.status(200).json({
        success: true,
        data: req.user,
        message: 'Usuario autenticado'
      });
    }
  );

  // Esta ruta requiere rol de administrador
  router.get(
    '/admin-only',
    authenticate(userRepository, JWT_SECRET),
    authorize([Role.ADMIN]),
    (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Acceso de administrador confirmado'
      });
    }
  );

  return router;
}; 