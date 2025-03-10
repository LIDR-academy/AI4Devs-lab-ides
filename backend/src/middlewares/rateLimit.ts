import rateLimit from 'express-rate-limit';
import authConfig from '../config/auth.config';
import { auditLogger } from '../utils/logger';

/**
 * Rate limiter global para todas las rutas
 */
export const globalLimiter = rateLimit({
  windowMs: authConfig.security.rateLimit.windowMs,
  max: authConfig.security.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas solicitudes, por favor intente más tarde.'
  },
  handler: (req, res, next, options) => {
    auditLogger.api(req, res, 0);
    res.status(429).json(options.message);
  }
});

/**
 * Rate limiter más estricto para rutas de autenticación
 */
export const authLimiter = rateLimit({
  windowMs: authConfig.security.rateLimit.auth.windowMs,
  max: authConfig.security.rateLimit.auth.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiados intentos de autenticación, por favor intente más tarde.'
  },
  handler: (req, res, next, options) => {
    auditLogger.auth(
      req.body?.email || 'unknown',
      'RATE_LIMIT_EXCEEDED',
      false,
      req.ip,
      req.headers['user-agent'] as string
    );
    res.status(429).json(options.message);
  }
}); 