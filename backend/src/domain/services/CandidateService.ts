import { Candidate } from '../entities/Candidate';
import { ICandidateRepository } from '../repositories/ICandidateRepository';
import { IEncryptionService } from '../services/IEncryptionService';

export class CandidateService {
  constructor(
    private readonly candidateRepository: ICandidateRepository,
    private readonly encryptionService: IEncryptionService
  ) {}

  async createCandidate(candidateData: {
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
    direccion: string;
    educacion: string;
    experiencia: string;
    cvUrl: string;
  }): Promise<Candidate> {
    const existingCandidate = await this.candidateRepository.findByEmail(candidateData.correo);
    if (existingCandidate) {
      throw new Error('Ya existe un candidato con este correo electrónico');
    }

    const candidate = await Candidate.create(candidateData, this.encryptionService);
    return this.candidateRepository.create(candidate);
  }
} 