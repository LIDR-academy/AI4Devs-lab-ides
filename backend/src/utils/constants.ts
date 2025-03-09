/**
 * Constantes para la aplicación
 */

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  RECRUITER: 'recruiter',
  MANAGER: 'manager',
  CANDIDATE: 'candidate',
};

// Estados de candidato
export const CANDIDATE_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  HIRED: 'hired',
  REJECTED: 'rejected',
};

// Acciones de log
export const LOG_ACTIONS = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  VIEW: 'view',
};

// Códigos de error
export const ERROR_CODES = {
  // Errores de autenticación
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Errores de usuario
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_INACTIVE: 'USER_INACTIVE',
  USER_EXISTS: 'USER_EXISTS',
  
  // Errores de candidato
  CANDIDATE_NOT_FOUND: 'CANDIDATE_NOT_FOUND',
  CANDIDATE_EXISTS: 'CANDIDATE_EXISTS',
  
  // Errores de validación
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  
  // Errores de autorización
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  
  // Errores de servidor
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
};

// Límites de paginación
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
}; 