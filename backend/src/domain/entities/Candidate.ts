export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  cvFilePath: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CandidateCreationParams {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  cvFilePath: string;
} 