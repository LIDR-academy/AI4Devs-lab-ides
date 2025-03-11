/**
 * Interfaz para las respuestas de los servicios
 */
export interface ServiceResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
} 