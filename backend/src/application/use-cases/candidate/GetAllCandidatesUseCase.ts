import { Candidate } from '../../../domain/entities/Candidate';
import { CandidateService } from '../../../domain/services/CandidateService';

export class GetAllCandidatesUseCase {
  private candidateService: CandidateService;

  constructor(candidateService: CandidateService) {
    this.candidateService = candidateService;
  }

  async execute(): Promise<Candidate[]> {
    return this.candidateService.getAllCandidates();
  }
} 