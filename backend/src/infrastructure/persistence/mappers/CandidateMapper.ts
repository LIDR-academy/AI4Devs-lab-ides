import { Candidate } from '../../../domain/models/Candidate';
import { SkillMapper } from './SkillMapper';
import { EducationMapper } from './EducationMapper';
import { WorkExperienceMapper } from './WorkExperienceMapper';
import { DocumentMapper } from './DocumentMapper';
import { TagMapper } from './TagMapper';

export class CandidateMapper {
  static toDomain(prismaCandidate: any): Candidate {
    const candidate = Candidate.create({
      id: prismaCandidate.id,
      firstName: prismaCandidate.firstName,
      lastName: prismaCandidate.lastName,
      email: prismaCandidate.email,
      phone: prismaCandidate.phone,
      address: prismaCandidate.address || undefined,
      city: prismaCandidate.city || undefined,
      state: prismaCandidate.state || undefined,
      postalCode: prismaCandidate.postalCode || undefined,
      country: prismaCandidate.country || undefined,
      currentPosition: prismaCandidate.currentPosition || undefined,
      currentCompany: prismaCandidate.currentCompany || undefined,
      yearsOfExperience: prismaCandidate.yearsOfExperience || undefined,
      notes: prismaCandidate.notes || undefined,
      createdAt: prismaCandidate.createdAt,
      updatedAt: prismaCandidate.updatedAt
    });

    return candidate;
  }

  static toPersistence(candidate: Candidate): any {
    return {
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      address: candidate.address,
      city: candidate.city,
      state: candidate.state,
      postalCode: candidate.postalCode,
      country: candidate.country,
      currentPosition: candidate.currentPosition,
      currentCompany: candidate.currentCompany,
      yearsOfExperience: candidate.yearsOfExperience,
      notes: candidate.notes,
    };
  }
} 