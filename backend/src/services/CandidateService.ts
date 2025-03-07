import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CandidateService {
  async addCandidate(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    education?: string;
    experience?: string;
    cvFilePath?: string;
  }) {
    try {
      const candidate = await prisma.candidate.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          education: data.education,
          experience: data.experience,
          cvFilePath: data.cvFilePath,
        },
      });
      return candidate;
    } catch (error) {
      throw new Error('Error al añadir el candidato: ' + error.message);
    }
  }

  async getAllCandidates() {
    try {
      const candidates = await prisma.candidate.findMany();
      return candidates;
    } catch (error) {
      throw new Error('Error al obtener los candidatos: ' + error.message);
    }
  }
}