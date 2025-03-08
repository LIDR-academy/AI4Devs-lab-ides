import { Candidate } from '../../../domain/models/Candidate';
import { ICandidateRepository } from '../../../domain/repositories/ICandidateRepository';
import { createOperationalError } from '../../../interfaces/http/middleware/errorHandlerMiddleware';
import { deepSanitize } from '../../../interfaces/http/middleware/sanitizationMiddleware';

// Interfaz simplificada para los datos de entrada
export interface CreateCandidateDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  currentPosition?: string;
  currentCompany?: string;
  yearsOfExperience?: number;
  notes?: string;
  skills?: any[];
  educations?: any[];
  experiences?: any[];
  tags?: any[];
  cv?: any;
}

export class CreateCandidateUseCase {
  constructor(
    private candidateRepository: ICandidateRepository
  ) {}

  async execute(data: CreateCandidateDTO): Promise<Candidate> {
    // Sanitizar los datos de entrada para prevenir XSS
    const sanitizedData = deepSanitize(data);
    
    // Verificar si ya existe un candidato con el mismo email
    const existingCandidate = await this.candidateRepository.findByEmail(sanitizedData.email);
    if (existingCandidate) {
      // Usamos un error operacional con un mensaje genérico para evitar revelar información sensible
      throw createOperationalError(
        'Ya existe un candidato con este correo electrónico', 
        409, 
        'EMAIL_EXISTS'
      );
    }

    // Crear el candidato
    const candidate = Candidate.create({
      firstName: sanitizedData.firstName,
      lastName: sanitizedData.lastName,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      address: sanitizedData.address,
      city: sanitizedData.city,
      state: sanitizedData.state,
      postalCode: sanitizedData.postalCode,
      country: sanitizedData.country,
      currentPosition: sanitizedData.currentPosition,
      currentCompany: sanitizedData.currentCompany,
      yearsOfExperience: sanitizedData.yearsOfExperience,
      notes: sanitizedData.notes
    });

    // Validar candidato
    if (!candidate.isValid()) {
      throw createOperationalError(
        'Los datos del candidato no son válidos',
        400,
        'VALIDATION_ERROR'
      );
    }

    // Guardar el candidato en la base de datos
    const savedCandidate = await this.candidateRepository.save(candidate);

    // Retornar el candidato guardado
    return savedCandidate;
  }
} 