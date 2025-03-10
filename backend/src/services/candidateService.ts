import { Request } from 'express';
import { CandidateRepository } from '../repositories/candidateRepository';
import { CreateCandidateData, UpdateCandidateData } from '../dtos/candidateDto';
import { getFileUrl, deleteFile } from '../middleware/fileUpload';
import { createError } from '../middleware/errorHandler';
import path from 'path';
import { Candidate } from '@prisma/client';
import * as fs from 'fs';
import { EducationService } from './educationService';
import { WorkExperienceService } from './workExperienceService';
import { AutocompleteService } from './autocompleteService';
import { ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Servicio para la gestión de candidatos
 */
export class CandidateService {
  private candidateRepository: CandidateRepository;
  private educationService: EducationService;
  private workExperienceService: WorkExperienceService;
  private autocompleteService: AutocompleteService;
  private uploadDir: string;

  constructor() {
    this.candidateRepository = new CandidateRepository();
    this.educationService = new EducationService();
    this.workExperienceService = new WorkExperienceService();
    this.autocompleteService = new AutocompleteService();
    this.uploadDir = path.join(__dirname, '../../uploads');
    
    // Asegurar que el directorio de uploads existe
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Crear un nuevo candidato
   * @param data Datos del candidato
   * @param file Archivo CV (opcional)
   * @returns El candidato creado
   */
  async createCandidate(data: CreateCandidateData, file?: any): Promise<Candidate> {
    // Validar datos
    if (!data.firstName || !data.lastName || !data.email || !data.phone) {
      throw new ValidationError('Nombre, apellido, email y teléfono son obligatorios');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new ValidationError('Formato de email inválido');
    }

    // Verificar si ya existe un candidato con ese email
    const existingCandidate = await this.candidateRepository.findByEmail(data.email);
    if (existingCandidate) {
      throw new ValidationError('Ya existe un candidato con ese email');
    }

    // Manejar el archivo CV si existe
    if (file) {
      // Multer ya ha movido el archivo a la ubicación correcta
      // Solo necesitamos guardar la ruta en la base de datos
      data.cvUrl = `/uploads/cv/${file.filename}`;
      data.cvFileName = file.originalname;
    } else {
      throw new ValidationError('El CV es obligatorio');
    }

    // Procesar datos de educación
    if (data.education && Array.isArray(data.education)) {
      // Guardar instituciones y títulos en las tablas de autocompletado
      for (const edu of data.education) {
        if (edu && typeof edu === 'object') {
          if (edu.institution) await this.autocompleteService.saveInstitution(edu.institution);
          if (edu.degree) await this.autocompleteService.saveDegree(edu.degree);
          if (edu.fieldOfStudy) await this.autocompleteService.saveFieldOfStudy(edu.fieldOfStudy);
        }
      }
    }

    // Procesar datos de experiencia laboral
    if (data.workExperience && Array.isArray(data.workExperience)) {
      // Guardar empresas y posiciones en las tablas de autocompletado
      for (const exp of data.workExperience) {
        if (exp && typeof exp === 'object') {
          if (exp.company) await this.autocompleteService.saveCompany(exp.company);
          if (exp.position) await this.autocompleteService.savePosition(exp.position);
        }
      }
    }

    // Crear el candidato
    return this.candidateRepository.create(data);
  }

  /**
   * Obtener todos los candidatos
   * @returns Lista de candidatos
   */
  async getAllCandidates(): Promise<Candidate[]> {
    return this.candidateRepository.findAll();
  }

  /**
   * Obtener un candidato por ID
   * @param id ID del candidato
   * @returns El candidato encontrado o null
   */
  async getCandidateById(id: number): Promise<Candidate | null> {
    return this.candidateRepository.findById(id);
  }

  /**
   * Actualizar un candidato
   * @param id ID del candidato
   * @param data Datos a actualizar
   * @param file Archivo CV (opcional)
   * @returns El candidato actualizado o null
   */
  async updateCandidate(id: number, data: UpdateCandidateData, file?: any): Promise<Candidate | null> {
    // Verificar si el candidato existe
    const candidate = await this.candidateRepository.findById(id);
    if (!candidate) {
      return null;
    }

    // Validar formato de email si se proporciona
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new ValidationError('Formato de email inválido');
      }

      // Verificar si ya existe otro candidato con ese email
      const existingCandidate = await this.candidateRepository.findByEmail(data.email);
      if (existingCandidate && existingCandidate.id !== id) {
        throw new ValidationError('Ya existe otro candidato con ese email');
      }
    }

    // Manejar el archivo CV si existe
    if (file) {
      // Eliminar el archivo anterior si existe
      if (candidate.cvUrl) {
        const oldFilePath = path.join(__dirname, '../..', candidate.cvUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Multer ya ha movido el archivo a la ubicación correcta
      // Solo necesitamos guardar la ruta en la base de datos
      data.cvUrl = `/uploads/cv/${file.filename}`;
      data.cvFileName = file.originalname;
    }

    // Procesar datos de educación
    if (data.education && Array.isArray(data.education)) {
      // Actualizar registros de educación
      await this.candidateRepository.updateEducation(id, data.education);
      
      // Guardar instituciones y títulos en las tablas de autocompletado
      for (const edu of data.education) {
        if (edu && typeof edu === 'object') {
          if (edu.institution) await this.autocompleteService.saveInstitution(edu.institution);
          if (edu.degree) await this.autocompleteService.saveDegree(edu.degree);
          if (edu.fieldOfStudy) await this.autocompleteService.saveFieldOfStudy(edu.fieldOfStudy);
        }
      }
    }

    // Procesar datos de experiencia laboral
    if (data.workExperience && Array.isArray(data.workExperience)) {
      // Actualizar registros de experiencia laboral
      await this.candidateRepository.updateWorkExperience(id, data.workExperience);
      
      // Guardar empresas y posiciones en las tablas de autocompletado
      for (const exp of data.workExperience) {
        if (exp && typeof exp === 'object') {
          if (exp.company) await this.autocompleteService.saveCompany(exp.company);
          if (exp.position) await this.autocompleteService.savePosition(exp.position);
        }
      }
    }

    // Actualizar el candidato
    const { education, workExperience, ...candidateData } = data;
    return this.candidateRepository.update(id, candidateData);
  }

  /**
   * Eliminar un candidato
   * @param id ID del candidato
   * @returns El candidato eliminado
   */
  async deleteCandidate(id: number): Promise<Candidate> {
    // Verificar si el candidato existe
    const candidate = await this.candidateRepository.findById(id);
    if (!candidate) {
      throw new Error('Candidato no encontrado');
    }

    // Eliminar el archivo CV si existe
    if (candidate.cvUrl) {
      const filePath = path.join(__dirname, '../..', candidate.cvUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Eliminar el candidato
    return this.candidateRepository.delete(id);
  }
} 