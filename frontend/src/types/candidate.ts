export interface Education {
  id?: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  description?: string;
  candidateId?: number;
}

export interface Experience {
  id?: number;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  description?: string;
  candidateId?: number;
}

export interface Candidate {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  cvFilePath?: string;
  createdAt?: string;
  updatedAt?: string;
  education?: Education[];
  experience?: Experience[];
}

export interface CandidateFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  cv?: File;
  cvFile?: File | null;  // Añadido para manejar el archivo CV
  education: Education[];
  experience: Experience[];
}
