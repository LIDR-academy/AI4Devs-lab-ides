import { PrismaClient, Candidate, Status } from '@prisma/client';
import { prisma } from '../index';

export class CandidateService {
  async getAllCandidates() {
    return prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCandidate(id: number) {
    return prisma.candidate.findUnique({
      where: { id },
    });
  }

  async createCandidate(
    data: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    return prisma.candidate.create({
      data,
    });
  }

  async updateCandidate(id: number, data: Partial<Candidate>) {
    return prisma.candidate.update({
      where: { id },
      data,
    });
  }

  async deleteCandidate(id: number) {
    return prisma.candidate.delete({
      where: { id },
    });
  }

  async getStatistics() {
    const [total, waiting, interview, accepted, rejected] = await Promise.all([
      prisma.candidate.count(),
      prisma.candidate.count({ where: { status: Status.WAITING } }),
      prisma.candidate.count({ where: { status: Status.INTERVIEW } }),
      prisma.candidate.count({ where: { status: Status.ACCEPTED } }),
      prisma.candidate.count({ where: { status: Status.REJECTED } }),
    ]);

    return {
      total,
      waiting,
      interview,
      accepted,
      rejected,
    };
  }
}

export const candidateService = new CandidateService();
