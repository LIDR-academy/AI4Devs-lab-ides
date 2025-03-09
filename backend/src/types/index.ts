import { PrismaClient } from '@prisma/client';

// Define model types based on Prisma's generated types
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PrismaClient {
    interface PrismaClient {
      // Define more specific types than 'any'
      candidate: {
        findUnique: (args: any) => Promise<any>;
        findFirst: (args: any) => Promise<any>;
        findMany: (args: any) => Promise<any[]>;
        create: (args: any) => Promise<any>;
        update: (args: any) => Promise<any>;
        delete: (args: any) => Promise<any>;
        count: (args: any) => Promise<number>;
      };
      candidateDocument: Record<string, any>;
      skill: Record<string, any>;
      user: Record<string, any>;
      language: Record<string, any>;
      workExperience: Record<string, any>;
      education: Record<string, any>;
      document: Record<string, any>;

      // PascalCase models
      Candidate: Record<string, any>;
      CandidateDocument: Record<string, any>;
      Skill: Record<string, any>;
      User: Record<string, any>;
      Language: Record<string, any>;
      WorkExperience: Record<string, any>;
      Education: Record<string, any>;
      Document: Record<string, any>;
    }
  }
}

// Type for candidate object used in tests
export interface CandidateType {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedInUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// No other exports to avoid linter errors
export {};