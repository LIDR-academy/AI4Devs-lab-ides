import prisma from '../index';
import { CandidateInput, SkillInput } from '../types/candidate';
import { PrismaClient } from '@prisma/client';

/**
 * Servicio para manejar operaciones relacionadas con candidatos
 */
export class CandidateService {
  /**
   * Crea un nuevo candidato en la base de datos
   * @param candidateData Datos del candidato a crear
   * @returns El candidato creado
   */
  async createCandidate(candidateData: CandidateInput): Promise<any> {
    const { education = [], workExperience = [], skills = [], ...candidateInfo } = candidateData;

    // Crear el candidato con sus relaciones en una transacción
    return prisma.$transaction(async (tx) => {
      // Crear el candidato
      const candidate = await tx.candidate.create({
        data: {
          ...candidateInfo,
        },
      });

      // Procesar educación
      if (education.length > 0) {
        await tx.education.createMany({
          data: education.map(edu => ({
            ...edu,
            candidateId: candidate.id,
          })),
        });
      }

      // Procesar experiencia laboral
      if (workExperience.length > 0) {
        await tx.workExperience.createMany({
          data: workExperience.map(exp => ({
            ...exp,
            candidateId: candidate.id,
          })),
        });
      }

      // Procesar habilidades
      if (skills.length > 0) {
        await Promise.all(
          skills.map(async (skillData: SkillInput) => {
            // Buscar o crear la habilidad
            const skill = await tx.skill.upsert({
              where: { name: skillData.name },
              update: {},
              create: { name: skillData.name },
            });

            // Crear la relación entre candidato y habilidad
            await tx.candidateSkill.create({
              data: {
                candidateId: candidate.id,
                skillId: skill.id,
                proficiencyLevel: skillData.proficiencyLevel || 'INTERMEDIATE',
              },
            });
          })
        );
      }

      // Retornar el candidato creado con todas sus relaciones
      return tx.candidate.findUnique({
        where: { id: candidate.id },
        include: {
          education: true,
          workExperience: true,
          skills: {
            include: {
              skill: true,
            },
          },
        },
      });
    });
  }

  /**
   * Guarda la ruta del CV de un candidato
   * @param candidateId ID del candidato
   * @param filePath Ruta del archivo CV
   * @returns El candidato actualizado
   */
  async saveCvFilePath(candidateId: number, filePath: string): Promise<any> {
    return prisma.candidate.update({
      where: { id: candidateId },
      data: { cvFilePath: filePath },
    });
  }

  /**
   * Verifica si un email ya está registrado
   * @param email Email a verificar
   * @returns true si el email ya existe, false en caso contrario
   */
  async emailExists(email: string): Promise<boolean> {
    try {
      const count = await prisma.candidate.count({
        where: { email },
      });
      return count > 0;
    } catch (error) {
      console.error('Error al verificar email:', error);
      return false;
    }
  }
} 