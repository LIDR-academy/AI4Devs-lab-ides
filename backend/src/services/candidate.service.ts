import { PrismaClient } from '@prisma/client';
import { 
  ICandidate, 
  CreateCandidateDto, 
  CreateEducationDto, 
  CreateWorkExperienceDto, 
  CreateDocumentDto 
} from '../interfaces/candidate.interface';
import path from 'path';
import fs from 'fs';

export class CandidateService {
  private prisma: PrismaClient;
  private readonly uploadsDir: string;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
    this.uploadsDir = path.join(process.cwd(), 'uploads', 'documents');
  }

  async createCandidate(data: CreateCandidateDto): Promise<ICandidate> {
    try {
      const candidate = await this.prisma.candidate.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address ?? null,
          education: {
            create: data.education.map(edu => ({
              title: edu.title,
              institution: edu.institution,
              startDate: edu.startDate,
              endDate: edu.endDate,
              description: edu.description || null
            }))
          },
          workExperience: {
            create: data.workExperience.map(exp => ({
              company: exp.company,
              position: exp.position,
              startDate: exp.startDate,
              endDate: exp.endDate,
              responsibilities: exp.responsibilities || null
            }))
          }
        },
        include: {
          education: true,
          workExperience: true,
          document: true
        }
      });

      return this.mapPrismaResultToCandidate(candidate);
    } catch (error) {
      throw error;
    }
  }

  async addEducation(candidateId: string, data: CreateEducationDto) {
    const education = await this.prisma.education.create({
      data: {
        ...data,
        candidateId,
        description: data.description ?? null
      }
    });
    return education;
  }

  async addWorkExperience(candidateId: string, data: CreateWorkExperienceDto) {
    const experience = await this.prisma.workExperience.create({
      data: {
        ...data,
        candidateId,
        responsibilities: data.responsibilities ?? null
      }
    });
    return experience;
  }

  async addDocument(candidateId: string, data: CreateDocumentDto, file: Express.Multer.File) {
    // Verificar si ya existe un documento
    const existingDocument = await this.prisma.document.findUnique({
      where: { candidateId }
    });

    if (existingDocument) {
      // Si existe un documento previo, eliminarlo físicamente
      if (existingDocument.filePath) {
        const fullPath = path.join(this.uploadsDir, path.basename(existingDocument.filePath));
        if (fs.existsSync(fullPath)) {
          try {
            fs.unlinkSync(fullPath);
          } catch (error) {
            console.error('Error deleting existing file:', error);
          }
        }
      }
      // Eliminar el registro de la base de datos y lanzar error
      await this.prisma.document.delete({
        where: { candidateId }
      });
      throw new Error('Candidate already has a document');
    }

    // Crear el nuevo documento
    const document = await this.prisma.document.create({
      data: {
        ...data,
        candidateId,
        filePath: file.path,
        fileType: file.mimetype === 'application/pdf' ? 'PDF' : 'DOCX'
      }
    });

    return {
      ...document,
      fileType: document.fileType as 'PDF' | 'DOCX'
    };
  }

  async findCandidateByEmail(email: string): Promise<ICandidate | null> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { email },
      include: {
        education: true,
        workExperience: true,
        document: true
      }
    });

    return candidate ? this.mapPrismaResultToCandidate(candidate) : null;
  }

  async validateDates(startDate: Date, endDate: Date): Promise<boolean> {
    return startDate <= endDate;
  }

  private mapPrismaResultToCandidate(result: any): ICandidate {
    if (!result) return result;
    
    return {
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      phone: result.phone,
      address: result.address,
      education: result.education,
      workExperience: result.workExperience,
      document: result.document ? {
        ...result.document,
        fileType: result.document.fileType as 'PDF' | 'DOCX'
      } : null,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    };
  }
} 