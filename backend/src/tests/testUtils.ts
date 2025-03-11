import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

const prisma = new PrismaClient();

/**
 * Create a test user for testing purposes
 */
export const createTestUser = async () => {
  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: `test-${Date.now()}@example.com`,
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'RECRUITER',
      isActive: true
    }
  });

  // Generate a token for the user
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: '1h' }
  );

  return { userId: user.id, token };
};

/**
 * Create a test candidate for testing purposes
 */
export const createTestCandidate = async (candidateData: any) => {
  const { skills, ...data } = candidateData;

  const candidate = await prisma.candidate.create({
    data: {
      ...data,
      skills: {
        create: skills ? skills.map((skill: any) => ({ name: skill.name })) : []
      }
    },
    include: {
      skills: true
    }
  });

  return candidate;
};

/**
 * Clean up the database after tests
 */
export const cleanupDatabase = async () => {
  // Delete in the correct order to respect foreign key constraints
  await prisma.$executeRaw`TRUNCATE TABLE "CandidateSkill" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Education" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "WorkExperience" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Document" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Candidate" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
}; 