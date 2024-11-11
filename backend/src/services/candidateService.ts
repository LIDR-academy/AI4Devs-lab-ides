import { PrismaClient, Candidate } from '@prisma/client';
import { CandidateInput } from '../validators/candidateValidator';

const prisma = new PrismaClient();

export class CandidateService {
  async createCandidate(data: CandidateInput, cvPath?: string) {
    return prisma.candidate.create({
      data: {
        ...data,
        documents: cvPath ? {
          create: [{
            filename: cvPath,
            fileType: 'CV',
            fileUrl: cvPath
          }]
        } : undefined
      },
      include: {
        education: true,
        experience: true,
        documents: true
      }
    });
  }

  async updateCandidate(id: number, data: Partial<CandidateInput>, cvPath?: string) {
    return prisma.candidate.update({
      where: { id },
      data: {
        ...data,
        documents: cvPath ? {
          create: [{
            filename: cvPath,
            fileType: 'CV',
            fileUrl: cvPath
          }]
        } : undefined
      },
      include: {
        education: true,
        experience: true,
        documents: true
      }
    });
  }

  async deleteCandidate(id: number) {
    return prisma.candidate.delete({
      where: { id }
    });
  }

  async searchCandidates(query: string) {
    return prisma.candidate.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        education: true,
        experience: true,
        documents: true
      }
    });
  }
}

export const candidateService = new CandidateService();