import { PrismaClient } from '@prisma/client';
import { Candidate, CandidateCreationParams } from '../../domain/entities/Candidate';
import { CandidateRepository } from '../../domain/repositories/CandidateRepository';

export class PrismaCandidateRepository implements CandidateRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number): Promise<Candidate | null> {
    return this.prisma.candidate.findUnique({
      where: { id }
    });
  }

  async findAll(): Promise<Candidate[]> {
    return this.prisma.candidate.findMany();
  }

  async create(candidate: CandidateCreationParams): Promise<Candidate> {
    return this.prisma.candidate.create({
      data: candidate
    });
  }
} 