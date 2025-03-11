export type Status = "WAITING" | "INTERVIEW" | "REJECTED";

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  education?: string;
  experience?: string;
  cvFilePath?: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}
