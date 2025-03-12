import { PrismaClient } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import logger from '../config/logger';
import fs from 'fs';

const prisma = new PrismaClient();

// Interfaz para los datos del candidato recibidos del frontend
export interface CandidateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  education: EducationInput[];
  workExperience: WorkExperienceInput[];
  cvFilePath?: string;
}

// Interfaces para los datos de educación y experiencia laboral
interface EducationInput {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  description?: string;
}

interface WorkExperienceInput {
  company: string;
  position: string;
  location?: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  description?: string;
}

// Servicio para manejar operaciones relacionadas con candidatos
export class CandidateService {
  /**
   * Crea un nuevo candidato en la base de datos
   */
  async createCandidate(candidateData: CandidateInput): Promise<any> {
    try {
      logger.info(`Creando nuevo candidato: ${candidateData.firstName} ${candidateData.lastName}`);
      
      // Verificar si ya existe un candidato con el mismo email
      const existingCandidate = await prisma.candidate.findUnique({
        where: { email: candidateData.email }
      });
      
      if (existingCandidate) {
        logger.warn(`Intento de crear candidato con email duplicado: ${candidateData.email}`);
        const error: AppError = new Error('Ya existe un candidato con este email');
        error.statusCode = 409;
        throw error;
      }
      
      // Crear el candidato con sus relaciones en una transacción
      const candidate = await prisma.$transaction(async (tx) => {
        // Crear el candidato
        const newCandidate = await tx.candidate.create({
          data: {
            firstName: candidateData.firstName,
            lastName: candidateData.lastName,
            email: candidateData.email,
            phone: candidateData.phone,
            address: candidateData.address,
            cvFilePath: candidateData.cvFilePath
          }
        });
        
        // Crear las entradas de educación
        for (const edu of candidateData.education) {
          await tx.education.create({
            data: {
              institution: edu.institution,
              degree: edu.degree,
              fieldOfStudy: edu.fieldOfStudy,
              startDate: new Date(edu.startDate),
              endDate: edu.endDate ? new Date(edu.endDate) : null,
              description: edu.description,
              candidateId: newCandidate.id
            }
          });
        }
        
        // Crear las entradas de experiencia laboral
        for (const exp of candidateData.workExperience) {
          await tx.workExperience.create({
            data: {
              company: exp.company,
              position: exp.position,
              location: exp.location,
              startDate: new Date(exp.startDate),
              endDate: exp.endDate ? new Date(exp.endDate) : null,
              description: exp.description,
              candidateId: newCandidate.id
            }
          });
        }
        
        return newCandidate;
      });
      
      logger.info(`Candidato creado exitosamente con ID: ${candidate.id}`);
      return candidate;
    } catch (error) {
      // Si es un error personalizado, lo propagamos
      if ((error as AppError).statusCode) {
        throw error;
      }
      
      // Si es un error de Prisma, lo manejamos
      logger.error('Error al crear candidato:', { error });
      const appError: AppError = new Error('Error al crear el candidato');
      appError.statusCode = 500;
      throw appError;
    }
  }
  
  /**
   * Obtiene los candidatos recientes (los últimos 3 añadidos)
   */
  async getRecentCandidates(limit: number = 3): Promise<any> {
    try {
      logger.info(`Obteniendo los ${limit} candidatos más recientes`);
      
      const candidates = await prisma.candidate.findMany({
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          createdAt: true,
          // Incluir la educación más reciente
          education: {
            select: {
              institution: true,
              degree: true,
              startDate: true,
              endDate: true
            },
            take: 1,
            orderBy: {
              startDate: 'desc'
            }
          },
          // Incluir la experiencia laboral más reciente
          workExperience: {
            select: {
              company: true,
              position: true,
              startDate: true,
              endDate: true
            },
            take: 1,
            orderBy: {
              startDate: 'desc'
            }
          }
        }
      });
      
      logger.info(`Se encontraron ${candidates.length} candidatos recientes`);
      return candidates;
    } catch (error) {
      logger.error('Error al obtener candidatos recientes:', { error });
      throw error;
    }
  }
  
  /**
   * Obtiene todos los candidatos con paginación
   */
  async getAllCandidates(page: number = 1, limit: number = 10): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      
      // Obtener el total de candidatos para la paginación
      const totalCount = await prisma.candidate.count();
      
      // Obtener los candidatos con paginación
      const candidates = await prisma.candidate.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          createdAt: true,
          // No incluimos datos sensibles como dirección completa o CV
          // Solo incluimos un resumen de educación y experiencia
          education: {
            select: {
              institution: true,
              degree: true,
              startDate: true,
              endDate: true
            },
            take: 1, // Solo la educación más reciente
            orderBy: {
              startDate: 'desc'
            }
          },
          workExperience: {
            select: {
              company: true,
              position: true,
              startDate: true,
              endDate: true
            },
            take: 1, // Solo la experiencia más reciente
            orderBy: {
              startDate: 'desc'
            }
          }
        }
      });
      
      // Calcular metadatos de paginación
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      
      return {
        candidates,
        pagination: {
          totalCount,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage,
          hasPrevPage
        }
      };
    } catch (error) {
      logger.error('Error al obtener candidatos:', { error });
      throw error;
    }
  }
  
  /**
   * Obtiene un candidato por su ID con sus relaciones
   */
  async getCandidateById(id: number): Promise<any> {
    try {
      const candidate = await prisma.candidate.findUnique({
        where: { id },
        include: {
          education: true,
          workExperience: true
        }
      });
      
      return candidate;
    } catch (error) {
      logger.error(`Error al obtener candidato con ID ${id}:`, { error });
      throw error;
    }
  }
  
  /**
   * Elimina un archivo CV si existe
   */
  async deleteCV(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info(`Archivo CV eliminado: ${filePath}`);
      }
    } catch (error) {
      logger.error(`Error al eliminar archivo CV: ${filePath}`, { error });
      // No propagamos el error para no interrumpir el flujo principal
    }
  }
}

export default new CandidateService(); 