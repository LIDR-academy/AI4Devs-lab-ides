export interface Candidate {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: string;
  workExperience?: string;
  cvFilePath?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  message: string;
  candidate?: T;
  error?: string;
} 