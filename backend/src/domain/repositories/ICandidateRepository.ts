import { Candidate } from '../entities/Candidate';

export interface ICandidateRepository {
  save(candidate: Candidate): Promise<void>;
  findById(id: string): Promise<Candidate | null>;
  findByEmail(email: string): Promise<Candidate | null>;
} 