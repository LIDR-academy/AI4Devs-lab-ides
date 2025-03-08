import { PrismaClient } from '@prisma/client';
import { Candidate } from '../../domain/models/Candidate';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { CandidateMapper } from './mappers/CandidateMapper';

export class PrismaCandidateRepository implements ICandidateRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Candidate[]> {
    const prismaCandidates = await this.prisma.candidate.findMany();
    return prismaCandidates.map(prismaCandidate => 
      CandidateMapper.toDomain(prismaCandidate));
  }

  async findById(id: number): Promise<Candidate | null> {
    const prismaCandidate = await this.prisma.candidate.findUnique({
      where: { id }
    });

    if (!prismaCandidate) return null;

    return CandidateMapper.toDomain(prismaCandidate);
  }

  async findByEmail(email: string): Promise<Candidate | null> {
    const prismaCandidate = await this.prisma.candidate.findUnique({
      where: { email }
    });

    if (!prismaCandidate) return null;

    return CandidateMapper.toDomain(prismaCandidate);
  }

  async save(candidate: Candidate): Promise<Candidate> {
    const data = CandidateMapper.toPersistence(candidate);
    
    const savedCandidate = await this.prisma.candidate.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        currentPosition: data.currentPosition,
        currentCompany: data.currentCompany,
        yearsOfExperience: data.yearsOfExperience,
        notes: data.notes,
      }
    });

    return CandidateMapper.toDomain(savedCandidate);
  }

  async update(candidate: Candidate): Promise<Candidate> {
    const data = CandidateMapper.toPersistence(candidate);

    if (!candidate.id) {
      throw new Error('Cannot update a candidate without an ID');
    }

    const updatedCandidate = await this.prisma.candidate.update({
      where: { id: candidate.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        currentPosition: data.currentPosition,
        currentCompany: data.currentCompany,
        yearsOfExperience: data.yearsOfExperience,
        notes: data.notes,
      }
    });

    return CandidateMapper.toDomain(updatedCandidate);
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.candidate.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
} 