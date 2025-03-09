import { Candidate } from '../entities/Candidate';

export interface CandidateRepository {
  save(candidate: Candidate): Promise<Candidate>;
  findById(id: number): Promise<Candidate | null>;
  findAll(): Promise<Candidate[]>;
  findByEmail(email: string): Promise<Candidate | null>;
} 