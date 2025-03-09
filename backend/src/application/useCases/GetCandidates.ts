import { Candidate } from '../../domain/entities/Candidate';
import { CandidateRepository } from '../../domain/repositories/CandidateRepository';
import { Result } from '../../domain/shared/Result';

export class GetCandidatesUseCase {
  constructor(private candidateRepository: CandidateRepository) {}

  async execute(): Promise<Result<Candidate[]>> {
    try {
      const candidates = await this.candidateRepository.findAll();
      return Result.ok(candidates);
    } catch (error) {
      return Result.fail({
        message: 'Error al obtener los candidatos',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 