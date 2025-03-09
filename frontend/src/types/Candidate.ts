/**
 * Tipos relacionados con los candidatos en el sistema ATS
 */

/**
 * Interfaz para la información educativa de un candidato
 */
export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string | null; // null si aún está en curso
  description?: string;
}

/**
 * Interfaz para la experiencia laboral de un candidato
 */
export interface WorkExperience {
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string | null; // null si es el trabajo actual
  description?: string;
}

/**
 * Interfaz principal para los datos de un candidato
 */
export interface Candidate {
  id?: string; // Opcional porque será generado por el backend
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  education: Education[];
  workExperience: WorkExperience[];
  cvFile?: File | null; // Archivo de CV
  createdAt?: string; // Fecha de creación en el sistema
  updatedAt?: string; // Fecha de última actualización
}

/**
 * Interfaz para el formulario de creación de candidato
 */
export interface CandidateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: Education[];
  workExperience: WorkExperience[];
  cvFile: File | null;
}

/**
 * Interfaz para la paginación
 */
export interface Pagination {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Interfaz para la respuesta de la API al crear un candidato
 */
export interface CandidateApiResponse {
  success: boolean;
  message: string;
  data?: Candidate | Candidate[];
  pagination?: Pagination;
  errors?: Record<string, string[]>;
} 