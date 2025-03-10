import { Candidate } from '../../domain/entities/Candidate';
import { CandidateService } from '../../domain/services/CandidateService';
import { CreateCandidateDTO, CandidateResponseDTO } from '../dtos/CandidateDTO';

export class CreateCandidateUseCase {
  constructor(private readonly candidateService: CandidateService) {}

  async execute(candidateData: {
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
    direccion: string;
    educacion: string;
    experiencia: string;
    cvUrl: string;
  }): Promise<Candidate> {
    return this.candidateService.createCandidate(candidateData);
  }

  private async uploadCV(file: Express.Multer.File): Promise<string> {
    // Aquí iría la lógica para subir el archivo a un servicio de almacenamiento
    // Por ahora, solo retornamos una URL de ejemplo
    return `uploads/${file.filename}`;
  }
} 