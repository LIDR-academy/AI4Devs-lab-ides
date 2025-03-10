import { CandidateService } from '../../domain/services/CandidateService';
import { CreateCandidateDTO, CandidateResponseDTO } from '../dtos/CandidateDTO';

export class CreateCandidateUseCase {
  constructor(private readonly candidateService: CandidateService) {}

  async execute(dto: CreateCandidateDTO): Promise<CandidateResponseDTO> {
    const cvUrl = await this.uploadCV(dto.cv);
    
    const candidate = await this.candidateService.createCandidate({
      ...dto,
      cvUrl
    });

    return {
      id: candidate.id,
      nombre: candidate.nombre,
      apellido: candidate.apellido,
      correo: candidate.correo,
      telefono: candidate.telefono,
      direccion: candidate.direccion,
      educacion: candidate.educacion,
      experiencia: candidate.experiencia,
      cvUrl: candidate.cvUrl,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt
    };
  }

  private async uploadCV(file: Express.Multer.File): Promise<string> {
    // Aquí iría la lógica para subir el archivo a un servicio de almacenamiento
    // Por ahora, solo retornamos una URL de ejemplo
    return `uploads/${file.filename}`;
  }
} 