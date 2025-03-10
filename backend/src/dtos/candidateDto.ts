import prisma from '../config/database';
import { Candidate, Education, WorkExperience, Prisma } from '@prisma/client';

// DTO para crear un candidato
export interface CreateEducationData {
  id?: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date | null;
  description?: string;
}

export interface CreateWorkExperienceData {
  id?: number;
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate: Date | null;
  description?: string;
}

export interface CreateCandidateData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  cvUrl: string;
  cvFileName?: string;
  education?: CreateEducationData[];
  workExperience?: CreateWorkExperienceData[];
}

// DTO para actualizar un candidato
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
    // Extraer datos de educación y experiencia laboral
    const { education, workExperience, ...candidateData } = data;
    
    // Crear el candidato con sus relaciones
    return prisma.candidate.create({
      data: {
        ...candidateData,
        education: education ? {
          create: education.map(edu => ({
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: edu.startDate,
            endDate: edu.endDate,
            description: edu.description
          }))
        } : undefined,
        workExperience: workExperience ? {
          create: workExperience.map(exp => ({
            company: exp.company,
            position: exp.position,
            location: exp.location,
            startDate: exp.startDate,
            endDate: exp.endDate,
            description: exp.description
          }))
        } : undefined
      },
      include: {
        education: true,
        workExperience: true
      }
    });
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
    // Extraer datos de educación y experiencia laboral
    const { education, workExperience, ...candidateData } = data;
    
    // Actualizar el candidato y sus relaciones
    return prisma.candidate.update({
      where: { id },
      data: {
        ...candidateData
      },
      include: {
        education: true,
        workExperience: true
      }
    });
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
            startDate: edu.startDate,
            endDate: edu.endDate,
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
            startDate: edu.startDate,
            endDate: edu.endDate,
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
            startDate: exp.startDate,
            endDate: exp.endDate,
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
            startDate: exp.startDate,
            endDate: exp.endDate,
            description: exp.description
          }
        })
      )
    ]);
  }
}

// Convertir DTO a modelo Prisma para crear
export const toPrismaCreateModel = (data: CreateCandidateData): Prisma.CandidateCreateInput => {
  const { education, workExperience, ...rest } = data;
  
  return {
    ...rest,
    education: education ? {
      create: education.map(edu => ({
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        startDate: edu.startDate,
        endDate: edu.endDate,
        description: edu.description
      }))
    } : undefined,
    workExperience: workExperience ? {
      create: workExperience.map(exp => ({
        company: exp.company,
        position: exp.position,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description
      }))
    } : undefined
  };
};

// Convertir DTO a modelo Prisma para actualizar
export const toPrismaUpdateModel = (data: UpdateCandidateData): Prisma.CandidateUpdateInput => {
  const { education, workExperience, ...rest } = data;
  
  return {
    ...rest,
    education: education ? {
      deleteMany: {},
      create: education.map(edu => ({
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        startDate: edu.startDate,
        endDate: edu.endDate,
        description: edu.description
      }))
    } : undefined,
    workExperience: workExperience ? {
      deleteMany: {},
      create: workExperience.map(exp => ({
        company: exp.company,
        position: exp.position,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description
      }))
    } : undefined
  };
};