import { Education } from './Education';
import { WorkExperience } from './WorkExperience';

export interface CandidateProps {
  id?: number;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: Education[];
  workExperience?: WorkExperience[];
  cvUrl?: string;
} 