export interface Educacion {
  id?: number;
  institucion: string;
  titulo: string;
  fecha_inicio: string;
  fecha_fin?: string | null;
}

export interface ExperienciaLaboral {
  id?: number;
  empresa: string;
  puesto: string;
  fecha_inicio: string;
  fecha_fin?: string | null;
  descripcion?: string;
}

export interface Documento {
  id?: number;
  tipo_documento: string;
  nombre_archivo: string;
  ruta_archivo: string;
}

export interface Candidato {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion?: string;
  educacion?: Educacion[];
  experiencia_laboral?: ExperienciaLaboral[];
  documentos?: Documento[];
}

export interface CandidatoFormValues {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  educacion: Educacion[];
  experiencia_laboral: ExperienciaLaboral[];
}

export interface CVFormValues {
  archivo: File | null;
} 