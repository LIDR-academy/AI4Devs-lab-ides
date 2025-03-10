import { PrismaClient, WorkExperience } from '@prisma/client';

// Interfaz para los datos de experiencia laboral
export interface CreateWorkExperienceData {
  id?: number; // Para actualización
  company: string;
  position: string;
  location?: string;
  startDate: Date | string;
  endDate?: Date | string;
  description?: string;
}

/**
 * Servicio para la gestión de experiencia laboral de candidatos
 */
export class WorkExperienceService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Obtener todos los registros de experiencia laboral de un candidato
   * @param candidateId ID del candidato
   * @returns Lista de registros de experiencia laboral
   */
  async getWorkExperienceByCandidateId(candidateId: number): Promise<WorkExperience[]> {
    return this.prisma.workExperience.findMany({
      where: { candidateId },
      orderBy: { startDate: 'desc' }
    });
  }

  /**
   * Obtener un registro de experiencia laboral por ID
   * @param id ID del registro de experiencia laboral
   * @returns El registro de experiencia laboral o null si no existe
   */
  async getWorkExperienceById(id: number): Promise<WorkExperience | null> {
    return this.prisma.workExperience.findUnique({
      where: { id }
    });
  }

  /**
   * Crear un nuevo registro de experiencia laboral para un candidato
   * @param candidateId ID del candidato
   * @param data Datos del registro de experiencia laboral
   * @returns El registro de experiencia laboral creado
   */
  async createWorkExperience(candidateId: number, data: CreateWorkExperienceData): Promise<WorkExperience> {
    // Validar datos
    if (!data.company || !data.position || !data.startDate) {
      throw new Error('Empresa, posición y fecha de inicio son obligatorios');
    }

    // Verificar si el candidato existe
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId }
    });

    if (!candidate) {
      throw new Error('Candidato no encontrado');
    }

    // Crear el registro de experiencia laboral
    return this.prisma.workExperience.create({
      data: {
        candidateId,
        company: data.company,
        position: data.position,
        location: data.location,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description
      }
    });
  }

  /**
   * Actualizar un registro de experiencia laboral
   * @param id ID del registro de experiencia laboral
   * @param data Datos a actualizar
   * @returns El registro de experiencia laboral actualizado o null si no existe
   */
  async updateWorkExperience(id: number, data: CreateWorkExperienceData): Promise<WorkExperience | null> {
    // Verificar si el registro de experiencia laboral existe
    const workExperience = await this.prisma.workExperience.findUnique({
      where: { id }
    });

    if (!workExperience) {
      return null;
    }

    // Validar datos
    if (!data.company || !data.position || !data.startDate) {
      throw new Error('Empresa, posición y fecha de inicio son obligatorios');
    }

    // Actualizar el registro de experiencia laboral
    return this.prisma.workExperience.update({
      where: { id },
      data: {
        company: data.company,
        position: data.position,
        location: data.location,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description
      }
    });
  }

  /**
   * Eliminar un registro de experiencia laboral
   * @param id ID del registro de experiencia laboral
   * @returns El registro de experiencia laboral eliminado
   */
  async deleteWorkExperience(id: number): Promise<WorkExperience> {
    // Verificar si el registro de experiencia laboral existe
    const workExperience = await this.prisma.workExperience.findUnique({
      where: { id }
    });

    if (!workExperience) {
      throw new Error('Registro de experiencia laboral no encontrado');
    }

    // Eliminar el registro de experiencia laboral
    return this.prisma.workExperience.delete({
      where: { id }
    });
  }
} 