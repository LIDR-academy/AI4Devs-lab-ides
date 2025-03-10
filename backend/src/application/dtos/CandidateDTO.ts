export interface CreateCandidateDTO {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion: string;
  educacion: string;
  experiencia: string;
  cv: Express.Multer.File;
}

export interface CandidateResponseDTO {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion: string;
  educacion: string;
  experiencia: string;
  cvUrl: string;
  createdAt: Date;
  updatedAt: Date;
} 