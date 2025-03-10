import { Candidate } from '../entities/Candidate';
import { ICandidateRepository } from '../repositories/ICandidateRepository';

export class CandidateService {
  constructor(private readonly candidateRepository: ICandidateRepository) {}

  async createCandidate(candidateData: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Candidate> {
    const existingCandidate = await this.candidateRepository.findByEmail(candidateData.correo);
    if (existingCandidate) {
      throw new Error('Ya existe un candidato con este correo electrónico');
    }

    const candidate = Candidate.create(candidateData);
    return this.candidateRepository.create(candidate);
  }
} 