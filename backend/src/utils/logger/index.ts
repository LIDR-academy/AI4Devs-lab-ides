import winston from 'winston';
import path from 'path';

// Formato personalizado para logs
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
    }`;
  })
);

// Directorio de logs
const logDir = path.join(__dirname, '../../../logs');

// Crear el logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: customFormat,
  defaultMeta: { service: 'candidates-api' },
  transports: [
    // Log a consola en desarrollo
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        customFormat
      ),
    }),
    // Log de errores a archivo
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error' 
    }),
    // Log general a archivo
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log') 
    }),
    // Log de auditoría para eventos de autenticación
    new winston.transports.File({ 
      filename: path.join(logDir, 'auth.log'),
      level: 'info'
    }),
  ],
});

// Exportar funciones específicas para auditoría
export const auditLogger = {
  // Log para eventos de autenticación
  auth: (username: string, action: string, success: boolean, ip: string, userAgent?: string) => {
    logger.info(`AUTH: ${action}`, {
      user: username,
      success,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  },
  
  // Log para eventos de API
  api: (req: any, res: any, responseTime: number) => {
    const { method, originalUrl, ip, headers } = req;
    const { statusCode } = res;
    
    logger.info(`API: ${method} ${originalUrl}`, {
      method,
      url: originalUrl,
      statusCode,
      responseTime: `${responseTime}ms`,
      ip,
      userAgent: headers['user-agent'],
      timestamp: new Date().toISOString(),
    });
  },
  
  // Log para errores
  error: (error: any, req?: any) => {
    const context = req ? {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    } : {};
    
    logger.error(`ERROR: ${error.message}`, {
      ...context,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }
};

export default logger; 