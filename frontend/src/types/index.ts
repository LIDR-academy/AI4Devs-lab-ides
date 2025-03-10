export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: string;
  workExperience?: string;
  cvFilePath?: string;
  createdAt: string;
  updatedAt: string;
  consentGiven?: boolean;
}

export interface CandidateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: string;
  workExperience?: string;
  cv?: FileList;
  privacyConsent?: boolean;
}
