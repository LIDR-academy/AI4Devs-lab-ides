export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'new' | 'active' | 'contacted' | 'interview' | 'offer' | 'hired' | 'rejected';
  position?: string;
  summary?: string;
  experience?: number;
  education?: any; // Usar any para evitar problemas de tipo
  educationText?: string; // Campo adicional para texto de educación (para compatibilidad)
  workExperience?: WorkExperience[];
  skills?: string[];
  resumeUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateResponse {
  success: boolean;
  data?: Candidate;
  error?: string;
}

export interface CandidatesResponse {
  success: boolean;
  data?: Candidate[];
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
} 