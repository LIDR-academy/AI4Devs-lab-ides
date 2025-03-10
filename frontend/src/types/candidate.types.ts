export interface Education {
  id?: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface Experience {
  id?: number;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface Candidate {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  education: Education[];
  experience: Experience[];
  resumeUrl?: string;
  status?: string;
  createdAt?: string;
}

export interface CandidateFormData extends Omit<Candidate, 'id'> {
  resume?: File;
} 