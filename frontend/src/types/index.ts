export interface Candidate {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  currentPosition?: string;
  currentCompany?: string;
  yearsOfExperience?: number;
  skills: Skill[];
  educations: Education[];
  experiences: WorkExperience[];
  cv?: File | null;
  notes?: string;
  tags: Tag[];
  createdAt?: string;
  status?: string;
}

export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export interface Skill {
  id?: number;
  name: string;
  category?: string;
  level: SkillLevel;
}

export interface Education {
  id?: number;
  institution: string;
  degree: string;
  startDate: Date | string;
  endDate?: Date | string;
  current: boolean;
  description?: string;
}

export interface WorkExperience {
  id?: number;
  company: string;
  position: string;
  startDate: Date | string;
  endDate?: Date | string;
  current: boolean;
  description?: string;
}

export interface Tag {
  id?: number;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  validationErrors?: any[];
} 