import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

// Error logger
export const logError = (error: Error, req: Request) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${error.name}: ${error.message}\nStack: ${error.stack}\nRequest: ${req.method} ${req.originalUrl}\nBody: ${JSON.stringify(req.body)}\n\n`;
  
  // Ensure logs directory exists
  const logsDir = path.join(__dirname, '../../logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  // Append to log file
  fs.appendFileSync(
    path.join(logsDir, 'error.log'),
    logMessage
  );
  
  // Also log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(logMessage);
  }
};

// Global error handler middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log the error
  logError(err, req);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: err.errors
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Acceso no autorizado'
    });
  }
  
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: `Error en la carga de archivos: ${err.message}`
    });
  }
  
  // Default to 500 server error
  return res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
}; 