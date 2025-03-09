export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Candidate {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: Education[];
  experience: Experience[];
  cvPath?: string;
}

export interface CandidateFormData extends Omit<Candidate, 'education' | 'experience' | 'cvPath'> {
  education: Education[];
  experience: Experience[];
  cv?: File;
} 