import { Candidate, CandidateCreationParams } from '../../../domain/entities/Candidate';
import { CandidateService } from '../../../domain/services/CandidateService';

export class CreateCandidateUseCase {
  private candidateService: CandidateService;

  constructor(candidateService: CandidateService) {
    this.candidateService = candidateService;
  }

  async execute(candidateParams: CandidateCreationParams): Promise<Candidate> {
    return this.candidateService.createCandidate(candidateParams);
  }
} 