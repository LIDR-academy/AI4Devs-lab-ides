import { Candidate } from '../models/Candidate';

export interface ICandidateRepository {
  findAll(): Promise<Candidate[]>;
  findById(id: number): Promise<Candidate | null>;
  findByEmail(email: string): Promise<Candidate | null>;
  save(candidate: Candidate): Promise<Candidate>;
  update(candidate: Candidate): Promise<Candidate>;
  delete(id: number): Promise<boolean>;
} 