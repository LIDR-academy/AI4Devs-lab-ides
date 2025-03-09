import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { CandidateEntity } from '../entities/CandidateEntity';
import { Candidate } from '../../../domain/entities/Candidate';
import { CandidateRepository } from '../../../domain/repositories/CandidateRepository';

export class PostgresCandidateRepository implements CandidateRepository {
  private repository: Repository<CandidateEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(CandidateEntity);
  }

  async save(candidate: Candidate): Promise<Candidate> {
    const candidateEntity = new CandidateEntity();
    candidateEntity.name = candidate.name;
    candidateEntity.lastName = candidate.lastName;
    candidateEntity.email = candidate.email;
    candidateEntity.phone = candidate.phone;
    candidateEntity.address = candidate.address;
    candidateEntity.education = candidate.education;
    candidateEntity.workExperience = candidate.workExperience;
    candidateEntity.cvUrl = candidate.cvUrl;

    const savedEntity = await this.repository.save(candidateEntity);
    return this.toDomain(savedEntity);
  }

  async findByEmail(email: string): Promise<Candidate | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async findById(id: number): Promise<Candidate | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Candidate[]> {
    const entities = await this.repository.find();
    return entities.map(entity => this.toDomain(entity));
  }

  private toDomain(entity: CandidateEntity): Candidate {
    return new Candidate({
      id: entity.id,
      name: entity.name,
      lastName: entity.lastName,
      email: entity.email,
      phone: entity.phone,
      address: entity.address,
      education: entity.education,
      workExperience: entity.workExperience,
      cvUrl: entity.cvUrl
    });
  }
} 