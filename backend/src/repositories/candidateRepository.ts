import prisma from '../config/database';
import { Candidate, Education, WorkExperience } from '@prisma/client';
import { CreateEducationData, CreateWorkExperienceData } from '../dtos/candidateDto';

// Interfaz para los datos de creación de candidato
export interface CreateCandidateData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // Obligatorio
  address?: string;
  cvUrl: string;
  cvFileName?: string;
  education?: CreateEducationData[];
  workExperience?: CreateWorkExperienceData[];
}

// Interfaz para los datos de actualización de candidato
export interface UpdateCandidateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  cvUrl?: string;
  cvFileName?: string;
  education?: CreateEducationData[];
  workExperience?: CreateWorkExperienceData[];
}

// Interfaz para candidato con relaciones
export interface CandidateWithRelations extends Candidate {
  education?: Education[];
  workExperience?: WorkExperience[];
}

/**
 * Repositorio para operaciones CRUD de candidatos
 */
export class CandidateRepository {
  /**
   * Crear un nuevo candidato
   * @param data Datos del candidato
   * @returns El candidato creado
   */
  async create(data: CreateCandidateData): Promise<CandidateWithRelations> {
    try {
      // Preparar los datos de educación si existen
      const educationCreate = Array.isArray(data.education) 
        ? data.education.map(edu => ({
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: edu.startDate,
            endDate: edu.endDate,
            description: edu.description
          }))
        : [];

      // Preparar los datos de experiencia laboral si existen
      const workExperienceCreate = Array.isArray(data.workExperience)
        ? data.workExperience.map(exp => ({
            company: exp.company,
            position: exp.position,
            startDate: exp.startDate,
            endDate: exp.endDate,
            description: exp.description
          }))
        : [];

      // Crear el candidato con las relaciones
      const candidate = await prisma.candidate.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          cvUrl: data.cvUrl,
          cvFileName: data.cvFileName,
          ...(educationCreate.length > 0 && {
            education: {
              create: educationCreate
            }
          }),
          ...(workExperienceCreate.length > 0 && {
            workExperience: {
              create: workExperienceCreate
            }
          })
        },
        include: {
          education: true,
          workExperience: true
        }
      });

      return candidate;
    } catch (error) {
      console.error('Error creating candidate:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los candidatos
   * @returns Lista de candidatos
   */
  async findAll(): Promise<CandidateWithRelations[]> {
    return prisma.candidate.findMany({
      include: {
        education: true,
        workExperience: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Obtener un candidato por ID
   * @param id ID del candidato
   * @returns El candidato encontrado o null
   */
  async findById(id: number): Promise<CandidateWithRelations | null> {
    return prisma.candidate.findUnique({
      where: { id },
      include: {
        education: true,
        workExperience: true
      }
    });
  }

  /**
   * Obtener un candidato por email
   * @param email Email del candidato
   * @returns El candidato encontrado o null
   */
  async findByEmail(email: string): Promise<CandidateWithRelations | null> {
    return prisma.candidate.findUnique({
      where: { email },
      include: {
        education: true,
        workExperience: true
      }
    });
  }

  /**
   * Actualizar un candidato
   * @param id ID del candidato
   * @param data Datos a actualizar
   * @returns El candidato actualizado
   */
  async update(id: number, data: UpdateCandidateData): Promise<CandidateWithRelations> {
    try {
      // Primero obtenemos el candidato actual con sus relaciones
      const currentCandidate = await this.findById(id);
      
      if (!currentCandidate) {
        throw new Error(`Candidate with ID ${id} not found`);
      }

      // Actualizar las relaciones de educación si se proporcionan
      if (data.education && Array.isArray(data.education)) {
        await this.updateEducation(id, data.education);
      }

      // Actualizar las relaciones de experiencia laboral si se proporcionan
      if (data.workExperience && Array.isArray(data.workExperience)) {
        await this.updateWorkExperience(id, data.workExperience);
      }

      // Actualizar los datos básicos del candidato
      const updatedCandidate = await prisma.candidate.update({
        where: { id },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          cvUrl: data.cvUrl,
          cvFileName: data.cvFileName
        },
        include: {
          education: true,
          workExperience: true
        }
      });

      return updatedCandidate;
    } catch (error) {
      console.error(`Error updating candidate with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar un candidato
   * @param id ID del candidato
   * @returns El candidato eliminado
   */
  async delete(id: number): Promise<CandidateWithRelations> {
    return prisma.candidate.delete({
      where: { id },
      include: {
        education: true,
        workExperience: true
      }
    });
  }

  /**
   * Actualizar la educación de un candidato
   * @param candidateId ID del candidato
   * @param educationData Datos de educación
   */
  async updateEducation(candidateId: number, educationData: CreateEducationData[]): Promise<void> {
    // Verificar que educationData sea un array
    if (!Array.isArray(educationData)) {
      console.warn(`updateEducation called with non-array educationData for candidate ${candidateId}`);
      return;
    }
    
    // Obtener la educación actual
    const currentEducation = await prisma.education.findMany({
      where: { candidateId }
    });
    
    // Crear un mapa de IDs actuales
    const currentIds = new Set(currentEducation.map(edu => edu.id));
    
    // Identificar registros a crear, actualizar o eliminar
    const toCreate = educationData.filter(edu => !edu.id);
    const toUpdate = educationData.filter(edu => edu.id && currentIds.has(edu.id));
    const toDelete = currentEducation.filter(edu => !educationData.some(newEdu => newEdu.id === edu.id));
    
    // Ejecutar operaciones en una transacción
    await prisma.$transaction([
      // Eliminar registros que ya no existen
      ...toDelete.map(edu => 
        prisma.education.delete({ where: { id: edu.id } })
      ),
      
      // Actualizar registros existentes
      ...toUpdate.map(edu => 
        prisma.education.update({
          where: { id: edu.id },
          data: {
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: new Date(edu.startDate),
            endDate: edu.endDate ? new Date(edu.endDate) : null,
            description: edu.description
          }
        })
      ),
      
      // Crear nuevos registros
      ...toCreate.map(edu => 
        prisma.education.create({
          data: {
            candidateId,
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: new Date(edu.startDate),
            endDate: edu.endDate ? new Date(edu.endDate) : null,
            description: edu.description
          }
        })
      )
    ]);
  }

  /**
   * Actualizar la experiencia laboral de un candidato
   * @param candidateId ID del candidato
   * @param experienceData Datos de experiencia laboral
   */
  async updateWorkExperience(candidateId: number, experienceData: CreateWorkExperienceData[]): Promise<void> {
    // Verificar que experienceData sea un array
    if (!Array.isArray(experienceData)) {
      console.warn(`updateWorkExperience called with non-array experienceData for candidate ${candidateId}`);
      return;
    }
    
    // Obtener la experiencia laboral actual
    const currentExperience = await prisma.workExperience.findMany({
      where: { candidateId }
    });
    
    // Crear un mapa de IDs actuales
    const currentIds = new Set(currentExperience.map(exp => exp.id));
    
    // Identificar registros a crear, actualizar o eliminar
    const toCreate = experienceData.filter(exp => !exp.id);
    const toUpdate = experienceData.filter(exp => exp.id && currentIds.has(exp.id));
    const toDelete = currentExperience.filter(exp => !experienceData.some(newExp => newExp.id === exp.id));
    
    // Ejecutar operaciones en una transacción
    await prisma.$transaction([
      // Eliminar registros que ya no existen
      ...toDelete.map(exp => 
        prisma.workExperience.delete({ where: { id: exp.id } })
      ),
      
      // Actualizar registros existentes
      ...toUpdate.map(exp => 
        prisma.workExperience.update({
          where: { id: exp.id },
          data: {
            company: exp.company,
            position: exp.position,
            location: exp.location,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            description: exp.description
          }
        })
      ),
      
      // Crear nuevos registros
      ...toCreate.map(exp => 
        prisma.workExperience.create({
          data: {
            candidateId,
            company: exp.company,
            position: exp.position,
            location: exp.location,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            description: exp.description
          }
        })
      )
    ]);
  }
} 