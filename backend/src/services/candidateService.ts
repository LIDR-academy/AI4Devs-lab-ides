import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Definir tipos manualmente ya que Prisma no puede generar los tipos automáticamente
interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  cvFilePath?: string;
  cvFileType?: string;
  cvUploadedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  education?: Education[];
  experience?: Experience[];
}

interface Education {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  candidateId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Experience {
  id: number;
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  candidateId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CandidateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: EducationInput[];
  experience?: ExperienceInput[];
  cvFilePath?: string;
  cvFileType?: string;
}

interface EducationInput {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

interface ExperienceInput {
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export const candidateService = {
  // Crear un nuevo candidato
  createCandidate: async (candidateData: CandidateInput): Promise<Candidate> => {
    const { education, experience, ...candidateInfo } = candidateData;

    return prisma.$transaction(async (tx) => {
      // Crear el candidato
      const candidate = await (tx as any).candidate.create({
        data: candidateInfo,
      });

      // Crear registros de educación si existen
      if (education && education.length > 0) {
        await Promise.all(
          education.map((edu) =>
            (tx as any).education.create({
              data: {
                ...edu,
                candidateId: candidate.id,
              },
            })
          )
        );
      }

      // Crear registros de experiencia si existen
      if (experience && experience.length > 0) {
        await Promise.all(
          experience.map((exp) =>
            (tx as any).experience.create({
              data: {
                ...exp,
                candidateId: candidate.id,
              },
            })
          )
        );
      }

      return candidate as unknown as Candidate;
    });
  },

  // Obtener todos los candidatos
  getAllCandidates: async (): Promise<Candidate[]> => {
    return (prisma as any).candidate.findMany({
      include: {
        education: true,
        experience: true,
      },
    }) as unknown as Candidate[];
  },

  // Obtener un candidato por ID
  getCandidateById: async (id: number): Promise<Candidate | null> => {
    return (prisma as any).candidate.findUnique({
      where: { id },
      include: {
        education: true,
        experience: true,
      },
    }) as unknown as Candidate | null;
  },

  // Actualizar un candidato
  updateCandidate: async (id: number, candidateData: Partial<CandidateInput>): Promise<Candidate> => {
    const { education, experience, ...candidateInfo } = candidateData;

    return prisma.$transaction(async (tx) => {
      // Actualizar el candidato
      const candidate = await (tx as any).candidate.update({
        where: { id },
        data: candidateInfo,
      });

      // Actualizar registros de educación si existen
      if (education) {
        // Eliminar registros existentes
        await (tx as any).education.deleteMany({
          where: { candidateId: id },
        });

        // Crear nuevos registros
        await Promise.all(
          education.map((edu) =>
            (tx as any).education.create({
              data: {
                ...edu,
                candidateId: id,
              },
            })
          )
        );
      }

      // Actualizar registros de experiencia si existen
      if (experience) {
        // Eliminar registros existentes
        await (tx as any).experience.deleteMany({
          where: { candidateId: id },
        });

        // Crear nuevos registros
        await Promise.all(
          experience.map((exp) =>
            (tx as any).experience.create({
              data: {
                ...exp,
                candidateId: id,
              },
            })
          )
        );
      }

      return candidate as unknown as Candidate;
    });
  },

  // Eliminar un candidato
  deleteCandidate: async (id: number): Promise<Candidate> => {
    return (prisma as any).candidate.delete({
      where: { id },
    }) as unknown as Candidate;
  },
};
