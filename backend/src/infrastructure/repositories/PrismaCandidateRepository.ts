import { PrismaClient } from '@prisma/client';
import { Candidate } from '../../domain/entities/Candidate';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { IEncryptionService } from '../../domain/services/IEncryptionService';

const prisma = new PrismaClient();

export class PrismaCandidateRepository implements ICandidateRepository {
  constructor(private encryptionService: IEncryptionService) {}

  async create(candidate: Candidate): Promise<Candidate> {
    const result = await prisma.candidate.create({
      data: {
        id: candidate.id,
        nombre: candidate.nombre,
        apellido: candidate.apellido,
        correo: candidate.correo,
        telefono: candidate.telefono,
        direccion: candidate.direccion,
        educacion: candidate.educacion,
        experiencia: candidate.experiencia,
        cvUrl: candidate.cvUrl || ''
      }
    });

    return new Candidate(
      result.id,
      result.nombre,
      result.apellido,
      await this.encryptionService.decrypt(result.correo),
      await this.encryptionService.decrypt(result.telefono),
      await this.encryptionService.decrypt(result.direccion),
      result.educacion,
      result.experiencia,
      result.cvUrl,
      result.createdAt,
      result.updatedAt
    );
  }

  async findByEmail(email: string): Promise<Candidate | null> {
    const result = await prisma.candidate.findUnique({
      where: { correo: email }
    });

    if (!result) return null;

    return new Candidate(
      result.id,
      result.nombre,
      result.apellido,
      result.correo,
      result.telefono,
      result.direccion,
      result.educacion,
      result.experiencia,
      result.cvUrl,
      result.createdAt,
      result.updatedAt
    );
  }

  async findById(id: string): Promise<Candidate | null> {
    const result = await prisma.candidate.findUnique({
      where: { id }
    });

    if (!result) return null;

    return new Candidate(
      result.id,
      result.nombre,
      result.apellido,
      await this.encryptionService.decrypt(result.correo),
      await this.encryptionService.decrypt(result.telefono),
      await this.encryptionService.decrypt(result.direccion),
      result.educacion,
      result.experiencia,
      result.cvUrl,
      result.createdAt,
      result.updatedAt
    );
  }

  async findAll(): Promise<Candidate[]> {
    const results = await prisma.candidate.findMany();
    
    return Promise.all(results.map(async result => 
      new Candidate(
        result.id,
        result.nombre,
        result.apellido,
        result.correo, // await this.encryptionService.decrypt(result.correo),
        result.telefono, // await this.encryptionService.decrypt(result.telefono),
        result.direccion, // await this.encryptionService.decrypt(result.direccion),
        result.educacion,
        result.experiencia,
        result.cvUrl,
        result.createdAt,
        result.updatedAt
      )
    ));
  }
}