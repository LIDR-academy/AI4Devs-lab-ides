import { Candidate, PrismaClient } from '@prisma/client';
import { CreateCandidateDto, FileInfo } from '../../dtos/candidate.dto';
import { NotFoundError, ValidationError } from '../../utils/AppError';
import fileStorageService from '../fileStorage/fileStorageService';

export class CandidateService {
  constructor(private prisma: PrismaClient) {}

  private validateRequiredFields(data: CreateCandidateDto) {
    const requiredFields = ['firstName', 'lastName', 'email'] as const;
    const missingFields = requiredFields.filter(
      (field) => !data[field as keyof CreateCandidateDto],
    );

    if (missingFields.length > 0) {
      throw new ValidationError([
        {
          msg: `Campos requeridos faltantes: ${missingFields.join(', ')}`,
          param: missingFields.join(', '),
          location: 'body',
        },
      ]);
    }
  }

  async createCandidate(
    candidateData: CreateCandidateDto,
    file?: Express.Multer.File,
  ): Promise<Candidate> {
    try {
      this.validateRequiredFields(candidateData);

      const candidate = await this.prisma.candidate.create({
        data: {
          firstName: candidateData.firstName,
          lastName: candidateData.lastName,
          email: candidateData.email,
          phone: candidateData.phone || '',
          address: candidateData.address || '',
          notes: candidateData.notes || '',
          education: candidateData.education
            ? { create: candidateData.education }
            : { create: [] },
          experience: candidateData.experience
            ? { create: candidateData.experience }
            : { create: [] },
        },
        include: {
          education: true,
          experience: true,
        },
      });

      // Procesar archivo si existe
      if (file) {
        try {
          const fileInfo: FileInfo = {
            originalName: file.originalname,
            mimetype: file.mimetype,
            tempPath: file.path,
            candidateId: candidate.id,
          };

          const savedFileName = await fileStorageService.saveFile(fileInfo);
          const resumeUrl = fileStorageService.getFileUrl(savedFileName);

          // Actualizar el candidato con la URL del archivo
          await this.updateCandidate(candidate.id, { resumeUrl });
          candidate.resumeUrl = resumeUrl;
        } catch (fileError) {
          console.error('Error al procesar el archivo:', fileError);
          // No fallamos la creación del candidato si falla el archivo
        }
      }

      return candidate;
    } catch (error) {
      console.error('Error en createCandidate service:', error);
      throw error;
    }
  }

  async getCandidates(): Promise<Candidate[]> {
    try {
      return await this.prisma.candidate.findMany({
        include: {
          education: {
            orderBy: {
              startDate: 'desc',
            },
          },
          experience: {
            orderBy: {
              startDate: 'desc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error en getCandidates service:', error);
      throw error;
    }
  }

  async getCandidateById(id: number): Promise<Candidate> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
      include: {
        education: true,
        experience: true,
      },
    });

    if (!candidate) {
      throw new NotFoundError('Candidato no encontrado');
    }

    return candidate;
  }

  async updateCandidate(
    id: number,
    updateData: Partial<CreateCandidateDto>,
  ): Promise<Candidate> {
    const candidate = await this.prisma.candidate.findUnique({ where: { id } });

    if (!candidate) {
      throw new NotFoundError('Candidato no encontrado');
    }

    const prismaData = {
      ...updateData,
      education: updateData.education
        ? { create: updateData.education }
        : undefined,
      experience: updateData.experience
        ? { create: updateData.experience }
        : undefined,
    };

    return this.prisma.candidate.update({
      where: { id },
      data: prismaData,
    });
  }

  async deleteCandidate(id: number): Promise<void> {
    const candidate = await this.prisma.candidate.findUnique({ where: { id } });

    if (!candidate) {
      throw new NotFoundError('Candidato no encontrado');
    }

    if (candidate.resumeUrl) {
      const fileName = candidate.resumeUrl.split('/').pop();
      if (fileName) {
        await fileStorageService.deleteFile(fileName);
      }
    }

    await this.prisma.candidate.delete({ where: { id } });
  }
}
