export interface FileInfo {
  originalName: string;
  mimetype: string;
  tempPath: string;
  candidateId: number;
}

export interface EducationDto {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
}

export interface ExperienceDto {
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
}

export interface CreateCandidateDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: EducationDto[];
  experience?: ExperienceDto[];
  notes?: string;
  resumeUrl?: string;
}

export interface UpdateCandidateDto extends Partial<CreateCandidateDto> {} 