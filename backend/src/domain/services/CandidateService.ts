import { Candidate, CandidateCreationParams } from '../entities/Candidate';
import { CandidateRepository } from '../repositories/CandidateRepository';

export class CandidateService {
  private candidateRepository: CandidateRepository;

  constructor(candidateRepository: CandidateRepository) {
    this.candidateRepository = candidateRepository;
  }

  async createCandidate(candidateParams: CandidateCreationParams): Promise<Candidate> {
    return this.candidateRepository.create(candidateParams);
  }

  async getAllCandidates(): Promise<Candidate[]> {
    return this.candidateRepository.findAll();
  }

  async getCandidateById(id: number): Promise<Candidate | null> {
    return this.candidateRepository.findById(id);
  }
} 