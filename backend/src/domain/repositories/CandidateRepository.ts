import { Candidate, CandidateCreationParams } from '../entities/Candidate';

export interface CandidateRepository {
  findById(id: number): Promise<Candidate | null>;
  findAll(): Promise<Candidate[]>;
  create(candidate: CandidateCreationParams): Promise<Candidate>;
} 