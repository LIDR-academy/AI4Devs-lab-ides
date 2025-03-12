import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { Express } from 'express';
import logger from '../config/logger';

/**
 * Configuración de CORS
 */
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  credentials: true,
  maxAge: 86400 // 24 horas
};

/**
 * Middleware para sanitizar datos de entrada
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitizar campos de texto para prevenir XSS
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Eliminar scripts y caracteres peligrosos
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+=/gi, '');
      }
    });
  }
  next();
};

/**
 * Middleware para ocultar información sensible en las respuestas
 */
export const hideSensitiveData = (req: Request, res: Response, next: NextFunction) => {
  // Guardar el método original de res.json
  const originalJson = res.json;
  
  // Sobrescribir el método res.json para filtrar datos sensibles
  res.json = function(body: any) {
    // Si la respuesta contiene datos de candidatos
    if (body && body.data) {
      // Si es un array de candidatos
      if (Array.isArray(body.data)) {
        body.data = body.data.map((candidate: any) => {
          // Eliminar datos sensibles
          const { cvFilePath, ...safeData } = candidate;
          
          // Enmascarar parte del email y teléfono
          if (safeData.email) {
            const [username, domain] = safeData.email.split('@');
            safeData.email = `${username.substring(0, 3)}***@${domain}`;
          }
          
          if (safeData.phone) {
            safeData.phone = safeData.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');
          }
          
          return safeData;
        });
      } 
      // Si es un único candidato
      else if (body.data.email) {
        const { cvFilePath, ...safeData } = body.data;
        body.data = safeData;
      }
    }
    
    // Llamar al método original
    return originalJson.call(this, body);
  };
  
  next();
};

/**
 * Middleware para añadir encabezados de seguridad
 */
export const addSecurityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Añadir encabezados de seguridad adicionales
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  next();
};

/**
 * Configurar todas las medidas de seguridad para la aplicación
 */
export const configureSecurityMiddleware = (app: Express) => {
  // Usar Helmet para configurar encabezados de seguridad
  app.use(helmet());
  
  // Configurar CORS
  app.use(cors(corsOptions));
  
  // Sanitizar datos de entrada
  app.use(sanitizeInput);
  
  // Ocultar información sensible
  app.use(hideSensitiveData);
  
  // Añadir encabezados de seguridad adicionales
  app.use(addSecurityHeaders);
  
  logger.info('Middlewares de seguridad configurados');
}; 