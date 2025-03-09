import { Request } from 'express';
import { CandidateRepository, CreateCandidateData, UpdateCandidateData } from '../repositories/candidateRepository';
import { getFileUrl, deleteFile } from '../middleware/fileUpload';
import { createError } from '../middleware/errorHandler';
import path from 'path';

/**
 * Servicio para la gestión de candidatos
 */
export class CandidateService {
  private candidateRepository: CandidateRepository;

  constructor() {
    this.candidateRepository = new CandidateRepository();
  }

  /**
   * Crear un nuevo candidato
   * @param req Objeto Request de Express
   * @param data Datos del candidato
   * @returns El candidato creado
   */
  async createCandidate(req: Request, data: CreateCandidateData) {
    // Verificar si ya existe un candidato con el mismo email
    const existingCandidate = await this.candidateRepository.findByEmail(data.email);
    if (existingCandidate) {
      throw createError('Ya existe un candidato con este email', 400, 'DUPLICATE_EMAIL');
    }

    // Procesar el archivo CV si existe
    if (req.file) {
      data.cvFileName = req.file.originalname;
      data.cvUrl = getFileUrl(req, req.file.filename);
    }

    // Crear el candidato
    return this.candidateRepository.create(data);
  }

  /**
   * Obtener todos los candidatos
   * @returns Lista de candidatos
   */
  async getAllCandidates() {
    return this.candidateRepository.findAll();
  }

  /**
   * Obtener un candidato por su ID
   * @param id ID del candidato
   * @returns El candidato encontrado o null si no existe
   */
  async getCandidateById(id: number) {
    const candidate = await this.candidateRepository.findById(id);
    
    if (!candidate) {
      throw createError('Candidato no encontrado', 404, 'CANDIDATE_NOT_FOUND');
    }
    
    return candidate;
  }

  /**
   * Actualizar un candidato
   * @param req Objeto Request de Express
   * @param id ID del candidato
   * @param data Datos a actualizar
   * @returns El candidato actualizado
   */
  async updateCandidate(req: Request, id: number, data: UpdateCandidateData) {
    // Verificar si el candidato existe
    const candidate = await this.candidateRepository.findById(id);
    if (!candidate) {
      throw createError('Candidato no encontrado', 404, 'CANDIDATE_NOT_FOUND');
    }
    
    // Verificar si se está actualizando el email y si ya existe
    if (data.email && data.email !== candidate.email) {
      const existingCandidate = await this.candidateRepository.findByEmail(data.email);
      if (existingCandidate) {
        throw createError('Ya existe un candidato con este email', 400, 'DUPLICATE_EMAIL');
      }
    }
    
    // Procesar el archivo CV si existe
    if (req.file) {
      // Eliminar el archivo anterior si existe
      if (candidate.cvUrl) {
        const filename = path.basename(candidate.cvUrl);
        const filePath = path.join(__dirname, '../../uploads/cv', filename);
        deleteFile(filePath);
      }
      
      // Actualizar con el nuevo archivo
      data.cvFileName = req.file.originalname;
      data.cvUrl = getFileUrl(req, req.file.filename);
    }
    
    // Actualizar el candidato
    return this.candidateRepository.update(id, data);
  }

  /**
   * Eliminar un candidato
   * @param id ID del candidato
   * @returns El candidato eliminado
   */
  async deleteCandidate(id: number) {
    // Verificar si el candidato existe
    const candidate = await this.candidateRepository.findById(id);
    if (!candidate) {
      throw createError('Candidato no encontrado', 404, 'CANDIDATE_NOT_FOUND');
    }
    
    // Eliminar el archivo CV si existe
    if (candidate.cvUrl) {
      const filename = path.basename(candidate.cvUrl);
      const filePath = path.join(__dirname, '../../uploads/cv', filename);
      deleteFile(filePath);
    }
    
    // Eliminar el candidato
    return this.candidateRepository.delete(id);
  }
} 