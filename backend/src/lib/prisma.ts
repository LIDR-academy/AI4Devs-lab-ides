import { PrismaClient } from '@prisma/client';

// Declare global variable for prisma
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a singleton instance of Prisma Client
const prisma = global.prisma || new PrismaClient();

// In development, save the Prisma Client instance globally to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Define a custom Prisma client with our model names
const prismaClient = prisma as PrismaClient & {
  candidate: {
    findUnique: Function;
    create: Function;
    findMany: Function;
    findFirst: Function;
    update: Function;
    deleteMany: Function;
  };
  skill: {
    deleteMany: Function;
  };
  language: {
    deleteMany: Function;
  };
  workExperience: {
    deleteMany: Function;
  };
  education: {
    deleteMany: Function;
  };
  candidateDocument: {
    deleteMany: Function;
    create: Function;
  };
};

export default prismaClient;