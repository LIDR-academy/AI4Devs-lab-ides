import prisma from '../config/database';

// Interfaz para los datos de educación
export interface CreateEducationData {
  candidateId: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date | null;
  description?: string;
}

export interface UpdateEducationData {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: Date;
  endDate?: Date | null;
  description?: string;
}

/**
 * Servicio para la gestión de educación de candidatos
 */
export class EducationService {
  /**
   * Crear un nuevo registro de educación para un candidato
   * @param data Datos de educación con candidateId
   */
  async createEducation(data: CreateEducationData) {
    const { candidateId, ...educationData } = data;
    
    // Verificar si el candidato existe
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId }
    });

    if (!candidate) {
      throw new Error('Candidato no encontrado');
    }

    // Crear el registro de educación
    return prisma.education.create({
      data: {
        ...educationData,
        candidate: {
          connect: { id: candidateId }
        }
      }
    });
  }

  /**
   * Obtener un registro de educación por ID
   */
  async getEducationById(id: number) {
    return prisma.education.findUnique({
      where: { id }
    });
  }

  /**
   * Actualizar un registro de educación
   */
  async updateEducation(id: number, data: UpdateEducationData) {
    // Verificar si el registro existe
    const education = await prisma.education.findUnique({
      where: { id }
    });

    if (!education) {
      return null;
    }

    // Actualizar el registro
    return prisma.education.update({
      where: { id },
      data
    });
  }

  /**
   * Eliminar un registro de educación
   */
  async deleteEducation(id: number) {
    // Verificar si el registro existe
    const education = await prisma.education.findUnique({
      where: { id }
    });

    if (!education) {
      return false;
    }

    // Eliminar el registro
    await prisma.education.delete({
      where: { id }
    });

    return true;
  }

  /**
   * Obtener todos los registros de educación de un candidato
   */
  async getEducationByCandidateId(candidateId: number) {
    return prisma.education.findMany({
      where: {
        candidateId
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  }
} 