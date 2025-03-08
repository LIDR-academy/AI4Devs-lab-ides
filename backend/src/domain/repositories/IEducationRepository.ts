import { Education } from '../models/Education';

export interface IEducationRepository {
  findAll(): Promise<Education[]>;
  findById(id: number): Promise<Education | null>;
  findByCandidateId(candidateId: number): Promise<Education[]>;
  save(education: Education, candidateId: number): Promise<Education>;
  update(education: Education): Promise<Education>;
  delete(id: number): Promise<boolean>;
} 