/**
 * Clase para errores de la aplicación
 * Extiende la clase Error nativa para añadir información adicional
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  errorCode?: string;

  /**
   * Constructor de la clase AppError
   * @param message Mensaje de error
   * @param statusCode Código de estado HTTP
   * @param errorCode Código de error opcional para identificar el tipo de error
   * @param isOperational Indica si es un error operacional (esperado) o de programación
   */
  constructor(
    message: string,
    statusCode: number = 500,
    errorCode?: string,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorCode = errorCode;
    
    // Capturar la pila de llamadas para facilitar la depuración
    Error.captureStackTrace(this, this.constructor);
    
    // Establecer el nombre de la clase para facilitar la identificación
    this.name = this.constructor.name;
  }

  /**
   * Crea un error de validación (400 Bad Request)
   * @param message Mensaje de error
   * @param errorCode Código de error opcional
   * @returns Instancia de AppError
   */
  static badRequest(message: string, errorCode?: string): AppError {
    return new AppError(message, 400, errorCode || 'BAD_REQUEST');
  }

  /**
   * Crea un error de autenticación (401 Unauthorized)
   * @param message Mensaje de error
   * @param errorCode Código de error opcional
   * @returns Instancia de AppError
   */
  static unauthorized(message: string, errorCode?: string): AppError {
    return new AppError(message, 401, errorCode || 'UNAUTHORIZED');
  }

  /**
   * Crea un error de autorización (403 Forbidden)
   * @param message Mensaje de error
   * @param errorCode Código de error opcional
   * @returns Instancia de AppError
   */
  static forbidden(message: string, errorCode?: string): AppError {
    return new AppError(message, 403, errorCode || 'FORBIDDEN');
  }

  /**
   * Crea un error de recurso no encontrado (404 Not Found)
   * @param message Mensaje de error
   * @param errorCode Código de error opcional
   * @returns Instancia de AppError
   */
  static notFound(message: string, errorCode?: string): AppError {
    return new AppError(message, 404, errorCode || 'NOT_FOUND');
  }

  /**
   * Crea un error de conflicto (409 Conflict)
   * @param message Mensaje de error
   * @param errorCode Código de error opcional
   * @returns Instancia de AppError
   */
  static conflict(message: string, errorCode?: string): AppError {
    return new AppError(message, 409, errorCode || 'CONFLICT');
  }

  /**
   * Crea un error interno del servidor (500 Internal Server Error)
   * @param message Mensaje de error
   * @param errorCode Código de error opcional
   * @param isOperational Indica si es un error operacional
   * @returns Instancia de AppError
   */
  static internal(
    message: string,
    errorCode?: string,
    isOperational: boolean = false
  ): AppError {
    return new AppError(message, 500, errorCode || 'INTERNAL_ERROR', isOperational);
  }
} 