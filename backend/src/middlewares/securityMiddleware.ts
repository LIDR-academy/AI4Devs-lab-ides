import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { Express, Request, Response, NextFunction } from 'express';
import { config } from '../config/config';

/**
 * Configura middlewares de seguridad para la aplicación
 * @param app Instancia de Express
 */
export const setupSecurityMiddleware = (app: Express) => {
  // Protección contra ataques comunes con Helmet
  app.use(
    helmet({
      contentSecurityPolicy: config.security.xssProtection ? undefined : false,
      xssFilter: config.security.xssProtection,
      noSniff: config.security.noSniff,
      hsts: config.security.hsts ? undefined : false,
    })
  );

  // Configurar CORS
  app.use(
    cors({
      origin: config.cors.origin,
      credentials: config.cors.credentials,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Limitar tasa de solicitudes para prevenir ataques de fuerza bruta
  const loginLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: {
      success: false,
      error: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo más tarde',
    },
    standardHeaders: config.rateLimit.standardHeaders,
    legacyHeaders: config.rateLimit.legacyHeaders,
  });

  // Aplicar limitador de tasa a rutas de autenticación
  app.use('/api/auth/login', loginLimiter);

  // Middleware para prevenir ataques de clickjacking
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Frame-Options', 'DENY');
    next();
  });

  // Middleware para prevenir ataques de MIME sniffing
  if (config.security.noSniff) {
    app.use((req: Request, res: Response, next: NextFunction) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      next();
    });
  }

  // Middleware para establecer política de referrer
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // Middleware para establecer Feature-Policy
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    );
    next();
  });
};

/**
 * Verifica si un origen está permitido
 * @param origin Origen de la solicitud
 * @returns Booleano indicando si el origen está permitido
 */
const isAllowedOrigin = (origin: string): boolean => {
  // Lista de orígenes permitidos (en producción, esto debería configurarse adecuadamente)
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    // Añadir otros orígenes permitidos según sea necesario
  ];

  return allowedOrigins.includes(origin);
};