import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import logger from '../config/logger';

// Configuración del rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 solicitudes por ventana por IP
  standardHeaders: true, // Devolver info de rate limit en los headers `RateLimit-*`
  legacyHeaders: false, // Deshabilitar los headers `X-RateLimit-*`
  message: {
    success: false,
    message: 'Demasiadas solicitudes, por favor intente de nuevo más tarde.'
  },
  handler: (req: Request, res: Response) => {
    logger.warn(`Rate limit excedido para IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Demasiadas solicitudes, por favor intente de nuevo más tarde.'
    });
  }
});

// Rate limiter específico para la creación de candidatos (más restrictivo)
export const createCandidateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // Límite de 20 creaciones de candidatos por hora por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas solicitudes para crear candidatos, por favor intente de nuevo más tarde.'
  },
  handler: (req: Request, res: Response) => {
    logger.warn(`Rate limit de creación de candidatos excedido para IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Demasiadas solicitudes para crear candidatos, por favor intente de nuevo más tarde.'
    });
  }
}); 