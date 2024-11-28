import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createCandidate = async (data: Prisma.CandidateCreateInput) => {
  try {
    return await prisma.candidate.create({ data });
  } catch (error) {
    console.error('Error creating candidate:', error);
    throw error;
  }
};

export const getCandidateById = async (id: string) => {
  try {
    return await prisma.candidate.findUnique({ where: { id } });
  } catch (error) {
    console.error('Error fetching candidate by ID:', error);
    throw error;
  }
};

export const updateCandidate = async (id: string, data: Prisma.CandidateUpdateInput) => {
    try {
      return await prisma.candidate.update({ where: { id }, data });
    } catch (error) {
      console.error('Error updating candidate:', error);
      throw error;
    }
  };

export const deleteCandidate = async (id: string) => {
  try {
    return await prisma.candidate.delete({ where: { id } });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    throw error;
  }
};