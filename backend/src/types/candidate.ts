import { ProficiencyLevel, CandidateStatus } from '@prisma/client';

export interface EducationInput {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate?: Date | null;
  description?: string;
}

export interface WorkExperienceInput {
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate?: Date | null;
  description?: string;
}

export interface SkillInput {
  name: string;
  proficiencyLevel?: ProficiencyLevel;
}

export interface CandidateInput {
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
  education?: EducationInput[];
  workExperience?: WorkExperienceInput[];
  skills?: SkillInput[];
  status?: CandidateStatus;
}

export interface CandidateFilters {
  search?: string;
  status?: CandidateStatus;
  skills?: string[];
  page?: number;
  limit?: number;
} 