export interface Candidate {
  id?: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  educacion: string;
  experiencia: string;
  cv_path?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CandidateFormData extends Omit<Candidate, 'cv_path' | 'createdAt' | 'updatedAt'> {
  cv?: File;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    msg: string;
    param: string;
  }>;
} 