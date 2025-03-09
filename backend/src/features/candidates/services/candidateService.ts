import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../../../utils/AppError';
import { 
  CreateCandidateInput, 
  UpdateCandidateInput, 
  SearchCandidateInput 
} from '../../../schemas/candidateSchema';
import { ServiceResponse } from '../../auth/types';
import { PaginationParams } from '../../../middlewares/paginationMiddleware';
import { createPaginatedResponse, PaginatedResponse } from '../../../utils/paginationUtils';
import { withTransaction } from '../../../utils/transactionUtils';

/**
 * Servicio para manejar las operaciones de candidatos
 */
export class CandidateService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Obtiene todos los candidatos con paginación y filtros
   */
  async getAllCandidates(
    searchParams: any,
    pagination: PaginationParams
  ): Promise<ServiceResponse<PaginatedResponse<any>>> {
    try {
      const {
        query,
        status,
        location,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = searchParams;

      // Construir el filtro base
      const where: any = {};

      // Filtrar por estado si se proporciona
      if (status) {
        where.status = status;
      }

      // Filtrar por ubicación si se proporciona
      if (location) {
        where.location = {
          contains: location,
          mode: 'insensitive',
        };
      }

      // Filtrar por búsqueda general si se proporciona
      if (query) {
        where.OR = [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ];
      }

      // Construir el orden
      const orderBy: any = {};
      orderBy[sortBy] = sortOrder;

      // Obtener los candidatos con paginación
      const candidates = await this.prisma.candidate.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy,
        include: {
          education: true,
          experience: true,
          documents: true,
        },
      });

      // Obtener el total de candidatos para la paginación
      const total = await this.prisma.candidate.count({ where });

      // Crear la respuesta paginada
      const paginatedResponse = createPaginatedResponse(candidates, total, pagination);

      return {
        success: true,
        statusCode: 200,
        data: paginatedResponse,
      };
    } catch (error) {
      console.error('Error en getAllCandidates:', error);
      
      if (error instanceof AppError) {
        return {
          success: false,
          statusCode: error.statusCode,
          error: error.message,
        };
      }
      
      return {
        success: false,
        statusCode: 500,
        error: 'Error al obtener los candidatos',
      };
    }
  }

  /**
   * Obtiene un candidato por su ID
   */
  async getCandidateById(id: number): Promise<ServiceResponse<any>> {
    try {
      // Obtener el candidato con sus relaciones
      const candidate = await this.prisma.candidate.findUnique({
        where: { id },
        include: {
          education: true,
          experience: true,
          documents: true,
          skills: true,
        },
      });

      if (!candidate) {
        return {
          success: false,
          statusCode: 404,
          error: 'Candidato no encontrado',
        };
      }

      // Transformar las habilidades a un array de strings
      const skills = candidate.skills.map(skill => skill.name);

      // Devolver el candidato con sus relaciones
      return {
        success: true,
        statusCode: 200,
        data: {
          ...candidate,
          skills: skills,
        },
      };
    } catch (error) {
      console.error('Error en getCandidateById:', error);
      
      return {
        success: false,
        statusCode: 500,
        error: 'Error al obtener el candidato',
      };
    }
  }

  /**
   * Crea un nuevo candidato
   */
  async createCandidate(candidateData: any): Promise<ServiceResponse<any>> {
    try {
      console.log('Datos recibidos para crear candidato:', candidateData);
      
      // Extraer los datos de educación, experiencia laboral y habilidades
      const { 
        education: educationData = [], 
        workExperience: workExperienceData = [], 
        skills: skillsData = [],
        ...candidateInfo 
      } = candidateData;
      
      // Si hay un campo summary, añadirlo a las notas
      let notesContent = candidateData.notes || '';
      if (candidateData.summary) {
        notesContent = `${candidateData.summary}\n\n${notesContent}`.trim();
      }
      
      // Usar transacción para garantizar la atomicidad
      const result = await withTransaction(this.prisma, async (tx) => {
        // Verificar que el reclutador existe
        if (candidateInfo.recruiterId) {
          const recruiter = await tx.user.findUnique({
            where: { id: candidateInfo.recruiterId }
          });
          
          if (!recruiter) {
            throw new AppError('Reclutador no encontrado', 404, 'RECRUITER_NOT_FOUND');
          }
        }

        // Crear el candidato con solo los campos que están definidos en el modelo
        const newCandidate = await tx.candidate.create({
          data: {
            firstName: candidateInfo.firstName,
            lastName: candidateInfo.lastName,
            email: candidateInfo.email,
            phone: candidateInfo.phone || '',
            address: candidateInfo.address || '',
            status: candidateInfo.status || 'new',
            notes: notesContent, // Guardar las notas
            dataConsent: candidateInfo.dataConsent || false,
            recruiterId: candidateInfo.recruiterId || 2,
          },
        });

        console.log('Candidato creado:', newCandidate);

        // Crear los registros de educación
        if (Array.isArray(educationData) && educationData.length > 0) {
          console.log('Creando registros de educación:', JSON.stringify(educationData, null, 2));
          
          for (const education of educationData) {
            console.log('Creando registro de educación:', JSON.stringify(education, null, 2));
            try {
              const createdEducation = await tx.education.create({
                data: {
                  institution: education.institution,
                  degree: education.degree,
                  fieldOfStudy: education.field || '',
                  startDate: new Date(education.startDate),
                  endDate: education.endDate ? new Date(education.endDate) : null,
                  description: education.description || '',
                  candidateId: newCandidate.id
                }
              });
              console.log('Registro de educación creado:', createdEducation);
            } catch (error) {
              console.error('Error al crear registro de educación:', error);
              throw error;
            }
          }
        } else {
          console.log('No hay registros de educación para crear');
        }

        // Crear los registros de experiencia laboral
        if (Array.isArray(workExperienceData) && workExperienceData.length > 0) {
          console.log('Creando registros de experiencia laboral:', JSON.stringify(workExperienceData, null, 2));
          
          for (const experience of workExperienceData) {
            console.log('Creando registro de experiencia laboral:', JSON.stringify(experience, null, 2));
            try {
              const createdExperience = await tx.workExperience.create({
                data: {
                  company: experience.company,
                  position: experience.position,
                  startDate: new Date(experience.startDate),
                  endDate: experience.endDate ? new Date(experience.endDate) : null,
                  description: experience.description || '',
                  candidateId: newCandidate.id
                }
              });
              console.log('Registro de experiencia laboral creado:', createdExperience);
            } catch (error) {
              console.error('Error al crear registro de experiencia laboral:', error);
              throw error;
            }
          }
        } else {
          console.log('No hay registros de experiencia laboral para crear');
        }

        // Crear los registros de habilidades
        if (Array.isArray(skillsData) && skillsData.length > 0) {
          console.log('Creando registros de habilidades:', JSON.stringify(skillsData, null, 2));
          
          for (const skill of skillsData) {
            if (typeof skill === 'string' && skill.trim() !== '') {
              try {
                const createdSkill = await tx.candidateSkill.create({
                  data: {
                    name: skill.trim(),
                    candidateId: newCandidate.id
                  }
                });
                console.log('Registro de habilidad creado:', createdSkill);
              } catch (error: any) {
                // Si la habilidad ya existe para este candidato, ignorar el error
                if (error.code !== 'P2002') {
                  console.error('Error al crear registro de habilidad:', error);
                  throw error;
                }
              }
            }
          }
        } else {
          console.log('No hay registros de habilidades para crear');
        }

        // Obtener el candidato completo con sus relaciones
        const candidateWithRelations = await tx.candidate.findUnique({
          where: { id: newCandidate.id },
          include: {
            education: true,
            experience: true,
            documents: true,
            skills: true,
          },
        });

        return {
          candidate: candidateWithRelations,
          additionalData: {
            summary: candidateInfo.summary || '',
            status: candidateInfo.status || 'active',
          }
        };
      });

      // Transformar las habilidades a un array de strings
      const skills = result.candidate?.skills?.map(skill => skill.name) || [];

      return {
        success: true,
        statusCode: 201,
        data: {
          ...result.candidate,
          summary: result.additionalData.summary,
          status: result.additionalData.status,
          skills: skills,
        },
      };
    } catch (error) {
      console.error('Error en createCandidate:', error);
      
      if (error instanceof AppError) {
        return {
          success: false,
          statusCode: error.statusCode,
          error: error.message,
        };
      }
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Manejar errores específicos de Prisma
        if (error.code === 'P2002') {
          return {
            success: false,
            statusCode: 400,
            error: 'Ya existe un candidato con ese email',
          };
        }
      }
      
      return {
        success: false,
        statusCode: 500,
        error: 'Error al crear el candidato',
      };
    }
  }

  /**
   * Actualiza un candidato existente
   */
  async updateCandidate(id: number, candidateData: UpdateCandidateInput): Promise<ServiceResponse<any>> {
    try {
      // Verificar si el candidato existe
      const existingCandidate = await this.prisma.candidate.findUnique({
        where: { id },
      });

      if (!existingCandidate) {
        return {
          success: false,
          statusCode: 404,
          error: 'Candidato no encontrado',
        };
      }

      // Usar transacción para garantizar la atomicidad
      const candidate = await withTransaction(this.prisma, async (tx) => {
        // Extraer las relaciones para actualizar por separado
        const { education, workExperience, documents, skills, ...candidateInfo } = candidateData;

        // Si hay un campo summary, añadirlo a las notas
        if (candidateInfo.summary && candidateInfo.notes) {
          candidateInfo.notes = `${candidateInfo.summary}\n\n${candidateInfo.notes}`.trim();
        } else if (candidateInfo.summary) {
          candidateInfo.notes = candidateInfo.summary;
        }

        // Actualizar el candidato (solo los campos básicos, sin relaciones)
        const updatedCandidate = await tx.candidate.update({
          where: { id },
          data: candidateInfo as any, // Usar 'as any' para evitar errores de tipo
        });

        // Actualizar las experiencias laborales si se proporcionan
        if (workExperience) {
          // Eliminar las experiencias existentes
          await tx.workExperience.deleteMany({
            where: { candidateId: id },
          });

          // Crear las nuevas experiencias
          for (const exp of workExperience) {
            await tx.workExperience.create({
              data: {
                company: exp.company,
                position: exp.position,
                startDate: new Date(exp.startDate),
                endDate: exp.endDate ? new Date(exp.endDate) : null,
                description: exp.description || '',
                candidateId: id,
              },
            });
          }
        }

        // Actualizar la educación si se proporciona
        if (education) {
          // Eliminar la educación existente
          await tx.education.deleteMany({
            where: { candidateId: id },
          });

          // Crear la nueva educación
          for (const edu of education) {
            await tx.education.create({
              data: {
                institution: edu.institution,
                degree: edu.degree,
                fieldOfStudy: edu.field || '',
                startDate: new Date(edu.startDate),
                endDate: edu.endDate ? new Date(edu.endDate) : null,
                description: edu.description || '',
                candidateId: id,
              },
            });
          }
        }

        // Actualizar las habilidades si se proporcionan
        if (skills) {
          // Eliminar las habilidades existentes
          await tx.candidateSkill.deleteMany({
            where: { candidateId: id },
          });

          // Crear las nuevas habilidades
          for (const skillItem of skills as any[]) {
            const skillName = typeof skillItem === 'string' ? skillItem : skillItem.name;
            if (skillName && typeof skillName === 'string' && skillName.trim() !== '') {
              try {
                await tx.candidateSkill.create({
                  data: {
                    name: skillName.trim(),
                    candidateId: id
                  }
                });
              } catch (error: any) {
                // Si la habilidad ya existe para este candidato, ignorar el error
                if (error.code !== 'P2002') {
                  console.error('Error al crear registro de habilidad:', error);
                  throw error;
                }
              }
            }
          }
        }

        // Obtener el candidato actualizado con todas sus relaciones
        return await tx.candidate.findUnique({
          where: { id },
          include: {
            education: true,
            experience: true,
            documents: true,
            skills: true,
          },
        });
      });

      // Transformar las habilidades a un array de strings
      const skills = candidate?.skills?.map(skill => skill.name) || [];

      return {
        success: true,
        statusCode: 200,
        data: {
          ...candidate,
          skills: skills,
        },
      };
    } catch (error) {
      console.error('Error en updateCandidate:', error);
      
      if (error instanceof AppError) {
        return {
          success: false,
          statusCode: error.statusCode,
          error: error.message,
        };
      }
      
      return {
        success: false,
        statusCode: 500,
        error: 'Error al actualizar el candidato',
      };
    }
  }

  /**
   * Elimina un candidato
   */
  async deleteCandidate(id: number): Promise<ServiceResponse<any>> {
    try {
      // Verificar si el candidato existe
      const existingCandidate = await this.prisma.candidate.findUnique({
        where: { id },
      });

      if (!existingCandidate) {
        return {
          success: false,
          statusCode: 404,
          error: 'Candidato no encontrado',
        };
      }

      // Usar transacción para garantizar la atomicidad
      await withTransaction(this.prisma, async (tx) => {
        // Eliminar el candidato (las relaciones se eliminarán automáticamente por la configuración onDelete: Cascade)
        await tx.candidate.delete({
          where: { id },
        });
      });

      return {
        success: true,
        statusCode: 200,
        data: null,
      };
    } catch (error) {
      console.error('Error en deleteCandidate:', error);
      
      if (error instanceof AppError) {
        return {
          success: false,
          statusCode: error.statusCode,
          error: error.message,
        };
      }
      
      return {
        success: false,
        statusCode: 500,
        error: 'Error al eliminar el candidato',
      };
    }
  }
} 