export enum ProficiencyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export enum CandidateStatus {
  NEW = 'NEW',
  REVIEWING = 'REVIEWING',
  INTERVIEWED = 'INTERVIEWED',
  OFFERED = 'OFFERED',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED'
}

export interface Education {
  id?: number;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  description?: string;
}

export interface WorkExperience {
  id?: number;
  company: string;
  position: string;
  location?: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  description?: string;
}

export interface Skill {
  id?: number;
  name: string;
  proficiencyLevel?: ProficiencyLevel;
}

export interface Candidate {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  summary?: string;
  cvFilePath?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  education?: Education[];
  workExperience?: WorkExperience[];
  skills?: Skill[];
  status?: CandidateStatus;
}

export interface CandidateFormData extends Omit<Candidate, 'education' | 'workExperience' | 'skills'> {
  education: (Education & { isNew?: boolean })[];
  workExperience: (WorkExperience & { isNew?: boolean })[];
  skills: (Skill & { isNew?: boolean })[];
  cv?: File | null;
} 