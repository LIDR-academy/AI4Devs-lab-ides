import { Candidate, ICandidate } from './entity';

export interface ICandidateRepository {
  findAll(): Promise<Candidate[]>;
  findById(id: number): Promise<Candidate | null>;
  create(candidate: ICandidate): Promise<Candidate>;
  update(id: number, candidate: Partial<ICandidate>): Promise<Candidate>;
  delete(id: number): Promise<void>;
  getStatistics(): Promise<{
    total: number;
    pending: number;
    valuated: number;
    discarded: number;
  }>;
  findEducationValues(): Promise<string[]>;
  findExperienceValues(): Promise<string[]>;
}
