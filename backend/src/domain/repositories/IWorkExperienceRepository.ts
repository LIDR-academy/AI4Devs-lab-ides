import { WorkExperience } from '../models/WorkExperience';

export interface IWorkExperienceRepository {
  findAll(): Promise<WorkExperience[]>;
  findById(id: number): Promise<WorkExperience | null>;
  findByCandidateId(candidateId: number): Promise<WorkExperience[]>;
  save(experience: WorkExperience, candidateId: number): Promise<WorkExperience>;
  update(experience: WorkExperience): Promise<WorkExperience>;
  delete(id: number): Promise<boolean>;
} 