import { Candidate } from '../entities/Candidate';

export interface ICandidateRepository {
  create(candidate: Candidate): Promise<Candidate>;
  findByEmail(email: string): Promise<Candidate | null>;
  findById(id: string): Promise<Candidate | null>;
  findAll(): Promise<Candidate[]>;
} 