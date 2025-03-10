export interface Candidato {
  id?: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion?: string;
  educacion?: string;
  experiencia_laboral?: string;
  cv?: File | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CandidatoFormData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion?: string;
  educacion?: string;
  experiencia_laboral?: string;
  cv?: FileList | undefined;
}

export interface ApiResponse<T> {
  mensaje: string;
  data?: T;
  error?: string;
  mensajes?: string[];
} 