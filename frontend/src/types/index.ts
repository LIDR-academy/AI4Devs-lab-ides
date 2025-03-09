export interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  description: string;
}

export interface Candidate {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  education?: Education[];
  workExperience?: WorkExperience[];
  cvUrl?: string;
} 