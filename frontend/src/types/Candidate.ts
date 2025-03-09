export interface Candidate {
  id?: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: CandidateStatus;
  education: Education[];
  resumeFilename?: string;
  resumeOriginalName?: string;
  resumeMimetype?: string;
  resumeSize?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum CandidateStatus {
  NEW = 'NEW',
  SCREENING = 'SCREENING',
  INTERVIEW = 'INTERVIEW',
  TECHNICAL_TEST = 'TECHNICAL_TEST',
  OFFER = 'OFFER',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED'
}

export interface Education {
  id?: number;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
  isCurrentlyStudying?: boolean;
}

export interface CandidateFormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  education: Education[];
  resume?: File;
  notes?: string;
  status?: CandidateStatus;
}

// Predefined positions that can be selected
export const AVAILABLE_POSITIONS = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "UX/UI Designer",
  "Product Manager",
  "Project Manager",
  "QA Engineer",
  "Technical Writer",
  "IT Support Specialist",
  "Database Administrator",
  "Security Engineer",
  "Mobile Developer",
  "Machine Learning Engineer",
  "Sales Representative",
  "Marketing Specialist",
  "Human Resources Manager",
  "Financial Analyst"
]; 