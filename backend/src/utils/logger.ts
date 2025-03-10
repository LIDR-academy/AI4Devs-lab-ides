/**
 * Módulo de logging para la aplicación
 */

// Niveles de log
enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

// Configuración del logger
const LOG_LEVEL = process.env.LOG_LEVEL || LogLevel.INFO;
const SHOW_TIMESTAMP = true;

/**
 * Formatea un mensaje de log con timestamp si está habilitado
 */
const formatLogMessage = (level: LogLevel, message: string): string => {
  const timestamp = SHOW_TIMESTAMP ? `[${new Date().toISOString()}] ` : '';
  return `${timestamp}[${level}] ${message}`;
};

/**
 * Determina si un nivel de log debe ser mostrado según la configuración
 */
const shouldLog = (level: LogLevel): boolean => {
  const levels = Object.values(LogLevel);
  const configLevelIndex = levels.indexOf(LOG_LEVEL as LogLevel);
  const currentLevelIndex = levels.indexOf(level);
  
  return currentLevelIndex >= configLevelIndex;
};

/**
 * Logger para la aplicación
 */
export const logger = {
  debug: (message: string, ...args: any[]): void => {
    if (shouldLog(LogLevel.DEBUG)) {
      console.debug(formatLogMessage(LogLevel.DEBUG, message), ...args);
    }
  },
  
  info: (message: string, ...args: any[]): void => {
    if (shouldLog(LogLevel.INFO)) {
      console.info(formatLogMessage(LogLevel.INFO, message), ...args);
    }
  },
  
  warn: (message: string, ...args: any[]): void => {
    if (shouldLog(LogLevel.WARN)) {
      console.warn(formatLogMessage(LogLevel.WARN, message), ...args);
    }
  },
  
  error: (message: string, ...args: any[]): void => {
    if (shouldLog(LogLevel.ERROR)) {
      console.error(formatLogMessage(LogLevel.ERROR, message), ...args);
    }
  }
}; 