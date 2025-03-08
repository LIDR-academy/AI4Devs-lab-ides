export enum CandidateStatus {
  ACTIVE = 'ACTIVE',
  REVIEWING = 'REVIEWING',
  INTERVIEWED = 'INTERVIEWED',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface Candidate {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: Education[];
  workExperience?: WorkExperience[];
  resumeUrl?: string;
  status?: CandidateStatus;
  createdAt?: string;
  updatedAt?: string;
} 