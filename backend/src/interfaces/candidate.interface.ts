export interface ICandidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string | null;
  education: IEducation[];
  workExperience: IWorkExperience[];
  document: IDocument | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEducation {
  id: string;
  candidateId: string;
  title: string;
  institution: string;
  startDate: Date;
  endDate: Date;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkExperience {
  id: string;
  candidateId: string;
  company: string;
  position: string;
  startDate: Date;
  endDate: Date;
  responsibilities: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocument {
  id: string;
  candidateId: string;
  fileName: string;
  fileType: 'PDF' | 'DOCX';
  fileSize: number;
  filePath: string;
  uploadedAt: Date;
}

export interface CreateEducationDto {
  title: string;
  institution: string;
  startDate: Date;
  endDate: Date;
  description?: string | null;
}

export interface CreateWorkExperienceDto {
  company: string;
  position: string;
  startDate: Date;
  endDate: Date;
  responsibilities?: string | null;
}

export interface CreateCandidateDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string | null;
  education: CreateEducationDto[];
  workExperience: CreateWorkExperienceDto[];
}

export interface CreateDocumentDto {
  fileName: string;
  fileType: 'PDF' | 'DOCX';
  fileSize: number;
} 