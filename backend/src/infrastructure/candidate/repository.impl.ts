import { PrismaClient } from '@prisma/client';
import {
  Candidate,
  ICandidate,
  ICandidateRepository,
  Status,
} from '../../domain/candidate';

// Helper function to adapt Prisma types to domain types
const adaptPrismaCandidate = (prismaCandidate: any): ICandidate => {
  return {
    ...prismaCandidate,
    status: prismaCandidate.status as unknown as Status,
  };
};

// Map domain status to Prisma status for database operations
const mapDomainStatusToPrisma = (status: Status | undefined): any => {
  if (!status) return 'PENDING';
  return status as unknown as any;
};

export class CandidateRepository implements ICandidateRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Candidate[]> {
    const candidates = await this.prisma.candidate.findMany();
    return candidates.map(
      (candidate) => new Candidate(adaptPrismaCandidate(candidate)),
    );
  }

  async findById(id: number): Promise<Candidate | null> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
    });
    return candidate ? new Candidate(adaptPrismaCandidate(candidate)) : null;
  }

  async create(candidateData: ICandidate): Promise<Candidate> {
    const prismaCandidate = {
      ...candidateData,
      status: mapDomainStatusToPrisma(candidateData.status),
    };

    const candidate = await this.prisma.candidate.create({
      data: prismaCandidate,
    });

    return new Candidate(adaptPrismaCandidate(candidate));
  }

  async update(
    id: number,
    candidateData: Partial<ICandidate>,
  ): Promise<Candidate> {
    const prismaUpdate = { ...candidateData };
    if (candidateData.status) {
      prismaUpdate.status = mapDomainStatusToPrisma(candidateData.status);
    }

    const candidate = await this.prisma.candidate.update({
      where: { id },
      data: prismaUpdate,
    });

    return new Candidate(adaptPrismaCandidate(candidate));
  }

  async delete(id: number): Promise<void> {
    await this.prisma.candidate.delete({
      where: { id },
    });
  }

  async getStatistics(): Promise<{
    total: number;
    pending: number;
    valuated: number;
    discarded: number;
  }> {
    const total = await this.prisma.candidate.count();

    // Convert domain Status values to Prisma Status values for database queries
    const pending = await this.prisma.candidate.count({
      where: { status: mapDomainStatusToPrisma(Status.PENDING) },
    });

    // Count candidates in interview, offered or hired as valuated
    const valuated = await this.prisma.candidate.count({
      where: {
        status: {
          in: [
            mapDomainStatusToPrisma(Status.INTERVIEW),
            mapDomainStatusToPrisma(Status.OFFERED),
            mapDomainStatusToPrisma(Status.HIRED),
          ],
        },
      },
    });

    const discarded = await this.prisma.candidate.count({
      where: { status: mapDomainStatusToPrisma(Status.REJECTED) },
    });

    return { total, pending, valuated, discarded };
  }

  async findEducationValues(): Promise<string[]> {
    const results = await this.prisma.candidate.findMany({
      select: { education: true },
      distinct: ['education'],
    });
    return results.map((result) => result.education);
  }

  async findExperienceValues(): Promise<string[]> {
    const results = await this.prisma.candidate.findMany({
      select: { experience: true },
      distinct: ['experience'],
    });
    return results.map((result) => result.experience);
  }
}
