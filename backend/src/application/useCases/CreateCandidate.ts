import { Result } from '../../domain/shared/Result';
import { Candidate } from '../../domain/entities/Candidate';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { CreateCandidateDto } from '../../infrastructure/dtos/CreateCandidateDto';
import { IFileUploader } from '../../domain/services/IFileUploader';
import { CandidateRepository } from '../../domain/repositories/CandidateRepository';
import { FileUploader } from '../../domain/services/FileUploader';

export class CreateCandidateUseCase {
  constructor(
    private candidateRepository: CandidateRepository,
    private fileUploader: FileUploader
  ) {}

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async execute(data: any): Promise<Result<Candidate>> {
    try {
      console.log('CreateCandidateUseCase - Input data:', data);

      // Validar datos básicos
      if (!data.name || !data.lastName || !data.email) {
        return Result.fail({
          message: 'Faltan campos requeridos',
          details: {
            name: !data.name ? 'El nombre es requerido' : undefined,
            lastName: !data.lastName ? 'El apellido es requerido' : undefined,
            email: !data.email ? 'El email es requerido' : undefined
          }
        });
      }

      // Validar formato del email
      if (!this.isValidEmail(data.email)) {
        return Result.fail({
          message: 'El formato del email no es válido',
          details: {
            email: 'Debe ser un email válido (ejemplo@dominio.com)'
          }
        });
      }

      // Verificar si ya existe un candidato con ese email
      const existingCandidate = await this.candidateRepository.findByEmail(data.email);
      if (existingCandidate) {
        return Result.fail({
          message: 'Ya existe un candidato con ese email'
        });
      }

      // Crear el candidato
      const candidate = new Candidate({
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        education: data.education || [],
        workExperience: data.workExperience || []
      });

      // Subir el CV si existe
      if (data.file) {
        try {
          const cvUrl = await this.fileUploader.upload(data.file);
          candidate.cvUrl = cvUrl;
        } catch (error) {
          console.error('Error uploading CV:', error);
          return Result.fail({
            message: 'Error al subir el CV',
            details: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      // Guardar en la base de datos
      try {
        const savedCandidate = await this.candidateRepository.save(candidate);
        return Result.ok(savedCandidate);
      } catch (error) {
        console.error('Error saving candidate:', error);
        return Result.fail({
          message: 'Error al guardar el candidato en la base de datos',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } catch (error) {
      console.error('Unexpected error in CreateCandidateUseCase:', error);
      return Result.fail({
        message: 'Error inesperado al crear el candidato',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}