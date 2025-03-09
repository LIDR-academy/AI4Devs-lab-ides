export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CandidateCreateInput extends Omit<Candidate, 'id' | 'cvPath' | 'createdAt' | 'updatedAt'> {
  cv?: Express.Multer.File;
} 