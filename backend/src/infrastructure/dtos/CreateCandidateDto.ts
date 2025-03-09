import { Education } from '../../domain/entities/types/Education';
import { WorkExperience } from '../../domain/entities/types/WorkExperience';

export class CreateCandidateDto {
  name!: string;
  lastName!: string;
  email!: string;
  phone!: string;
  address!: string;
  education!: Education[];
  workExperience!: WorkExperience[];
} 